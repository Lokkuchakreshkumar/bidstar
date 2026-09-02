# API Design Strategies — Reference

Read this when designing or reviewing an endpoint, request/response contract, or public/internal API surface.

## 1. Resource design

- Nouns, not verbs: `/orders/{id}/cancel` (action-as-sub-resource or POST) beats `/cancelOrder?id=`. Reserve verbs for actions that don't map to a resource state change.
- Keep nesting shallow (2 levels max: `/orders/{id}/items`, not `/customers/{id}/orders/{id}/items/{id}/notes`). Deep nesting couples clients to a URL structure that breaks the moment the hierarchy changes.
- Consistent pluralization and casing across the whole API — inconsistency is a constant source of client bugs and support tickets.

## 2. Versioning

- URI versioning (`/v1/orders`) is the most explicit and cache-friendly; header versioning (`Accept: application/vnd.api+json;version=2`) keeps URLs stable but is easy for clients to miss.
- Whichever you pick, commit to a **deprecation policy**: announce, set a sunset date, send a `Sunset` / `Deprecation` header on old-version responses, give clients a real migration window before removal.
- Prefer additive, backward-compatible changes over new versions where possible (see §7) — versioning is for genuine breaking changes, not every change.

## 3. Request/response contracts

- Consistent response envelope across all endpoints (e.g. `{ data, error, meta }`) so clients write one parsing path, not one per endpoint.
- Pagination: prefer **cursor-based** (`?after=<opaque_cursor>`) over offset-based (`?offset=100`) for any dataset that changes while being paged — offset pagination skips/duplicates rows when data is inserted/deleted mid-page. Offset is fine for small, static, or admin-only lists.
- Filtering/sorting: consistent query param conventions (`?status=paid&sort=-created_at`) documented once, not reinvented per endpoint.
- Return only what the client needs by default; support field selection (`?fields=id,status`) for heavy resources rather than always returning everything.

## 4. Status codes (use correctly, not loosely)

| Code | Meaning | Use for |
|---|---|---|
| 200 | OK | successful GET/PUT/PATCH with body |
| 201 | Created | successful POST that created a resource; include `Location` header |
| 202 | Accepted | async processing started, not yet complete |
| 204 | No Content | successful action with no body (DELETE) |
| 400 | Bad Request | malformed request — client error, not retryable as-is |
| 401 | Unauthorized | missing/invalid auth |
| 403 | Forbidden | authenticated but not permitted |
| 404 | Not Found | resource doesn't exist |
| 409 | Conflict | state conflict (duplicate create, version mismatch) |
| 422 | Unprocessable | syntactically valid, semantically invalid (validation failure) |
| 429 | Too Many Requests | rate limited — include `Retry-After` |
| 500 | Internal Error | unexpected server fault — don't leak internals |
| 502/503/504 | Bad Gateway/Unavailable/Timeout | upstream dependency failure — usually retryable by the client |

Returning 200 with an error payload buried in the body (instead of the right status code) breaks every generic HTTP client, retry policy, and monitoring dashboard that relies on status codes. Don't do it.

## 5. Idempotency keys for unsafe methods

- For any POST that has a real side effect (charge, order, email), accept an `Idempotency-Key` header from the client. Store `key → response` server-side; on a repeat key, return the stored response instead of re-executing.
- This is what makes it *safe* for the client (or your own retry logic) to retry a POST — without it, retrying a POST is a guess, not an operation.

## 6. Communicating rate limits

- Send `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` on every response (not just on 429) so well-behaved clients can self-throttle before hitting the wall.
- Always send `Retry-After` on a 429.

## 7. Backward compatibility

- Additive-only for non-breaking changes: new optional fields, new endpoints, new enum values (if clients are told to tolerate unknown values). Adding a required field or changing a field's type/meaning is breaking.
- Never repurpose an existing field's meaning — add a new field and deprecate the old one instead.
- Contract testing (e.g. consumer-driven contracts) catches accidental breaking changes before they ship, especially with multiple client teams.

## 8. Webhooks (you as the sender)

- Sign every payload (HMAC with a per-consumer secret) so receivers can verify authenticity.
- Include a timestamp and a unique event ID in every payload.
- Retry delivery on failure with backoff, capped attempts, then stop and let the receiver's own reconciliation/polling catch up — don't retry forever.
- Document explicitly that delivery is at-least-once and may be out-of-order — receivers must dedupe by event ID and not assume ordering.

## 9. Async operation pattern

- For work that can't complete within a normal request timeout: return `202 Accepted` with a status/polling URL, or accept a callback URL and webhook the result back.
- Give the client a way to check status (`GET /jobs/{id}`) — don't force polling to be the only option if the operation can take minutes.

## 10. Contract-first documentation

- Maintain an OpenAPI (or equivalent) spec as the source of truth, not hand-written docs that drift from the implementation. Generate docs/client SDKs from it where possible so they can't silently go stale.
