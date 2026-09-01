'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Activity, Flame, Zap, Trophy, Crown, ArrowRight } from 'lucide-react';

export function LiveActivityDock() {
  const { activityFeed } = useCinebid();

  const recentEvents = activityFeed.slice(0, 5);

  if (recentEvents.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-4 sm:p-5 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5722] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5722]"></span>
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">
              Latest Live Activity
            </h3>
          </div>

          <Link
            href="/activity"
            className="text-xs font-bold text-[#ff5722] hover:underline flex items-center gap-1"
          >
            <span>View Full Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stream Entries */}
        <div className="flex flex-col divide-y divide-[var(--card-border)]/50">
          {recentEvents.map((evt) => {
            const isRankOne = evt.type === 'RANK_1_OVERTAKE';
            const isSupporterOvertake = evt.type === 'SUPPORTER_OVERTAKE';

            return (
              <div
                key={evt.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {isRankOne ? (
                    <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </div>
                  ) : isSupporterOvertake ? (
                    <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}

                  <div className="truncate">
                    <span className="font-bold text-[var(--foreground)]">@{evt.username}</span>{' '}
                    {isRankOne ? (
                      <span className="font-extrabold text-amber-500">
                        🔥 took #1 rank for <strong className="text-[var(--foreground)]">{evt.heroName}</strong> with {formatRupee(evt.amount || 0)}
                      </span>
                    ) : isSupporterOvertake ? (
                      <span className="font-semibold text-purple-500">
                        👑 became #1 supporter for <strong className="text-[var(--foreground)]">{evt.heroName}</strong>
                      </span>
                    ) : (
                      <span className="text-[var(--muted-text)]">
                        backed <strong className="text-[var(--foreground)]">{evt.heroName}</strong> with{' '}
                        <strong className="text-[#ff5722] font-black">{formatRupee(evt.amount || 0)}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-[var(--muted-text)] font-semibold shrink-0">
                  {formatTimeAgo(evt.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
