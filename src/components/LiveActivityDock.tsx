'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Flame, Zap, Crown, ArrowRight } from 'lucide-react';

export function LiveActivityDock() {
  const { activityFeed } = useCinebid();

  const recentEvents = activityFeed.slice(0, 5);

  if (recentEvents.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-4 sm:p-5 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e95325] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e95325]"></span>
            </span>
            <h3 className="text-xs font-semibold text-[var(--foreground)]">
              Latest live activity
            </h3>
          </div>

          <Link
            href="/activity"
            className="text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
          >
            <span>Full stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stream Entries */}
        <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
          {recentEvents.map((evt) => {
            const isRankOne = evt.type === 'RANK_1_OVERTAKE';
            const isSupporterOvertake = evt.type === 'SUPPORTER_OVERTAKE';

            return (
              <div
                key={`${evt.id}-${evt.timestamp}`}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {isRankOne ? (
                    <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </div>
                  ) : isSupporterOvertake ? (
                    <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-[#e95325]/10 text-[#e95325] flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}

                  <div className="truncate">
                    <span className="font-semibold text-[var(--foreground)]">@{evt.username}</span>{' '}
                    {isRankOne ? (
                      <span className="font-medium text-amber-500">
                        claimed #1 for <strong className="text-[var(--foreground)]">{evt.heroName}</strong> with {formatRupee(evt.amount || 0)}
                      </span>
                    ) : isSupporterOvertake ? (
                      <span className="font-medium text-purple-400">
                        became #1 supporter for <strong className="text-[var(--foreground)]">{evt.heroName}</strong>
                      </span>
                    ) : (
                      <span className="text-[var(--muted-text)]">
                        backed <strong className="text-[var(--foreground)]">{evt.heroName}</strong> with{' '}
                        <strong className="text-[var(--foreground)] font-semibold tabular-nums">{formatRupee(evt.amount || 0)}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[var(--muted-text)] font-normal shrink-0 tabular-nums">
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
