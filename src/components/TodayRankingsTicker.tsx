'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { ChevronRight } from 'lucide-react';

export function TodayRankingsTicker() {
  const { heroes, openBidModal } = useCinebid();

  const todaySorted = [...heroes]
    .sort((a, b) => b.todayBidAmount - a.todayBidAmount)
    .slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e95325]"></span>
          <h2 className="text-xs sm:text-sm font-semibold text-[var(--foreground)] tracking-tight">
            Today&apos;s momentum leaders
          </h2>
        </div>

        <Link
          href="/leaderboard"
          className="text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-0.5 transition-colors"
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
            className="group flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--muted-text)]/40 hover:bg-[var(--card-hover)] transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-xs font-bold text-[var(--muted-text)] group-hover:text-[var(--foreground)] transition-colors w-4 text-center tabular-nums">
                #{idx + 1}
              </span>
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                className="w-9 h-9 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0 bg-[var(--pill-bg)]"
              />

              <div className="truncate">
                <div className="text-xs font-semibold text-[var(--foreground)] truncate group-hover:text-[#e95325] transition-colors">
                  {hero.name}
                </div>
                <div className="text-[11px] text-[var(--muted-text)] truncate">
                  {hero.region} · {hero.industry}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-bold text-[var(--foreground)] tabular-nums">
                {formatRupee(hero.todayBidAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
