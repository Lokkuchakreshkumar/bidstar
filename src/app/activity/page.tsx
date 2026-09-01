'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { Activity, Flame, Zap, Crown, Radio, Film } from 'lucide-react';

export default function ActivityPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--card-border)] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
              Live Activity Stream
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            Real-time feed of live bids, #1 rank takeovers, and fan outbids across Indian cinema.
          </p>
        </div>

        {/* Real-time SSE Connection Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold self-start sm:self-auto">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{sseConnected ? 'Real-Time SSE Connected' : 'Live Stream Active'}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6">
        {[
          { id: 'ALL', label: 'All Activity' },
          { id: 'RANK_1', label: '🔥 Rank #1 Overtakes' },
          { id: 'SUPPORTER', label: '👑 Top Supporter Wars' },
          { id: 'BIDS', label: '⚡ Backing Bids' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as 'ALL' | 'RANK_1' | 'SUPPORTER' | 'BIDS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#ff5722] text-white shadow-xs shadow-[#ff5722]/30'
                : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs divide-y divide-[var(--card-border)]/50">
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
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isRankOne
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : isSupporterOvertake
                      ? 'bg-purple-500/15 text-purple-500 border border-purple-500/30'
                      : 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                  }`}>
                    {isRankOne ? (
                      <Flame className="w-5 h-5 fill-current" />
                    ) : isSupporterOvertake ? (
                      <Crown className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5 fill-current" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-extrabold text-[var(--foreground)]">
                      <span className="text-[#ff5722]">@{evt.username}</span>{' '}
                      {isRankOne ? (
                        <span className="text-amber-500">
                          took #1 position for <Link href={`/heroes/${evt.heroId}`} className="underline text-[var(--foreground)]">{evt.heroName}</Link>!
                        </span>
                      ) : isSupporterOvertake ? (
                        <span>
                          became #1 Top Supporter for <Link href={`/heroes/${evt.heroId}`} className="underline text-[#ff5722]">{evt.heroName}</Link>
                        </span>
                      ) : (
                        <span>
                          backed <Link href={`/heroes/${evt.heroId}`} className="underline text-[var(--foreground)]">{evt.heroName}</Link>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[var(--muted-text)] mt-0.5 flex items-center gap-2">
                      <span>{formatTimeAgo(evt.timestamp)}</span>
                      {evt.amount && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[var(--foreground)]">
                            Amount: {formatRupee(evt.amount)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {targetHero && (
                  <button
                    onClick={() => openBidModal(targetHero)}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[#ff5722] text-[var(--foreground)] hover:text-white border border-[var(--pill-border)] text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Back Hero
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-[var(--muted-text)]">
            No live activity recorded yet. Place the first verified contribution to start the leaderboard battle!
          </div>
        )}
      </div>
    </div>
  );
}
