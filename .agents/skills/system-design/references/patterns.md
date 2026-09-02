# Resilience Patterns — Reference

Read this when adding, reviewing, or debugging any code that calls a network dependency (external API, database, cache, queue, another internal service).

## 1. Timeouts

- Every network call gets an explicit timeout. No default/infinite waits, ever — a hung call ties up a thread/connection until something else breaks.
- Distinguish **connect timeout** (can't even open the connection) from **read/response timeout** (connected but no response) from **total request timeout** (includes retries). Set all three where the client library allows it.
- In a call chain (A → B → C), each hop's timeout must be shorter than the caller's remaining budget. If A gives itself 5s total and spends 1s before calling B, B's timeout should be ≤4s minus buffer — not another independent 5s. Otherwise a slow C silently blows A's deadline.
- Pass the remaining deadline downstream when possible (deadline propagation) rather than each hop guessing independently.

## 2. Retries

- Retry only operations that are **safe to retry**: idempotent by nature (GET, PUT with full replacement) or protected by an idempotency key (see payments.md). Never blind-retry a POST that creates a side effect without one.
- Retryable conditions: connection refused/reset, timeout, 502/503/504, 429 (respect `Retry-After` if present).
- Non-retryable: 400/401/403/404/409/422 — the request itself is wrong; retrying won't fix it. Retrying a 401 hammers the auth system for nothing.
- Backoff: exponential, with **jitter** (randomized delay) — without jitter, many clients that failed at the same moment retry at the same moment and create a second wave of load (retry storm). Full jitter (`random(0, base * 2^attempt)`) beats fixed exponential.
- Cap the retry count (2–3 is typical) AND cap the total time spent retrying, so a caller isn't silently blocked for minutes.
- **Retry budget**: limit retries to some % of total outbound traffic (e.g. 10%) at the client/library level. Without a budget, a struggling dependency gets MORE load from retries exactly when it can least handle it — retries can turn a partial outage into a total one.

## 3. Circuit breakers

- States: **closed** (normal, calls go through) → **open** (calls fail immediately, no network call made) → **half-open** (a trickle of probe calls test if the dependency recovered) → back to closed or open.
- Trip on either consecutive failures (simple) or a rolling error-rate window (better — tolerates occasional blips without tripping).
- While open: fail fast with a clear error or serve the fallback — don't queue calls waiting for the breaker to close.
- Worth adding for hot-path calls to dependencies that can be slow-not-down (the dangerous case — see Bulkheads). Often skippable for low-traffic internal/admin calls; that's a conscious skip, not a default omission.

## 4. Bulkheads

- Isolate failure domains so one struggling dependency can't starve calls to everything else. A slow (not down) dependency is worse than a dead one — dead fails fast, slow ties up threads/connections until the whole pool is exhausted, and unrelated requests start failing too.
- Implementation: separate connection pools / thread pools / semaphores per dependency, sized to that dependency's expected concurrency, not shared globally.
- This is the pattern most often skipped, and the one most responsible for "one vendor outage took down our whole API" incidents.

## 5. Rate limiting

- **Outbound**: respect the dependency's documented limits so you don't get throttled or banned. Read `X-RateLimit-*` / `Retry-After` response headers if the provider sends them.
- **Inbound**: protect your own service from being overwhelmed (by a client bug, a scraper, or legitimate burst traffic).
- Algorithms: token bucket (allows bursts up to a cap, smooths after), leaky bucket (strict smoothing), sliding window (accurate but more state), fixed window (simplest, has edge-burst issues at window boundaries).
- Per-client limits (API key / user / IP) prevent one bad actor from exhausting the global limit for everyone else.
- On rejection, return 429 with a `Retry-After` header — don't just drop the request silently.

## 6. Backpressure & load shedding

- Bounded queues everywhere (in-memory queues, connection pools, thread pools). An unbounded queue doesn't prevent overload, it just delays and hides it — until memory runs out.
- When a queue/pool is full: reject new work explicitly (503, or a queue-full error) rather than accepting it and getting slower for everyone, including in-flight requests.
- Under sustained overload, shed load deliberately — priority-based (drop low-priority requests first) or load-based (return degraded/cached responses instead of full computation).

## 7. Caching

- Patterns: cache-aside (app checks cache, falls to source on miss, writes back), read-through/write-through (cache library owns the source calls), write-behind (writes go to cache first, flushed to source async — higher throughput, risk of loss on crash).
- TTL: add jitter to expiry times across keys — many keys expiring at the exact same moment causes a stampede of simultaneous source-fetches (thundering herd on cache expiry).
- **Cache stampede protection**: when a popular key expires, use single-flight/locking so only one request repopulates it while others wait or serve stale, instead of N concurrent requests all hitting the source at once.
- Stale-while-revalidate: serve the stale value immediately, refresh in the background — better perceived latency and avoids the stampede entirely for read-heavy hot keys.

## 8. Health checks

- **Liveness**: is the process alive/not deadlocked. Failing this → orchestrator restarts the instance.
- **Readiness**: can the instance currently serve traffic (dependencies reachable, not overloaded, finished startup). Failing this → orchestrator/load-balancer routes traffic away, but does NOT restart — the instance may recover on its own (e.g. a dependency comes back).
- Conflating the two causes bad incidents: a readiness failure (dependency down) that's wired to liveness triggers needless restarts of a perfectly healthy process, which does nothing to fix the actual problem and adds restart churn on top of it.

## 9. Graceful shutdown

- On SIGTERM: stop accepting new connections/requests, deregister from the load balancer/service registry, finish in-flight requests (with a hard deadline), then exit.
- Without this, rolling deploys / autoscaling drop in-flight requests every time an instance is cycled.

## 10. Idempotency

- Any operation that can be retried or delivered more than once (client retry, at-least-once queue delivery, network ambiguity) needs a way to detect and dedupe repeats.
- Idempotency key pattern: caller generates a unique key per logical operation; server stores `(key → result)` and returns the stored result on a repeat instead of re-executing. TTL the store (don't keep keys forever).
- Naturally idempotent operations (PUT with full resource replacement, DELETE) don't need a key. POST that creates something does.

## 11. Dead-letter queues & poison messages

- Async/queue consumers: cap redelivery attempts. A message that fails every time (bad payload, unhandled edge case) should not retry forever and block the queue behind it.
- After the cap, move it to a dead-letter queue, alert, and allow manual/automated replay after the bug is fixed — don't just drop it silently.
