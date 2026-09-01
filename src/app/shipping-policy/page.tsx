import React from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, Clock, MapPin, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy - Cinebid',
  description: 'Shipping, fulfillment, delivery timelines, and logistics policy for Cinebid.',
};

export default function ShippingPolicyPage() {
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
          <Truck className="w-3.5 h-3.5" />
          <span>Fulfillment & Delivery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Detailed terms regarding delivery estimates, shipping fee calculations, non-delivery procedures, and digital/physical fulfillment.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Estimated Dates & Timelines */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Clock className="w-4 h-4 text-[#ff5722]" />
            <h2>Delivery Dates & Estimates</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You hereby agree that all delivery dates and fulfillment timelines provided on the Platform are estimates, unless a fixed date for the delivery has been expressly agreed upon in writing.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Digital transactions, leaderboard spot allocations, badges, and recognition entries are activated in real-time or within 24 hours of successful payment confirmation.
          </p>
        </section>

        {/* Shipping Cost Calculations */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <MapPin className="w-4 h-4 text-[#ff5722]" />
            <h2>Shipping Cost & Calculation</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The cost for delivery (where applicable for physical merchandise or fandom gear) shall be calculated at the time of initiation of Transaction based on the shipping address and will be collected from you as a part of the Transaction Amount paid for the products and/or services.
          </p>
        </section>

        {/* Non-Receipt & Delayed Delivery Escalation */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2>Non-Receipt & Delay Escalation</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            In the event that you do not receive the delivery even after <strong>seven (7) days</strong> have passed from the estimated date of delivery, you must promptly reach out to us for investigation and resolution.
          </div>

          <div className="p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ff5722]" />
              <span>Logistics Support Contact:</span>
            </div>
            <div className="font-mono text-xs text-[#ff5722] font-semibold break-all">
              seller+fe2339eeffd542f990157042fd0b13eb@instamojo.com
            </div>
          </div>
        </section>

      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <Link href="/terms" className="text-[#ff5722] hover:underline">
          ← Terms & Conditions
        </Link>
        <Link href="/refund-policy" className="text-[#ff5722] hover:underline">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/contact" className="text-[#ff5722] hover:underline">
          Contact Customer Desk →
        </Link>
      </div>
    </div>
  );
}
