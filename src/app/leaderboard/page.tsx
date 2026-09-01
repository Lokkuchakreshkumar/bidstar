'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatNumber } from '@/lib/formatters';
import { TimeWindow, Industry, Region } from '@/types';
import { Trophy, Zap, Globe2, Flame, Star } from 'lucide-react';

export function LeaderboardPage() {
  const { 
    sortedHeroes, 
    timeWindow, 
    setTimeWindow, 
    selectedRegion, 
    setSelectedRegion, 
    selectedCategory, 
    setSelectedCategory, 
    openBidModal 
  } = useCinebid();

  const regions: { id: Region; label: string; icon: React.ElementType }[] = [
    { id: 'All', label: 'All India', icon: Globe2 },
    { id: 'South', label: '🔥 South Cinema', icon: Flame },
    { id: 'North', label: '⭐ North Cinema', icon: Star },
  ];

  const industries: Industry[] = selectedRegion === 'North'
    ? ['All', 'Hindi']
    : selectedRegion === 'South'
    ? ['All', 'Telugu', 'Tamil', 'Malayalam', 'Kannada']
    : ['All', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff5722]/10 text-[#ff5722] border border-[#ff5722]/20 mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Official Public Standings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Hero Standings & Spots
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1.5">
          Live public rankings determined by total fandom backing. Claim the #1 spot for your hero.
        </p>
      </div>

      {/* Region & Time Window Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Region selector */}
          <div className="inline-flex p-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegion(reg.id);
                  setSelectedCategory('All');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === reg.id
                    ? 'bg-[#ff5722] text-white shadow-xs'
                    : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Time switch: All-time | Today | This Week */}
          <div className="flex items-center p-0.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs font-semibold">
            {(['all-time', 'today', 'this-week'] as TimeWindow[]).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeWindow === tw
                    ? 'bg-[#ff5722] text-white font-bold'
                    : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
                }`}
              >
                {tw === 'all-time' ? 'All Time' : tw === 'today' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
        </div>

        {/* Industry pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedCategory(ind)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === ind
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)]'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Heroes Leaderboard List */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[var(--card-border)] bg-[var(--pill-bg)]/40 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
          <div className="col-span-1 text-center">Spot</div>
          <div className="col-span-6 sm:col-span-7">Hero & Cinema</div>
          <div className="col-span-5 sm:col-span-4 text-right">Backing & Claim Spot</div>
        </div>

        <div className="divide-y divide-[var(--card-border)]/60">
          {sortedHeroes.map((hero, idx) => {
            const displayAmt =
              timeWindow === 'today'
                ? hero.todayBidAmount
                : timeWindow === 'this-week'
                ? hero.weekBidAmount
                : hero.totalBidAmount;

            return (
              <div
                key={hero.id}
                className="grid grid-cols-12 px-5 py-4 items-center hover:bg-[var(--card-hover)] transition-colors group"
              >
                {/* Rank / Spot Column */}
                <div className="col-span-1 text-center font-black text-sm sm:text-base tabular-nums">
                  {idx === 0 ? (
                    <span className="text-amber-400 font-extrabold">#1</span>
                  ) : idx === 1 ? (
                    <span className="text-slate-400 font-extrabold">#2</span>
                  ) : idx === 2 ? (
                    <span className="text-amber-700 font-extrabold">#3</span>
                  ) : (
                    <span className="text-[var(--muted-text)]">#{idx + 1}</span>
                  )}
                </div>

                {/* Hero Column */}
                <div className="col-span-6 sm:col-span-7 flex items-center gap-3 overflow-hidden pr-2">
                  <Link
                    href={`/heroes/${hero.id}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shrink-0 border border-[var(--card-border)] group-hover:scale-105 transition-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.avatarUrl}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="truncate">
                    <Link
                      href={`/heroes/${hero.id}`}
                      className="font-extrabold text-sm sm:text-base text-[var(--foreground)] hover:text-[#ff5722] transition-colors truncate block"
                    >
                      {hero.name}
                    </Link>
                    <div className="text-xs text-[var(--muted-text)] truncate">
                      <span className="font-semibold text-[#ff5722]">{hero.titleTag}</span> • {hero.region} ({hero.industry}) • {hero.latestBlockbuster}
                    </div>
                  </div>
                </div>

                {/* Backing & Claim Action Column */}
                <div className="col-span-5 sm:col-span-4 flex items-center justify-end gap-3 text-right">
                  <div>
                    <div className="text-sm sm:text-base font-black text-[#ff5722] tabular-nums">
                      {formatRupee(displayAmt)}
                    </div>
                    <div className="text-[10px] text-[var(--muted-text)]">
                      {hero.totalBidCount} bids placed
                    </div>
                  </div>

                  <button
                    onClick={() => openBidModal(hero)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[#ff5722] text-[var(--foreground)] hover:text-white border border-[var(--pill-border)] hover:border-[#ff5722] text-xs font-bold transition-all cursor-pointer"
                    title="Claim Spot"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Claim</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
