# Failure Scenario Catalog — Reference

Concrete "what if X happens" scenarios to stress-test a design against. When drafting a RESILIENCE.md entry, walk the relevant rows below and make sure the entry's answer isn't silently `UNRESOLVED` for any that apply.

| Scenario | Why it's dangerous if unhandled | Handle with |
|---|---|---|
| Dependency completely down | Requests hang or fail with no clear signal | Timeout + circuit breaker (fail fast) + fallback |
| Dependency slow, not down | Worse than down — ties up threads/connections until YOUR service is also degraded | Bulkhead (isolated pool) + timeout + circuit breaker |
| Dependency returns malformed/unexpected data | Unhandled parse errors crash the request or worse, silently corrupt state | Schema validation on every response, treat parse failure as a dependency error, not a bug to swallow |
| Dependency rate-limits you (429) | Naive retry hammers it harder, digs the hole deeper | Respect `Retry-After`, back off, check whether YOUR retry logic caused the burst |
| Retry storm / thundering herd | Many clients fail simultaneously (e.g. after an outage ends) and all retry at once, re-causing the outage | Backoff with jitter, retry budgets, staggered reconnect |
| Cascading failure | One slow dependency exhausts a shared thread/connection pool, unrelated endpoints start failing too | Bulkheads (isolated pools per dependency) |
| Duplicate message delivery (at-least-once queues) | Side effect (charge, email, decrement) happens twice | Idempotency key / dedupe by message ID |
| Out-of-order message delivery | State machine receives events in an order it didn't expect (e.g. "refunded" before "captured") | Explicit state machine that validates legal transitions, buffers/rejects illegal ones |
| Poison message (always fails processing) | Blocks the queue behind it if redelivered forever | Max redelivery count → dead-letter queue → alert |
| Database connection pool exhaustion | New requests can't get a connection, everything backs up | Bounded pool sized to capacity, timeout on pool checkout, bulkhead per major query pattern if one query type is prone to running long |
| Network partition / split-brain | Two nodes both think they're the leader/source of truth, diverging state | Consensus protocol or single source of truth by design; detect and alert on partition, don't silently let both sides write |
| Clock skew between services | Timestamp-based logic (token expiry, replay protection, ordering) behaves inconsistently across nodes | NTP-synced clocks; prefer logical/monotonic ordering over wall-clock comparison where correctness matters |
| Cold start / autoscale latency spike | First requests after a scale-up event are slow or time out, tripping circuit breakers unnecessarily | Warm-up period excluded from breaker stats, or pre-warmed capacity for spiky load |
| Rolling deploy drops in-flight requests | Requests fail mid-deploy for no reason visible in the code | Graceful shutdown (drain before exit) + deregister from LB before stopping |
| Partial outage (some endpoints work, others don't) | Health check reports "healthy" or "down" as one blob, hiding which parts actually work | Per-dependency readiness signals, not one aggregate boolean |
| Ambiguous write outcome (timeout on a write) | Caller doesn't know if the write happened — blind retry risks duplicate, blind fail risks losing a real success | Treat as `unknown` state, reconcile via status check, never blind-retry a non-idempotent write |
| Region/AZ failure | Everything pinned to one region goes down together | Multi-AZ at minimum for anything critical; explicit failover plan, not an assumption it'll "just work" |
| Third-party outage during a checkout/critical flow | User stuck mid-flow with no path forward | Fallback UX (queue it for later, degrade to a manual path, clear messaging) — not a silent hang |

## How to use this catalog

1. When a new external dependency or async flow is introduced, scan this table and note which rows genuinely apply (not all will).
2. For each applicable row, the RESILIENCE.md entry's fallback/retry/idempotency fields should have a real answer — or explicitly `UNRESOLVED, ask user` if genuinely undecided. Don't skip a row silently just because it's inconvenient to think through.
3. Revisit after an actual incident: add the scenario that just happened if it isn't already here, and update the entry that should have caught it.
