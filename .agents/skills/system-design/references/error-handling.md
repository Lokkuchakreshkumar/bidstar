# Error Handling — Reference

Read this when designing error responses, handling failures from a dependency, or debugging why an error was mishandled.

## 1. Classify before you handle

Every error falls into one of these — classify it before deciding what to do:

| Class | Examples | Retryable? |
|---|---|---|
| Client error (request is wrong) | 400, 401, 403, 404, 422 | No — fix the request, don't retry as-is |
| Rate limited | 429 | Yes, after `Retry-After` |
| Transient server/network | timeout, connection reset, 502/503/504 | Yes, with backoff+jitter |
| Permanent server fault | 500 with a consistent reproducible cause | No — retrying won't help, needs a fix |
| Ambiguous / unknown outcome | timeout on a write, connection dropped mid-response | Treat as unknown, not failed — see payments.md for the write case |

Handling code that doesn't first classify the error tends to either retry things that will never succeed (wastes time, hammers a broken client input) or give up on things that would have succeeded on retry (unnecessary user-facing failures).

## 2. Structured error responses

Use one consistent shape across the whole API:

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Only 2 units of SKU-123 are available.",
    "trace_id": "a1b2c3d4",
    "details": [ { "field": "quantity", "issue": "exceeds available stock" } ]
  }
}
```

- `code`: a stable machine-readable string clients can branch on — never make clients parse `message` to detect an error type.
- `message`: human-readable, safe to show or log — never a raw stack trace or internal exception string.
- `trace_id`: ties this response to server-side logs; always log it alongside the full internal error.
- `details`: structured, per-field where relevant (see §5).

## 3. Never leak internals to external clients

- No stack traces, SQL fragments, internal file paths, internal service names, or library exception messages in client-facing responses. These are an information-disclosure risk and are useless to the caller anyway.
- Log the full internal detail server-side (with the trace_id), return the sanitized version to the client.

## 4. Correlation / trace IDs

- Generate a trace/request ID at the edge (or accept one passed in from upstream) and propagate it through every downstream call and every log line for that request.
- Without this, debugging a multi-service failure means grepping logs by timestamp and guessing — with it, it's one query across every service's logs.

## 5. Validation errors — return everything at once

- If a request fails validation on 3 fields, return all 3 in one response, not one-at-a-time forcing the client through 3 round trips to discover each successive error.
- Field-level detail (`field`, `issue`) lets clients show inline errors instead of one generic banner.

## 6. Partial failure in batch operations

- A batch endpoint (`POST /items/bulk`) where 8 of 10 succeed should not be all-or-nothing-reported. Use `207 Multi-Status` (or an equivalent per-item result array) so the client knows exactly which items failed and why, and doesn't have to guess or resubmit successful ones.

## 7. Logging vs alerting — avoid alert fatigue

- Log every error, always, with full context and trace_id.
- Alert on **error budget / SLO burn**, not on individual errors — a single 500 is normal background noise in any real system; a spike above the accepted error rate is what needs a human. Alerting on every error trains people to ignore alerts.
- Distinguish expected errors (a 404 for a resource that legitimately doesn't exist, a 401 for an expired token) from unexpected ones (a 500 from an unhandled exception) — only the latter belongs in the same alert tier as an outage.

## 8. Common failure signatures and what they actually mean

| Symptom | Likely cause | First thing to check |
|---|---|---|
| Connection refused | Target process down or wrong port | Is the service actually up, is the port/hostname right |
| DNS resolution failure | Service discovery issue, bad config | DNS/service registry, not the target service itself |
| TLS handshake failure | Expired/mismatched cert, protocol mismatch | Certificate validity and supported TLS versions |
| Timeout with no response | Target is slow or its own downstream is slow | Is the target CPU/IO-bound, check ITS downstream deps |
| Connection reset mid-response | Target crashed, load balancer idle-timeout, proxy killed it | Target process logs, LB/proxy idle timeout settings |
| 429 | You're over the rate limit | Check `Retry-After`, back off, check for a retry storm you caused |
| 502/503 from a gateway/proxy | Upstream service unreachable or unhealthy | The service behind the gateway, not the gateway itself |
| 504 from a gateway/proxy | Upstream service too slow, gateway timeout tripped | Upstream latency, and whether the gateway timeout is even the right value |
| Malformed/unexpected response body | API contract drift, undocumented change, wrong content-type | Whether the schema still matches what you're parsing against |

## 9. Ambiguous outcomes need their own state

A request that times out **after** it may have already succeeded server-side (write timed out, but the write went through) is not the same as a clean failure. Treat it as `unknown`, persist that state, and reconcile — via a status check, not a blind retry — before deciding success or failure. This matters most for anything with a real-world side effect (see payments.md).
