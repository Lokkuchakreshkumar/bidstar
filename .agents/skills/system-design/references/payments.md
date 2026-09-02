# Payment Flows — Reference

Read this for ANY code path that moves money or triggers a billable/irreversible side effect (charges, refunds, payouts, subscription changes, credits). Payment code gets stricter defaults than everything else in this skill — an unhandled edge case here costs real money or trust, not just a bad UX.

## 1. Idempotency is non-negotiable

- Every mutating call to a payment provider (charge, refund, payout) MUST carry an idempotency key, generated once per logical attempt and reused on every retry of that same attempt.
- Without it: a client retry, a timeout-then-retry, or a network blip can charge the customer twice. This is the single most common real-world payment bug.
- Generate the key at the point the user initiates the action (e.g. on "Pay now" click), not per HTTP request — so even a full page-reload-and-resubmit reuses it if you can recover the original key, or the server-side idempotency store catches the duplicate.

## 2. Never trust client-reported success

- A client saying "the payment succeeded" (because its own request appeared to succeed) is not proof. Confirm state via a server-to-server source of truth: the provider's webhook, or an explicit status-check call to the provider's API.
- Never mark an order as paid, release goods, or grant access purely because the frontend called your "success" callback.

## 3. Webhooks are the backbone — handle them correctly

- **Verify the signature** on every incoming webhook (HMAC against your webhook secret). An unverified webhook endpoint is a direct path to fraud.
- **Verify timestamp freshness** and reject stale payloads to prevent replay attacks even with a valid signature.
- **Dedupe by event ID.** Providers deliver at-least-once — the same event can and will arrive more than once. Store processed event IDs and skip repeats.
- **Return 2xx fast, process async.** Acknowledge receipt immediately, do the actual work (update order, send email) in a background job — a slow webhook handler causes the provider to retry, compounding load.
- **Don't assume ordering.** A "refund" event can arrive before or shortly after the "charge succeeded" event lands in your system in edge cases — design state transitions to handle out-of-order arrival (see §5).

## 4. Ambiguous outcomes: treat unknown as unknown, not failed

- If a charge request times out or the connection drops before you get a response, you do NOT know whether the charge happened. Do not blindly retry (risk of double-charge) and do not mark it failed (risk of telling the customer it failed when it actually succeeded — they may reasonably try again elsewhere and double-pay).
- Correct handling: mark the attempt `pending_unknown`, then reconcile — call the provider's status/lookup API for that idempotency key (not a new charge) to find out what actually happened, or wait for the webhook. Only resolve to `succeeded`/`failed` from a confirmed source.

## 5. Explicit state machine — no implicit transitions

Model payment/order status as an explicit state machine, not a loose status string set from scattered places in the code:

```
pending → authorized → captured → settled
                     ↘ failed
captured → refund_pending → refunded
                          ↘ refund_failed
```

- Define which transitions are legal; reject/log any attempted illegal transition (e.g. `refunded → captured` should never silently happen).
- Every transition gets logged with what triggered it (webhook event ID, admin action, reconciliation job) — this audit trail is what you'll need when a customer disputes a charge.

## 6. Reconciliation — the safety net webhooks alone don't give you

- Webhooks can be lost (network issue, your endpoint was down, provider outage) even with the provider's own retries exhausted.
- Run a periodic reconciliation job that compares your internal ledger against the provider's records (via their API/reports) and flags or auto-resolves mismatches. Treat "no webhook ever arrived for a charge the provider shows as succeeded" as a real, expected case to handle — not a hypothetical.

## 7. Partial failure after a successful charge

- The charge can succeed while a downstream step fails (inventory decrement errors, confirmation email fails to send, order record fails to write). The payment is real money already moved — you cannot just "roll it back" by throwing away the request.
- Use an outbox/saga-style pattern: record the charge success and the downstream steps still owed as durable state, then process the remaining steps with retry until they complete, rather than losing track of a paid-but-incomplete order.

## 8. Amounts, currency, precision

- Store monetary amounts as integers in the currency's minor unit (cents), never as floats — floating point rounding errors on money are a real, recurring bug class.
- Store the currency alongside every amount; never assume a single currency across the system if there's any chance of expansion.

## 9. Don't build what the provider already gives you

- Never handle or store raw card numbers/CVV yourself — use the provider's tokenization (their hosted fields / SDK) so raw card data never touches your servers. This is both a security and a compliance-scope issue (PCI DSS scope expands massively the moment you touch raw card data).
- This is general awareness, not compliance advice — for actual PCI/regulatory requirements, that's a conversation for the user's payment provider and a qualified compliance reviewer, not this skill.

## 10. Timeouts on payment calls

- Set the timeout long enough that a legitimately-slow-but-successful charge isn't falsely treated as failed (see §4) — but bounded enough that the user isn't left hanging indefinitely. When in doubt, err toward "wait longer, then reconcile" rather than "time out short and risk a false failure + accidental retry."
