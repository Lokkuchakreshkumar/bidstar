'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';

export function RankedHeroList() {
  const { sortedHeroes, openBidModal, timeWindow } = useCinebid();

  const remainingHeroes = sortedHeroes.slice(3);

  if (remainingHeroes.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {remainingHeroes.map((hero, idx) => {
          const rank = idx + 4;
          const displayAmount =
            timeWindow === 'today'
              ? hero.todayBidAmount
              : timeWindow === 'this-week'
              ? hero.weekBidAmount
              : hero.totalBidAmount;

          return (
            <div
              key={hero.id}
              onClick={() => openBidModal(hero)}
              className="group py-3.5 px-2 sm:px-4 flex items-center justify-between gap-4 hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
            >
              {/* Left Side: Rank # + Square Avatar + Details */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Rank Number */}
                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-[var(--muted-text)] tabular-nums shrink-0">
                  #{rank}
                </span>

                {/* Square Rounded Avatar */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-[var(--border-subtle)] bg-[var(--pill-bg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-[#e95325] transition-colors truncate">
                    {hero.name}
                  </h4>

                  {/* Subline tags */}
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--muted-text)] mt-0.5 font-normal truncate">
                    <span className="font-medium text-[var(--foreground)] truncate">
                      {hero.titleTag ? `${hero.titleTag} · ${hero.industry}` : `${hero.region} · ${hero.industry}`}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{hero.lastBidAt ? formatTimeAgo(hero.lastBidAt) : 'Listed'}</span>
                    <span className="hidden md:inline">·</span>
                    <span className="hidden md:inline tabular-nums">{hero.totalBidCount} bids</span>
                    <span>·</span>
                    <Link
                      href={`/heroes/${hero.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#e95325] hover:underline shrink-0 font-medium"
                    >
                      details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side: Amount in Bold */}
              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-bold text-[var(--foreground)] tabular-nums tracking-tight">
                  {formatRupee(displayAmount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
