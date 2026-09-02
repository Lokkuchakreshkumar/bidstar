'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  Crown 
} from 'lucide-react';

export function FirstTimeVisitorModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('bidstar_welcomed_v1');
      if (!hasSeen) {
        // Small timeout to allow initial page render before smooth entrance
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('bidstar_welcomed_v1', 'true');
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl p-6 sm:p-7 text-left animate-in zoom-in-95 duration-200 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
          aria-label="Close welcome modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex flex-col gap-1 w-4 justify-center">
            <span className="w-full h-0.5 bg-[#e95325] rounded-full"></span>
            <span className="w-3/4 h-0.5 bg-[#e95325] rounded-full"></span>
          </div>
          <span className="font-bold text-sm tracking-tight text-[var(--foreground)]">
            bidstar<span className="text-[#e95325]">.</span>
          </span>
          <span className="text-xs text-[var(--muted-text)]">•</span>
          <span className="text-xs font-semibold text-[#e95325]">Fandom Guide</span>
        </div>

        <h2 id="welcome-title" className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Welcome to the Live Indian Cinema Fandom Arena
        </h2>

        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1.5 leading-relaxed">
          The public financial battleground where fans decide who leads Indian cinema. Here is how the competition works:
        </p>

        {/* 3 Step Educational Cards */}
        <div className="my-5 space-y-3">
          
          {/* 1. Fandom Ranking */}
          <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e95325]/10 text-[#e95325] flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--foreground)]">
                1. Back Your Superstar
              </h3>
              <p className="text-[11px] text-[var(--muted-text)] mt-0.5 leading-relaxed">
                Put financial backing (from ₹50) behind your favourite icon. Every rupee directly fuels their real-time rank on the national leaderboard.
              </p>
            </div>
          </div>

          {/* 2. Supporter Prestige */}
          <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--foreground)]">
                2. Fight for #1 Supporter
              </h3>
              <p className="text-[11px] text-[var(--muted-text)] mt-0.5 leading-relaxed">
                Compete against rival fans. Top backers claim the #1 title, broadcast live updates across the platform, and mint an interactive 3D collectible card.
              </p>
            </div>
          </div>

          {/* 3. 100% Non-Gambling */}
          <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--foreground)]">
                3. Pure Fandom • Zero Gambling
              </h3>
              <p className="text-[11px] text-[var(--muted-text)] mt-0.5 leading-relaxed">
                Voluntary fandom tribute. Zero cash prizes, zero betting, and zero monetary returns. The competition and community pride itself is the reward.
              </p>
            </div>
          </div>

        </div>

        {/* CTA & More Info */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/how-it-works"
            onClick={handleDismiss}
            className="text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
          >
            <span>Detailed platform rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-bold tracking-tight shadow-md transition-all cursor-pointer"
          >
            Enter bidstar
          </button>
        </div>
      </div>
    </div>
  );
}
