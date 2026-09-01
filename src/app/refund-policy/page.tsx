import React from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, Clock, ShieldCheck, Mail, AlertCircle, FileCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy - Cinebid',
  description: 'Cancellation and refund policies for transactions conducted on the Cinebid platform.',
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </Link>

      {/* Header */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-10 shadow-xs mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff5722]/10 text-[#ff5722] border border-[#ff5722]/20 mb-3">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Purchase Protection</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Information regarding order cancellations, return requirements, refund timeframes, and claim procedures.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Core Policy Card */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <ShieldCheck className="w-4 h-4 text-[#ff5722]" />
            <h2>Transaction Cancellation Terms</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point, the User may cancel the Transaction unless it has been specifically provided for on the Platform. In which case, the cancellation will be subject to the terms mentioned on the Platform.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            We shall retain the discretion in approving any cancellation requests, and we may ask for additional details before approving any requests.
          </p>
        </section>

        {/* 3-Day Window & Criteria */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Clock className="w-4 h-4 text-[#ff5722]" />
            <h2>Refund Eligibility & Timeframe</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Any request for a refund must be submitted within <strong>three (3) days</strong> from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days.
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform.
          </p>
        </section>

        {/* How to Claim */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <FileCheck className="w-4 h-4 text-[#ff5722]" />
            <h2>How to Submit a Refund Claim</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            A User may submit a claim for a refund for a purchase made by contacting our official support desk via email and providing a clear and specific reason for the refund request, including the exact terms that have been violated, along with any proof, if required.
          </p>

          <div className="p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ff5722]" />
              <span>Official Refund Contact:</span>
            </div>
            <div className="font-mono text-xs text-[#ff5722] font-semibold break-all">
              seller+fe2339eeffd542f990157042fd0b13eb@instamojo.com
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Whether a refund will be provided will be determined by us in our sole discretion, and we may ask for additional details or transaction verification before approving any requests. Approved refunds will be processed back to the original Payment Instrument used during the transaction.
          </p>
        </section>

      </div>

      {/* Policy Links */}
      <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <Link href="/terms" className="text-[#ff5722] hover:underline">
          ← Terms & Conditions
        </Link>
        <Link href="/shipping-policy" className="text-[#ff5722] hover:underline">
          Shipping & Delivery Policy →
        </Link>
        <Link href="/contact" className="text-[#ff5722] hover:underline">
          Contact Support Desk →
        </Link>
      </div>
    </div>
  );
}
