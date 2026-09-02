import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle, Scale, AlertTriangle, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer & Non-Affiliation Declaration - bidstar',
  description: 'Official legal disclaimer, intellectual property declarations, non-affiliation notice, and takedown policy for bidstar.',
};

export default function DisclaimerPage() {
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
        <div className="flex items-center gap-2 text-[#e95325] mb-2">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Official Legal Notice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Disclaimer & Non-Affiliation Notice
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Please read this declaration regarding the independent fan-driven nature of bidstar, intellectual property boundaries, and our strict non-gambling policy.
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-4 text-xs text-[var(--muted-text)]">
          <span>Effective Date: September 2026</span>
          <span>•</span>
          <span>Jurisdiction: Bengaluru, India</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        
        {/* 1. Independent Fan Tribute Platform */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <CheckCircle className="w-4 h-4 text-[#e95325]" />
            <h2>1. Independent Fan-Driven Tribute Platform</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            <strong className="text-[var(--foreground)]">bidstar</strong> is an independent, community-driven digital entertainment platform designed to measure and visualize public fandom enthusiasm for Indian cinema icons across Telugu, Hindi, Tamil, Malayalam, and Kannada industries.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The platform operates solely as a cultural engagement index and fan tribute community. It serves as a digital venue where fans celebrate their admiration for cinema superstars through collective, public backing.
          </p>
        </section>

        {/* 2. Absolute Non-Affiliation & Non-Endorsement */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2>2. No Official Affiliation or Celebrity Endorsement</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
            <strong className="block mb-1 text-amber-800 dark:text-amber-200">IMPORTANT NOTICE REGARDING REPRESENTATION:</strong>
            bidstar is NOT affiliated with, authorized by, endorsed by, sponsored by, or associated with any of the actors, directors, producers, film production banners, artist management agencies, or celebrity estates featured on the platform.
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Names, stage titles, likenesses, and references to cinema personalities are used exclusively for editorial, descriptive, cultural commentary, and community tribute purposes.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            <strong className="text-[var(--foreground)]">Destination of Funds:</strong> Any monetary contribution made by users represents platform service fees for digital supporter recognition, leaderboard ranking computation, and commemorative digital backer cards. <span className="text-[var(--foreground)] font-semibold">No funds are transferred to, solicited on behalf of, or held in trust for the featured celebrities or production studios.</span>
          </p>
        </section>

        {/* 3. Strict Non-Gambling & No Prize Declaration */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Scale className="w-4 h-4 text-[#e95325]" />
            <h2>3. Strict Non-Gambling & No Monetary Return Declaration</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            bidstar is strictly <strong className="text-[var(--foreground)]">NOT a gambling, betting, lottery, sweepstakes, prize competition, or wagering service</strong> under the Public Gambling Act, 1867, any state gaming legislation, or the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-[var(--foreground)]">Zero Cash Payouts:</strong> Users do not win money, dividends, interest, cash equivalents, or tangible assets.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Zero Investment Yield:</strong> Contributions are not investments, shares, loans, or deposits under the Banning of Unregulated Deposit Schemes Act, 2019 (BUDS Act).
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Voluntary Fandom Vanity:</strong> What users receive is 100% digital entertainment value: real-time public ranking of their supported icon, supporter tier badges, and digital collectible spot cards.
            </li>
          </ul>
        </section>

        {/* 4. Rights Holder Takedown Policy */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Mail className="w-4 h-4 text-[#e95325]" />
            <h2>4. Rights Holder & Celebrity Takedown Protocol</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            In accordance with safe harbor provisions under Section 79 of the Information Technology Act, 2000, bidstar respects the personality rights, publicity rights, trademarks, and copyrights of all individuals and corporate entities.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            If you are a celebrity, actor, legal representative, talent agency, or copyright owner and wish to request the modification or immediate removal of any hero profile or associated imagery, please contact our dedicated compliance desk:
          </p>
          
          <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-2">
            <div className="text-xs font-semibold text-[var(--foreground)]">Legal & Takedown Desk:</div>
            <div className="font-mono text-xs text-[#e95325]">legal@bidstar.in</div>
            <p className="text-[11px] text-[var(--muted-text)]">
              Requests accompanied by verification of authority are processed within 24 to 36 business hours.
            </p>
          </div>
        </section>

      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <Link href="/terms" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          ← Terms & Conditions
        </Link>
        <Link href="/refund-policy" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/contact" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Contact Grievance Desk →
        </Link>
      </div>
    </div>
  );
}
