import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Scale, Shield, AlertCircle, Mail, Ban, HeartHandshake } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - bidstar',
  description: 'Terms and conditions governing the access, transactions, and usage of the bidstar platform.',
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and bidstar (&ldquo;bidstar&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), governing your access to and use of the bidstar website and services.
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4 text-xs text-[var(--muted-text)]">
          <span>Last Revised: September 2026</span>
          <span>•</span>
          <span>Governing Law: Republic of India</span>
          <span>•</span>
          <span>Jurisdiction: Bengaluru, Karnataka</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        
        {/* 1. Nature of the Platform */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <HeartHandshake className="w-4 h-4 text-[#e95325]" />
            <h2>1. NATURE OF THE PLATFORM (DIGITAL ENTERTAINMENT & FANDOM TRIBUTE)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            bidstar is an independent, interactive digital entertainment platform that tracks, ranks, and celebrates Indian cinema icons based on public fandom contributions. 
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            By backing a superstar on the platform, you are purchasing digital entertainment vanity services: specifically, an instant contribution to the hero&apos;s cumulative ranking on our public leaderboard, a live backer broadcast, and an interactive 3D digital collectible backer card.
          </p>
        </section>

        {/* 2. Absolute Non-Gambling & No Financial Returns */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Ban className="w-4 h-4 text-[#e95325]" />
            <h2>2. STRICT NON-GAMBLING, NO-WAGERING & NO-PRIZE COVENANT</h2>
          </div>
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold leading-relaxed">
            PLEASE READ CAREFULLY: bidstar IS STRICTLY NOT A GAMBLING, BETTING, REAL-MONEY GAMING, LOTTERY, OR PRIZE COMPETITION PLATFORM.
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-[var(--foreground)]">No Winnings or Returns:</strong> You acknowledge and agree that contributions do not carry any expectation of monetary returns, profit, cash dividends, interest, or financial yield.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Zero Prizes:</strong> Neither bidstar nor any third party offers cash prizes, lottery payouts, physical merchandise, or monetary rewards based on leaderboard positions.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Not a Real Money Game:</strong> The service does not constitute an &ldquo;online real money game&rdquo; under Rule 2(1)(qd) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as no deposit is made with the expectation of earning winnings.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Not an Investment Scheme:</strong> Payments are consideration for digital entertainment services and are NOT deposits, debentures, loans, or investments under the Banning of Unregulated Deposit Schemes Act, 2019 (BUDS Act).
            </li>
          </ul>
        </section>

        {/* 3. Non-Affiliation & Safe Harbor */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Shield className="w-4 h-4 text-[#e95325]" />
            <h2>3. INDEPENDENT TRIBUTE & NON-AFFILIATION DISCLAIMER</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            All names, stage titles, likenesses, and imagery of cinema personalities are presented for informational, cultural commentary, and community fan tribute purposes only. 
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            bidstar is NOT affiliated with, sponsored by, endorsed by, or in partnership with any actor, celebrity, talent management agency, or movie production studio. <span className="text-[var(--foreground)] font-semibold">Funds paid on bidstar represent platform service fees; zero funds are collected on behalf of or remitted to depicted individuals.</span>
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            In accordance with safe harbor provisions under Section 79 of the Information Technology Act, 2000, any verified rights holder or celebrity representative may request the modification or takedown of a listing by emailing <span className="text-[#e95325] font-mono">legal@bidstar.in</span>.
          </p>
        </section>

        {/* 4. Eligibility */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <CheckCircle className="w-4 h-4 text-[#e95325]" />
            <h2>4. ELIGIBILITY & USER CAPACITY</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            By using this Platform, you represent and warrant that you are at least 18 years of age and possess the legal capacity to enter into a binding contract under the Indian Contract Act, 1872. If you are under 18, you may only use this Platform with the involvement and express consent of a parent or legal guardian.
          </p>
        </section>

        {/* 5. Payments, Instant Fulfillment & Refund Policy */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Scale className="w-4 h-4 text-[#e95325]" />
            <h2>5. PAYMENTS, INSTANT FULFILLMENT & CANCELLATION</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Payments are processed securely through certified payment aggregators (including Dodo Payments, supporting UPI, credit cards, debit cards, and net banking). All transactions are denominated in Indian Rupees (INR) unless otherwise specified.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            <strong className="text-[var(--foreground)]">Instant Digital Fulfillment:</strong> Upon successful payment confirmation, the transaction is executed instantaneously: the hero&apos;s rank is updated in real time, your name is recorded on the supporter leaderboard, and your digital commemorative card is generated.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            <strong className="text-[var(--foreground)]">Non-Refundable Upon Fulfillment:</strong> Because digital entertainment services are delivered and consumed immediately upon transaction confirmation, contributions are strictly non-refundable. Exceptions are limited strictly to verified technical errors (e.g., duplicate billing or gateway deductions where rank was not credited), as detailed in our <Link href="/refund-policy" className="text-[#e95325] hover:underline font-semibold">Cancellation & Refund Policy</Link>.
          </p>
        </section>

        {/* 6. Prohibited Activities & Fan War Moderation */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2>6. PROHIBITED ACTIONS & CODE OF CONDUCT</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Cinema rivalry must remain respectful and lawful. You expressly agree not to:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>Submit cheer notes or usernames containing defamatory, obscene, pornographic, hateful, communally provocative, or threatening content.</li>
            <li>Harass, intimidate, or demean other fans, fan clubs, or artists.</li>
            <li>Use automated scripts, bots, spiders, or scrapers to manipulate the leaderboard or overload platform infrastructure.</li>
            <li>Use stolen payment instruments, compromised accounts, or fraudulent payment credentials.</li>
            <li>Circumvent or tamper with the live calculation algorithms or MongoDB backend state.</li>
          </ul>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            bidstar reserves the right to censor or delete offensive cheer notes and ban offending accounts without entitlement to a refund.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Shield className="w-4 h-4 text-[#e95325]" />
            <h2>7. LIMITATION OF LIABILITY & DISCLAIMER OF WARRANTIES</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The Platform is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. To the fullest extent permissible under applicable law, bidstar disclaims all warranties, express or implied.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            In no event shall bidstar, its founders, operators, or affiliates be liable for any indirect, consequential, punitive, or exemplary damages arising out of your participation on the platform. Our aggregate liability for any dispute shall not exceed the actual amount paid by you in the specific transaction giving rise to the claim.
          </p>
        </section>

        {/* 8. Governing Law & Grievance Redressal */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Mail className="w-4 h-4 text-[#e95325]" />
            <h2>8. GOVERNING LAW & STATUTORY GRIEVANCE REDRESSAL</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India. The courts of Bengaluru, Karnataka shall have exclusive jurisdiction over any dispute arising under these Terms.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            In compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, our designated Grievance Officer details are as follows:
          </p>
          <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--foreground)]">Grievance Redressal Officer:</div>
            <div className="text-[var(--muted-text)]">Officer: Platform Compliance Desk</div>
            <div className="text-[var(--muted-text)]">Email: <span className="font-mono text-[#e95325]">grievance@bidstar.in</span></div>
            <div className="text-[var(--muted-text)]">Support: <span className="font-mono text-[var(--foreground)]">support@bidstar.in</span></div>
            <div className="text-[var(--muted-text)]">Address: Bengaluru, Karnataka 560001, India</div>
            <div className="text-[var(--muted-text)]">Acknowledgment: Within 24 hours | Resolution: Within 15 business days</div>
          </div>
        </section>

      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <Link href="/disclaimer" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          ← Legal Disclaimer & Non-Affiliation
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
