'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Trophy, 
  Flame, 
  Crown, 
  ShieldCheck, 
  HelpCircle, 
  Share2, 
  ArrowRight 
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Hero',
      desc: 'Browse iconic stars across Telugu, Hindi, Tamil, Malayalam, and Kannada cinema. If your superstar isn’t listed, submit a suggestion.',
      icon: Trophy,
      badge: 'Discovery',
    },
    {
      step: '02',
      title: 'Back With Any Amount',
      desc: 'Put money (starting from just ₹10) behind your favourite hero. Every paid rupee directly increases the hero’s cumulative backing.',
      icon: Zap,
      badge: 'Fandom Power',
    },
    {
      step: '03',
      title: 'Watch the Rank Rise Live',
      desc: 'Cinebid recalculates rankings in real-time. When your hero overtakes rival superstars, the entire platform sees the outbid alert.',
      icon: Flame,
      badge: 'Real-time Rank',
    },
    {
      step: '04',
      title: 'Fight for #1 Supporter',
      desc: 'Compete against other fans backing the same hero. The user with the highest cumulative backing wears the #1 Backer crown.',
      icon: Crown,
      badge: 'Supporter War',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff5722]/10 text-[#ff5722] border border-[#ff5722]/20 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Fandom Mechanics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          How Cinebid Works
        </h1>
        <p className="text-sm text-[var(--muted-text)] mt-2">
          The pay-to-rank live leaderboard where Indian cinema fans determine who rules the box office rankings.
        </p>
      </div>

      {/* 4 Step Process */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-[#ff5722]">{s.step}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--pill-bg)] text-[var(--muted-text)]">
                    {s.badge}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-extrabold text-[var(--foreground)] tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--muted-text)] leading-relaxed mt-1.5">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Rules Highlights */}
      <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)]">
        <h3 className="font-extrabold text-base text-[var(--foreground)] mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Core Fandom Principles</span>
        </h3>

        <div className="space-y-3 text-xs text-[var(--muted-text)] leading-relaxed">
          <div className="p-3 rounded-xl bg-[var(--pill-bg)]">
            <strong className="text-[var(--foreground)]">1. The competition itself is the product:</strong> Users do not buy ownership of heroes. Contributions increase the hero’s public rank and your standing as a backer.
          </div>
          <div className="p-3 rounded-xl bg-[var(--pill-bg)]">
            <strong className="text-[var(--foreground)]">2. Non-refundable backing:</strong> All contributions directly accumulate towards the hero’s lifetime and periodic totals.
          </div>
          <div className="p-3 rounded-xl bg-[var(--pill-bg)]">
            <strong className="text-[var(--foreground)]">3. Time-window boards:</strong> All-time, Today, and Weekly boards ensure the race stays active every single day.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
          <Link
            href="/rules"
            className="text-xs font-bold text-[#ff5722] hover:underline flex items-center gap-1"
          >
            <span>Read full official rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#ff5722] text-white text-xs font-bold shadow-sm"
          >
            Start Bidding
          </Link>
        </div>
      </div>
    </div>
  );
}
