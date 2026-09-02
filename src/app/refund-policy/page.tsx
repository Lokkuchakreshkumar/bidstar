import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy - bidstar',
  description: 'Official cancellation, technical error refund procedures, and chargeback resolution policy for bidstar.',
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Transparent guidelines governing transaction cancellations, instant digital delivery, and technical error refund processing.
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-4 text-xs text-[var(--muted-text)]">
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>In Compliance with: Consumer Protection (E-Commerce) Rules, 2020</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Instant Digital Delivery & General Non-Refundable Rule */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <ShieldCheck className="w-4 h-4 text-[#e95325]" />
            <h2>1. Instant Digital Fulfillment & Non-Refundable Nature</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            All paid contributions on <strong className="text-[var(--foreground)]">bidstar</strong> are consideration for real-time digital entertainment services. When you complete a transaction, the service is fulfilled immediately:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>Your chosen superstar&apos;s backing volume and ranking update across the entire platform in real time.</li>
            <li>Your username and contribution are broadcast to all users via the live activity stream.</li>
            <li>Your custom interactive 3D digital collectible card is generated and verified in the database.</li>
          </ul>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Because digital entertainment benefits are consumed instantaneously upon transaction confirmation, <strong className="text-[var(--foreground)]">all successful fandom backing contributions are final and non-refundable</strong>.
          </p>
        </section>

        {/* Technical Error & Duplicate Billing Exceptions */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <RefreshCw className="w-4 h-4 text-emerald-500" />
            <h2>2. Eligible Refund Exceptions (Technical & Payment Errors)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            We gladly issue full refunds in cases of verified technical discrepancies or unauthorized charges:
          </p>
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--muted-text)]">
              <strong className="text-[var(--foreground)] block mb-0.5">A. Duplicate / Multiple Debits:</strong>
              If your bank account or UPI was debited multiple times for a single intended backing due to network latency or gateway lag.
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--muted-text)]">
              <strong className="text-[var(--foreground)] block mb-0.5">B. Failed Credit (Debited but Not Recorded):</strong>
              If funds were deducted from your payment instrument but the transaction failed on bidstar and did not reflect on the leaderboard.
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--muted-text)]">
              <strong className="text-[var(--foreground)] block mb-0.5">C. Verified Fraudulent Transaction:</strong>
              If a transaction was conducted using stolen payment details without the cardholder&apos;s authorization (subject to bank verification).
            </div>
          </div>
        </section>

        {/* Resolution Timeline */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Clock className="w-4 h-4 text-[#e95325]" />
            <h2>3. Claim Procedure & Refund Timeline</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            To report a technical failure or request a duplicate billing refund, contact our support desk within <strong>seven (7) calendar days</strong> of the transaction date.
          </p>
          
          <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-2">
            <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#e95325]" />
              <span>Official Refund & Technical Support:</span>
            </div>
            <div className="font-mono text-xs text-[#e95325]">support@bidstar.in</div>
            <p className="text-[11px] text-[var(--muted-text)]">
              Please provide: (1) Your UPI Ref ID / Payment ID, (2) Date and amount of transaction, and (3) Screenshot of bank deduction.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-500 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Approved technical refunds are reversed within 5 to 7 business days directly to your original payment method.</span>
          </div>
        </section>

      </div>

      {/* Policy Links */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <Link href="/terms" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          ← Terms of Service
        </Link>
        <Link href="/disclaimer" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Legal Disclaimer →
        </Link>
        <Link href="/contact" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Contact Customer Desk →
        </Link>
      </div>
    </div>
  );
}
