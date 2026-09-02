'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Crown, Flame, ArrowUpRight } from 'lucide-react';

export function PodiumCards() {
  const { sortedHeroes, openBidModal, timeWindow, currentLeader } = useCinebid();

  const topThree = sortedHeroes.slice(0, 3);

  if (topThree.length === 0) return null;

  const leaderAmount = timeWindow === 'today'
    ? (currentLeader?.todayBidAmount || 0)
    : timeWindow === 'this-week'
    ? (currentLeader?.weekBidAmount || 0)
    : (currentLeader?.totalBidAmount || 0);

  const hero1 = topThree[0];
  const hero2 = topThree[1];
  const hero3 = topThree[2];

  const getDisplayAmount = (hero: typeof hero1) => {
    if (!hero) return 0;
    return timeWindow === 'today'
      ? hero.todayBidAmount
      : timeWindow === 'this-week'
      ? hero.weekBidAmount
      : hero.totalBidAmount;
  };

  const getAmountNeededForTop = (hero: typeof hero1, rank: number) => {
    if (rank === 1) return 50;
    const heroAmt = getDisplayAmount(hero);
    return Math.max(50, (leaderAmount - heroAmt) + 10);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* Desktop/Tablet 3-Podium Layout (#2 on Left, #1 in Center, #3 on Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-end">
        
        {/* ===================== PODIUM #2 (LEFT - CHALLENGER) ===================== */}
        {hero2 && (
          <div className="order-2 md:order-1 flex flex-col justify-between p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--muted-text)]/40 transition-all shadow-xs md:translate-y-2">
            {/* Header: Rank + Amount */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--foreground)] tabular-nums">
                <span className="w-2 h-2 rounded-full bg-[#e95325]" />
                #2 Challenger
              </span>
              <span className="text-xs font-bold tabular-nums text-[var(--foreground)]">
                {formatRupee(getDisplayAmount(hero2))}
              </span>
            </div>

            {/* Portrait & Identity */}
            <div className="my-4 flex flex-col items-center text-center">
              <Link
                href={`/heroes/${hero2.id}`}
                className="w-20 h-20 rounded-2xl bg-[var(--pill-bg)] border border-[var(--card-border)] p-1 overflow-hidden hover:opacity-90 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero2.avatarUrl}
                  alt={hero2.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Link>

              <Link href={`/heroes/${hero2.id}`} className="mt-2.5 block">
                <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)] tracking-tight hover:text-[#e95325] transition-colors">
                  {hero2.name}
                </h3>
                <div className="text-xs text-[var(--muted-text)] mt-0.5">
                  {hero2.region} · {hero2.industry} {hero2.lastBidAt ? `· ${formatTimeAgo(hero2.lastBidAt)}` : ''}
                </div>
              </Link>
            </div>

            {/* Action */}
            <button
              onClick={() => openBidModal(hero2)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-xs font-semibold text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325] transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Take #1 for {formatRupee(getAmountNeededForTop(hero2, 2))}</span>
            </button>
          </div>
        )}

        {/* ===================== PODIUM #1 (CENTER - ELEVATED CHAMPION) ===================== */}
        {hero1 && (
          <div className="order-1 md:order-2 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--card-bg)] border-2 border-amber-500/40 shadow-lg md:-translate-y-3 relative overflow-hidden">
            {/* Ambient gold line at top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />

            {/* Header: Crown #1 Badge + Amount */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-500">
                <Crown className="w-4 h-4 fill-current" />
                <span>#1 Reigning Champion</span>
              </span>
              <span className="text-base sm:text-lg font-black tabular-nums text-amber-500">
                {formatRupee(getDisplayAmount(hero1))}
              </span>
            </div>

            {/* Portrait & Identity (Large Scale) */}
            <div className="my-5 flex flex-col items-center text-center">
              <Link
                href={`/heroes/${hero1.id}`}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[var(--pill-bg)] border-2 border-amber-500/50 p-1 overflow-hidden hover:opacity-95 transition-all shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero1.avatarUrl}
                  alt={hero1.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Link>

              <Link href={`/heroes/${hero1.id}`} className="mt-3 block">
                <div className="flex items-center justify-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500 fill-current" />
                  <h3 className="font-extrabold text-base sm:text-lg text-[var(--foreground)] tracking-tight hover:text-amber-500 transition-colors">
                    {hero1.name}
                  </h3>
                </div>
                <div className="text-xs text-[var(--muted-text)] mt-0.5 font-medium">
                  {hero1.titleTag || hero1.displayName} · {hero1.region} Cinema ({hero1.industry})
                </div>
              </Link>
            </div>

            {/* Action */}
            <button
              onClick={() => openBidModal(hero1)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Defend Throne (₹50+)</span>
            </button>
          </div>
        )}

        {/* ===================== PODIUM #3 (RIGHT - CONTENDER) ===================== */}
        {hero3 && (
          <div className="order-3 md:order-3 flex flex-col justify-between p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--muted-text)]/40 transition-all shadow-xs md:translate-y-4">
            {/* Header: Rank + Amount */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--muted-text)] tabular-nums">
                #3 Contender
              </span>
              <span className="text-xs font-bold tabular-nums text-[var(--foreground)]">
                {formatRupee(getDisplayAmount(hero3))}
              </span>
            </div>

            {/* Portrait & Identity */}
            <div className="my-4 flex flex-col items-center text-center">
              <Link
                href={`/heroes/${hero3.id}`}
                className="w-18 h-18 rounded-2xl bg-[var(--pill-bg)] border border-[var(--card-border)] p-1 overflow-hidden hover:opacity-90 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero3.avatarUrl}
                  alt={hero3.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Link>

              <Link href={`/heroes/${hero3.id}`} className="mt-2.5 block">
                <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)] tracking-tight hover:text-[#e95325] transition-colors">
                  {hero3.name}
                </h3>
                <div className="text-xs text-[var(--muted-text)] mt-0.5">
                  {hero3.region} · {hero3.industry}
                </div>
              </Link>
            </div>

            {/* Action */}
            <button
              onClick={() => openBidModal(hero3)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-xs font-semibold text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325] transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Take #1 for {formatRupee(getAmountNeededForTop(hero3, 3))}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
