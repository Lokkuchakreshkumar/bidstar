---
name: system-design
description: Enforces robust backend engineering — resilience patterns (timeouts, retries, circuit breakers, bulkheads, rate limiting, backpressure, caching, idempotency), API design (versioning, pagination, status codes, contracts, webhooks), error handling (taxonomy, structured errors, correlation IDs), and payment-flow safety (idempotency keys, webhook verification, reconciliation, double-charge prevention). Use for ANY endpoint, integration, background job, webhook, queue consumer, or payment flow — even happy-path-only asks. Also for API surface design, error response shapes, or incident debugging (timeout, cascading failure, retry storm, duplicate charge, dropped webhook). Trigger on "call the X API," "integrate with," "payment," "charge," "webhook," "background job," "design an endpoint," or distributed-systems bug reports. Not optional — undocumented failure handling on a network dependency, payment side effect, or new API contract blocks calling the code done.
---

# System Design — Robust Backend Engineering

Most coding agents write the happy path: call the dependency, use the response, move on. A senior backend engineer automatically asks what happens when that dependency is slow, down, rate-limited, lying, or being called twice by accident. This skill is the discipline for making that thinking explicit, written down, and checked — not assumed away.

This skill has a workflow (below) plus five deep-reference files. Read the relevant reference(s) based on what's actually being built — don't load all of them for a small task.

| Situation | Read |
|---|---|
| Adding/reviewing any network call, retry, cache, queue consumer | `references/patterns.md` |
| Designing or reviewing an endpoint, request/response shape, versioning, webhooks-as-sender | `references/api-design.md` |
| Deciding error response shape, classifying a failure, debugging a weird error | `references/error-handling.md` |
| ANY payment, charge, refund, payout, subscription, or billable side effect | `references/payments.md` (read this one every time money is involved — it's stricter than the general patterns) |
| Stress-testing a design, or debugging an incident | `references/failure-scenarios.md` |

## File: RESILIENCE.md

Keep one file at the repo root (or per-service root in a monorepo):

```
/
├── RESILIENCE.md
└── src/
```

Create it lazily — the first time a dependency's failure handling gets pinned down, not before.

### Entry format

Purely descriptive. State the decision and where it lives in code, not the reasoning essay.

```
## Orders Service → Payment Gateway
- Calls: POST /charge, on checkout submit
- Timeout: 5s, set in paymentClient config
- Retry: 2 retries, exponential backoff + jitter (base 200ms) — only on 5xx/timeout, never on 4xx
- Circuit breaker: opens after 5 consecutive failures, half-open probe after 30s
- Rate limit (outbound): capped at gateway's documented 100 req/s
- Fallback: none — payment failure surfaces to user as "try again," order not created
- Idempotency: charge request keyed by order_id, gateway dedupes on that key
- Status: DONE
- Code: paymentClient.ts, circuitBreaker.ts
```

Fields:
- **Calls** — what it hits and when (the trigger).
- **Timeout** — the actual bound. "None set" is valid but must be stated, never silently omitted.
- **Retry** — policy, or `no retry — <reason>` (e.g. non-idempotent write with no key).
- **Circuit breaker** — thresholds, or `not applied — <reason>`.
- **Rate limit** — inbound and/or outbound — state which.
- **Fallback** — what the caller/user actually sees when the dependency is unavailable. "We'll handle it" is not a fallback.
- **Idempotency** — is retrying this safe, and what makes it safe.
- **Status** — `DONE` or `UNRESOLVED, ask user`. Never invent a policy for anything consequential (payments, irreversible writes) — ask.
- **Code** — file/function pointers, kept current.

For payment-related entries, also apply everything in `references/payments.md` — that file's requirements (idempotency keys, webhook verification, reconciliation) are mandatory, not optional line items.

## During the session

### Before adding a network call or API contract, check RESILIENCE.md and read the relevant reference

Before writing code that calls an external API, database, cache, queue, or another internal service — or designing a new endpoint — check whether that dependency/endpoint already has an entry, and read the matching reference file from the table above. Draft the entry alongside the implementation, not after.

### Don't wait to be asked — raise it

The moment the user describes a new integration, endpoint, or payment flow, that's a RESILIENCE.md entry and possibly an api-design.md / payments.md pass waiting to happen. Bring up the failure-mode questions unprompted: "What should happen if this API is down — retry, queue it, or fail the request? And is this a POST that needs an idempotency key?" Don't silently ship a bare `fetch()` and call it done.

### Stress-test against the failure catalog

Walk `references/failure-scenarios.md` for anything relevant to what's being built. If the user hasn't thought about a row that clearly applies, that's `UNRESOLVED`, not a guess dressed up as a decision.

### Cross-reference the map against the actual code

If RESILIENCE.md says a call has a 5s timeout and a circuit breaker, but the code shows a bare call with neither, surface the contradiction — don't let the doc quietly outrun the implementation.

### Push past vague resilience claims

"We'll handle errors" / "should be resilient" / "add retries" is not a policy. Push for specifics: how many retries, backoff shape, which errors are retryable, what the caller sees on final failure, whether an idempotency key is involved.

### Payments get the strict path, always

Any code touching money gets `references/payments.md` applied in full — idempotency keys, webhook signature verification, explicit state machine, reconciliation job — regardless of how small or "just an MVP" the feature is framed as. This is the one area where cutting corners has a direct dollar cost, and it's cheap to do right from the start and expensive to retrofit after the first double-charge.

### Update inline, not in batch

Write or correct the RESILIENCE.md entry in the same turn the decision is made.

## What this skill does NOT do

- It doesn't mandate every pattern for every call. A low-traffic internal admin endpoint doesn't need a circuit breaker — this forces a *conscious* decision, not blanket paranoia.
- It doesn't replace load testing or chaos engineering. RESILIENCE.md records intent; verifying it under real failure is a separate step.
- It doesn't give compliance/legal sign-off (PCI-DSS, SOC2, etc.) — `references/payments.md` flags where compliance scope matters, but the actual compliance review is a human/specialist task.
- It doesn't design the overall service architecture, data model, or team boundaries — it's scoped to how dependency calls, APIs, and payment flows behave and fail.
