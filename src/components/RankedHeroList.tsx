'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Zap } from 'lucide-react';

export function RankedHeroList() {
  const { sortedHeroes, openBidModal, timeWindow, currentLeader } = useCinebid();

  const remainingHeroes = sortedHeroes.slice(3);

  if (remainingHeroes.length === 0) return null;

  const leaderAmount = timeWindow === 'today'
    ? (currentLeader?.todayBidAmount || 0)
    : timeWindow === 'this-week'
    ? (currentLeader?.weekBidAmount || 0)
    : (currentLeader?.totalBidAmount || 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="flex flex-col divide-y divide-[var(--card-border)]/50">
        {remainingHeroes.map((hero, idx) => {
          const rank = idx + 4;
          const displayAmount =
            timeWindow === 'today'
              ? hero.todayBidAmount
              : timeWindow === 'this-week'
              ? hero.weekBidAmount
              : hero.totalBidAmount;

          const amountNeededForTop = Math.max(10, (leaderAmount - displayAmount) + 10);

          return (
            <div
              key={hero.id}
              onClick={() => openBidModal(hero)}
              className="group py-4 px-2 sm:px-4 flex items-center justify-between gap-4 hover:bg-[var(--card-hover)]/60 rounded-2xl transition-colors cursor-pointer"
            >
              {/* Left Side: Rank # + Circular Avatar + Details */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Rank Number */}
                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-[var(--muted-text)] tabular-nums shrink-0">
                  #{rank}
                </span>

                {/* Circular Avatar */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[var(--card-border)] group-hover:scale-105 transition-transform bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-[#ff5722] transition-colors truncate">
                      {hero.name} • {hero.titleTag}
                    </h4>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[var(--muted-text)] line-clamp-1 mt-0.5 font-normal">
                    {hero.bio}
                  </p>

                  {/* Subline tags */}
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[var(--muted-text)] mt-1 font-medium truncate">
                    <span className="font-semibold text-[var(--foreground)]">#{rank} in {hero.industry}</span>
                    <span>·</span>
                    <span>{hero.lastBidAt ? formatTimeAgo(hero.lastBidAt) : 'Listed'}</span>
                    <span>·</span>
                    <span>cinebid.lol</span>
                    <span>·</span>
                    <span>{hero.totalBidCount} bids</span>
                    <span>·</span>
                    <Link
                      href={`/heroes/${hero.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#ff5722] hover:underline"
                    >
                      see details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side: Amount in Coral + "Put ₹X for #1" Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs sm:text-sm md:text-base font-black text-[#ff5722] tabular-nums tracking-tight">
                    {formatRupee(displayAmount)}
                  </div>
                  <div className="text-[10px] text-amber-500 font-bold">
                    +{formatRupee(amountNeededForTop)} for #1
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openBidModal(hero);
                  }}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--pill-bg)] group-hover:bg-[#ff5722] text-[var(--foreground)] group-hover:text-white border border-[var(--pill-border)] group-hover:border-[#ff5722] text-xs font-bold transition-all shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Take #1</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
