# System Resilience & Dependency Failure Catalog

This document records the exact failure-mode handling, timeouts, retry policies, circuit breakers, rate limits, and idempotency guarantees for every external and infrastructure dependency of **bidstar**.

---

## 1. Application Backend → Dodo Payments Gateway

- **Calls**: `POST https://api.dodopayments.com/checkout_sessions` (on checkout initiation), `GET https://api.dodopayments.com/payments/{id}` (on verification fallback)
- **Timeout**:
  - Connect Timeout: 3,000ms
  - Total Request Timeout: 8,000ms via `AbortSignal.timeout(8000)`
- **Retry Policy**:
  - Max Retries: 2 retries (total 3 attempts)
  - Backoff: Exponential with full jitter (`random(0, base * 2^attempt)` with `base = 250ms`)
  - Retryable: Network dropouts, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout
  - Non-Retryable: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity
- **Circuit Breaker**: Half-open probe after 5 consecutive 5xx errors across a 30s rolling window
- **Rate Limit (Inbound on Checkout)**: 5 requests / minute per client IP (sliding window), returns `429 Too Many Requests` with `Retry-After: 60`
- **Idempotency**: Every checkout request generates or accepts a unique `idempotency_key` (`idemp_...`). Stored in the `payments` collection to prevent double session creation.
- **Fallback**: Returns structured API error with sanitized user message (`"Payment gateway is experiencing temporary latency. Your account has not been charged."`) and user action guidance.
- **Status**: DONE
- **Code**: `src/app/api/checkout/route.ts`, `src/lib/dodo-client.ts`

---

## 2. Dodo Payments Webhook → Ingestion Endpoint

- **Calls**: `POST /api/webhook/dodo` (triggered asynchronously by Dodo Payments upon payment success/failure)
- **Signature Verification**: Mandatory Svix / HMAC-SHA256 verification using `webhook-id`, `webhook-timestamp`, and `webhook-signature` against `DODO_PAYMENTS_WEBHOOK_KEY` / `WEBHOOK_SECRET`
- **Replay Attack Prevention**: Enforces timestamp freshness check. Any webhook with timestamp older than 300 seconds (5 minutes) is rejected with `400 Bad Request`.
- **Deduplication**: Webhook event ID (`event_id` or `payment_id`) is stored in the `webhook_events` collection before processing. If an event has already been recorded, the handler immediately returns `200 OK` (deduplicated) without executing duplicate ranking increments.
- **State Machine**: Legal transitions only:
  ```
  INITIATED → PENDING → SUCCEEDED
                     ↘ FAILED
  ```
  Illegal transitions (e.g. `SUCCEEDED → PENDING`) are rejected and logged to prevent inconsistent balances.
- **Processing Time SLA**: Returns `200 OK` within 2,000ms; executes ranking and activity broadcasts atomically.
- **Status**: DONE
- **Code**: `src/app/api/webhook/dodo/route.ts`

---

## 3. Application Backend → MongoDB Atlas Replica Set

- **Calls**: CRUD operations on `heroes`, `bids`, `payments`, `activity_events`, `hero_requests`, `webhook_events`
- **Connection Pooling**: Managed via global singleton `MongoClient` with max pool size 50, min pool size 5
- **Timeout**:
  - `serverSelectionTimeoutMS`: 5,000ms
  - `connectTimeoutMS`: 5,000ms
  - `socketTimeoutMS`: 10,000ms
- **Transactions & ACID Guarantee**: Multi-document ACID transactions via `session.withTransaction()` on all payment settlements (atomic hero amount update, bid insert, payment status update, and activity stream log).
- **Retryable Writes**: Enabled natively via connection string (`retryWrites=true&w=majority`).
- **Health Check**: Monitored via `/api/health` with `admin.ping()` latency tracking.
- **Status**: DONE
- **Code**: `src/lib/mongodb.ts`, `src/lib/db-server.ts`, `src/app/api/health/route.ts`

---

## 4. Real-time Broadcast → Server-Sent Events (SSE)

- **Calls**: `GET /api/activity/stream` (persistent SSE connection for live leaderboard activity ticker)
- **Keep-Alive Heartbeat**: Sends heartbeat comment (`: ping\n\n`) every 15 seconds to prevent intermediate proxy / load balancer socket disconnects.
- **Backpressure & Client Disconnect**: Detects client `AbortSignal` and releases listener references immediately to prevent memory leaks.
- **Rate Limit**: Max 10 active connections per IP address.
- **Status**: DONE
- **Code**: `src/app/api/activity/stream/route.ts`

---

## 5. Client → Public APIs (Rate Limiting & Bulkheading)

- **Inbound Endpoints**:
  - `/api/checkout`: 5 req / min per IP
  - `/api/requests`: 3 req / min per IP (anti-spam on hero suggestions)
  - `/api/bids`: 30 req / min per IP
  - `/api/heroes`: 60 req / min per IP
- **Rate Limiting Algorithm**: Sliding window counter with in-memory store
- **Headers Returned**:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (when 429 triggered)
- **Correlation / Trace IDs**: Every incoming request is assigned a unique `X-Trace-Id` (propagated through all logs and error responses).
- **Status**: DONE
- **Code**: `src/lib/rate-limiter.ts`, `src/lib/api-response.ts`
