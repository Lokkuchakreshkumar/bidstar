'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function RulesPage() {
  const rules = [
    { num: 1, text: 'bidstar is a public ranking platform powered by fandom.' },
    { num: 2, text: 'Users back heroes by placing paid financial contributions.' },
    { num: 3, text: 'Paid bids permanently increase the hero’s total backing.' },
    { num: 4, text: 'Hero rank is determined by the total backed amount in the active time window (All-Time, Today, This Week).' },
    { num: 5, text: 'Supporter rank is determined by a user’s cumulative contributions for that hero.' },
    { num: 6, text: 'Only successfully verified transactions count towards rankings.' },
    { num: 7, text: 'Failed, pending, or refunded transactions do not affect the public leaderboard.' },
    { num: 8, text: 'Duplicate payment webhook notifications are idempotent and will not generate duplicate bids.' },
    { num: 9, text: 'Bids and usernames are publicly reflected in live ranking and activity feeds.' },
    { num: 10, text: 'Contributions are non-refundable fandom support transactions.' },
    { num: 11, text: 'bidstar reserves the right to moderate or archive hero listings that violate platform standards.' },
    { num: 12, text: 'Hero profiles and canonical images are curated centrally by bidstar administrators to ensure visual consistency.' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <Shield className="w-5 h-5 text-[#e95325]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Official Platform Rules
          </h1>
        </div>
        <p className="text-xs text-[var(--muted-text)] mb-6">
          Governing the outbid mechanism, financial accounting, and community ranking integrity.
        </p>

        <div className="space-y-3 divide-y divide-[var(--border-subtle)]">
          {rules.map((r) => (
            <div key={r.num} className="pt-3 first:pt-0 flex items-start gap-3 text-xs leading-relaxed">
              <span className="font-semibold text-[var(--foreground)] shrink-0 mt-0.5 tabular-nums">
                {r.num < 10 ? `0${r.num}` : r.num}.
              </span>
              <p className="text-[var(--foreground)] font-normal">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
