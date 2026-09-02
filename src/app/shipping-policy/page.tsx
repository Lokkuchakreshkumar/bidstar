import React from 'react';
import Link from 'next/link';
import { Zap, CheckCircle2, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Delivery & Fulfillment Policy - bidstar',
  description: 'Electronic delivery, real-time leaderboard fulfillment, and digital collectible provisioning policy for bidstar.',
};

export default function ShippingPolicyPage() {
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
          Digital Delivery & Fulfillment Policy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Information regarding electronic delivery timelines, instant leaderboard spot provisioning, and digital collectible generation.
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-4 text-xs text-[var(--muted-text)]">
          <span>Service Classification: Pure Digital Entertainment Services</span>
          <span>•</span>
          <span>Fulfillment: Instantaneous (Real-Time)</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Instant Electronic Provisioning */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Zap className="w-4 h-4 text-[#e95325]" />
            <h2>1. Electronic Delivery & Real-Time Activation</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            All offerings available on <strong className="text-[var(--foreground)]">bidstar</strong> are non-tangible, pure digital entertainment and fandom recognition services. We do not manufacture or ship physical goods through postal courier networks.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Upon successful payment confirmation via our certified payment gateway, delivery occurs electronically and automatically:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Live Rank Computation:</strong> Hero total volume and national rankings update across all connected clients immediately.</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Backer Broadcast:</strong> Your username and backing amount are immediately published on the platform&apos;s live activity stream.</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>3D Collectible Card:</strong> Your verifiable WebGL 3D backer card is generated on the checkout success screen with shareable verification tokens.</span>
            </div>
          </div>
        </section>

        {/* Delivery Timeline Guarantee */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2>2. Fulfillment Timeline & Service Level Agreement (SLA)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Under normal operating conditions, electronic delivery is completed within <strong className="text-[var(--foreground)]">5 to 15 seconds</strong> of payment authorization.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            In rare instances of high network congestion or asynchronous webhook delivery delays by banking networks, electronic fulfillment will be completed automatically within a maximum window of <strong>2 hours</strong>.
          </p>
        </section>

        {/* Non-Fulfillment Escalation */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Mail className="w-4 h-4 text-[#e95325]" />
            <h2>3. Non-Delivery Escalation & Technical Support</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            If your account was successfully debited but your contribution is not reflected on the live leaderboard or your digital card is unavailable within 2 hours, please escalate immediately to our fulfillment team:
          </p>
          <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--foreground)]">Fulfillment Support Desk:</div>
            <div>Email: <span className="font-mono text-[#e95325]">support@bidstar.in</span></div>
            <div className="text-[var(--muted-text)]">Include: Payment ID / UPI Transaction Ref and registered username.</div>
            <div className="text-[var(--muted-text)]">Resolution Guarantee: Manual reconciliation or instant full refund within 24 hours.</div>
          </div>
        </section>

      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <Link href="/terms" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          ← Terms of Service
        </Link>
        <Link href="/refund-policy" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/contact" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Contact Customer Desk →
        </Link>
      </div>
    </div>
  );
}
