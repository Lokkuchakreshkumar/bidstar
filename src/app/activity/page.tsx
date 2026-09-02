'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Flame, Zap, Crown, Radio } from 'lucide-react';

export function ActivityPage() {
  const { activityFeed, sseConnected, openBidModal, heroes } = useCinebid();
  const [filterType, setFilterType] = useState<'ALL' | 'RANK_1' | 'SUPPORTER' | 'BIDS'>('ALL');

  const filteredEvents = activityFeed.filter((evt) => {
    if (filterType === 'RANK_1') return evt.type === 'RANK_1_OVERTAKE';
    if (filterType === 'SUPPORTER') return evt.type === 'SUPPORTER_OVERTAKE';
    if (filterType === 'BIDS') return evt.type === 'BID_PLACED';
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
              Live Activity Stream
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            Real-time feed of live bids, #1 rank takeovers, and fan outbids across Indian cinema.
          </p>
        </div>

        {/* Real-time SSE Connection Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] text-xs font-medium self-start sm:self-auto">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>{sseConnected ? 'Real-Time SSE Connected' : 'Live Stream Active'}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6">
        {[
          { id: 'ALL', label: 'All Activity' },
          { id: 'RANK_1', label: 'Rank #1 Overtakes' },
          { id: 'SUPPORTER', label: 'Top Supporter Wars' },
          { id: 'BIDS', label: 'Backing Bids' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as 'ALL' | 'RANK_1' | 'SUPPORTER' | 'BIDS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs divide-y divide-[var(--border-subtle)]">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const isRankOne = evt.type === 'RANK_1_OVERTAKE';
            const isSupporterOvertake = evt.type === 'SUPPORTER_OVERTAKE';
            const targetHero = heroes.find((h) => h.id === evt.heroId);

            return (
              <div
                key={evt.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[var(--card-hover)] transition-colors group"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isRankOne
                      ? 'bg-amber-500/10 text-amber-500'
                      : isSupporterOvertake
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-[var(--pill-bg)] text-[#e95325]'
                  }`}>
                    {isRankOne ? (
                      <Flame className="w-4 h-4 fill-current" />
                    ) : isSupporterOvertake ? (
                      <Crown className="w-4 h-4" />
                    ) : (
                      <Zap className="w-4 h-4 fill-current" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                      <span className="text-[var(--foreground)]">@{evt.username}</span>{' '}
                      {isRankOne ? (
                        <span className="text-amber-500 font-medium">
                          claimed #1 for <Link href={`/heroes/${evt.heroId}`} className="underline text-[var(--foreground)]">{evt.heroName}</Link>
                        </span>
                      ) : isSupporterOvertake ? (
                        <span className="text-purple-400 font-medium">
                          became #1 supporter for <Link href={`/heroes/${evt.heroId}`} className="underline text-[var(--foreground)]">{evt.heroName}</Link>
                        </span>
                      ) : (
                        <span className="text-[var(--muted-text)] font-normal">
                          backed <Link href={`/heroes/${evt.heroId}`} className="underline text-[var(--foreground)]">{evt.heroName}</Link>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[var(--muted-text)] mt-0.5 flex items-center gap-2">
                      <span className="tabular-nums">{formatTimeAgo(evt.timestamp)}</span>
                      {evt.amount && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[var(--foreground)] tabular-nums">
                            {formatRupee(evt.amount)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {targetHero && (
                  <button
                    onClick={() => openBidModal(targetHero)}
                    className="px-3.5 py-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  >
                    Back Hero
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-[var(--muted-text)]">
            No live activity recorded yet. Place the first contribution to initiate the leaderboard race.
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityPage;
