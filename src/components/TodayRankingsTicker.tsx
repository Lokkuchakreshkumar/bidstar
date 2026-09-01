'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { ChevronRight, Flame } from 'lucide-react';

export function TodayRankingsTicker() {
  const { heroes, openBidModal } = useCinebid();

  // Sort heroes by today's bid amount
  const todaySorted = [...heroes]
    .sort((a, b) => b.todayBidAmount - a.todayBidAmount)
    .slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#ff5722]" />
          <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">
            Today&apos;s top ranking
          </h2>
        </div>

        <Link
          href="/leaderboard"
          className="text-xs font-semibold text-[#ff5722] hover:underline flex items-center gap-0.5"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 mini cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {todaySorted.map((hero, idx) => (
          <div
            key={hero.id}
            onClick={() => openBidModal(hero)}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#ff5722]/50 hover:bg-[var(--card-hover)] transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-xs font-black text-[var(--muted-text)] group-hover:text-[#ff5722] transition-colors w-4">
                #{idx + 1}
              </span>
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                className="w-8 h-8 rounded-lg object-cover border border-[var(--card-border)] shrink-0"
              />

              <div className="truncate">
                <div className="text-xs font-bold text-[var(--foreground)] truncate group-hover:text-[#ff5722] transition-colors">
                  {hero.name}
                </div>
                <div className="text-[10px] text-[var(--muted-text)] truncate">
                  {hero.latestBlockbuster}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-black text-[#ff5722] tabular-nums">
                {formatRupee(hero.todayBidAmount)}
              </span>
              <div className="text-[9px] text-[var(--muted-text)] font-semibold">today</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
