'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { ChevronRight, Flame } from 'lucide-react';

export function PodiumCards() {
  const { sortedHeroes, openBidModal, timeWindow, currentLeader } = useCinebid();

  const topThree = sortedHeroes.slice(0, 3);

  if (topThree.length === 0) return null;

  const leaderAmount = timeWindow === 'today'
    ? (currentLeader?.todayBidAmount || 0)
    : timeWindow === 'this-week'
    ? (currentLeader?.weekBidAmount || 0)
    : (currentLeader?.totalBidAmount || 0);

  const cardThemes = [
    {
      rank: 1,
      badgeBg: 'bg-[#1e60ff]',
      amountColor: 'text-[#1e60ff]',
      borderGlow: 'border-[#1e60ff]/40 hover:border-[#1e60ff]',
      btnBg: 'bg-[#1e60ff] hover:bg-[#1550df] text-white',
    },
    {
      rank: 2,
      badgeBg: 'bg-[#00876f]',
      amountColor: 'text-[#00876f]',
      borderGlow: 'border-[#00876f]/40 hover:border-[#00876f]',
      btnBg: 'bg-[#00876f] hover:bg-[#00745f] text-white',
    },
    {
      rank: 3,
      badgeBg: 'bg-[#171717] dark:bg-[#262626]',
      amountColor: 'text-[#171717] dark:text-[#f5f5f5]',
      borderGlow: 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400',
      btnBg: 'bg-[#171717] dark:bg-[#262626] hover:bg-black text-white',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topThree.map((hero, idx) => {
          const theme = cardThemes[idx] || cardThemes[2];

          const displayAmount =
            timeWindow === 'today'
              ? hero.todayBidAmount
              : timeWindow === 'this-week'
              ? hero.weekBidAmount
              : hero.totalBidAmount;

          const amountNeededForTop = idx === 0
            ? 10 // defending #1
            : Math.max(10, (leaderAmount - displayAmount) + 10);

          return (
            <div
              key={hero.id}
              className={`relative flex flex-col justify-between p-6 rounded-3xl bg-[var(--card-bg)] border transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md ${theme.borderGlow}`}
            >
              {/* Floating Pill for Card #2 & #3 (Exact Outbid.lol style showing money needed to claim rank) */}
              {idx > 0 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <button
                    onClick={() => openBidModal(hero)}
                    className="flex items-center gap-1 px-3.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff7a59] text-white shadow-xs hover:bg-[#ff5722] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Flame className="w-3 h-3 fill-current" />
                    <span>claim #1 for {formatRupee(amountNeededForTop)}</span>
                  </button>
                </div>
              )}

              {/* Top Row: Square Rank Badge + Amount */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black text-white ${theme.badgeBg}`}
                >
                  #{idx + 1}
                </span>

                <div className="text-right">
                  <span className={`text-sm sm:text-base font-black tabular-nums ${theme.amountColor}`}>
                    {formatRupee(displayAmount)}
                  </span>
                  {idx > 0 && (
                    <div className="text-[10px] text-[#ff5722] font-bold">
                      +{formatRupee(amountNeededForTop)} to #1
                    </div>
                  )}
                </div>
              </div>

              {/* Center Portrait / Avatar */}
              <div className="my-5 flex flex-col items-center text-center">
                <Link
                  href={`/heroes/${hero.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[var(--card-border)] hover:scale-105 transition-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Name & Subtitle */}
                <Link
                  href={`/heroes/${hero.id}`}
                  className="mt-3.5 block"
                >
                  <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)] tracking-tight hover:text-[#ff5722] transition-colors">
                    {hero.name}: {hero.titleTag}
                  </h3>
                  <div className="text-[11px] text-[var(--muted-text)] mt-0.5 font-medium">
                    {hero.latestBlockbuster} {hero.lastBidAt ? `· ${formatTimeAgo(hero.lastBidAt)}` : ''}
                  </div>
                </Link>

                {/* Bio snippet */}
                <p className="mt-2 text-xs text-[var(--muted-text)] line-clamp-2 leading-relaxed px-1 font-normal">
                  {hero.bio}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[var(--card-border)]/60 flex items-center justify-between gap-2">
                <div className="text-[11px] text-[var(--muted-text)] font-medium truncate">
                  <span>{hero.region} • {hero.industry}</span>
                  <span className="mx-1">·</span>
                  <span>{hero.totalBidCount} bids</span>
                </div>

                <button
                  onClick={() => openBidModal(hero)}
                  className={`flex items-center gap-0.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${theme.btnBg} hover:scale-105 active:scale-95 shrink-0`}
                >
                  <span>{idx === 0 ? 'Defend #1' : 'Take #1'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
