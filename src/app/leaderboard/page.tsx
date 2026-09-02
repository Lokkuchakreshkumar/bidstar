'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { TimeWindow, Industry, Region } from '@/types';
import { Crown, Zap } from 'lucide-react';

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

  const regions: { id: Region; label: string }[] = [
    { id: 'All', label: 'All India' },
    { id: 'South', label: 'South Cinema' },
    { id: 'North', label: 'North Cinema' },
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
        <h1 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
          Superstar Standings & Spots
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1.5 leading-relaxed">
          Live public rankings determined by total fandom backing. Claim the #1 spot for your hero.
        </p>
      </div>

      {/* Region & Time Window Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Region selector */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
            {regions.map((reg) => {
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegion(reg.id);
                    setSelectedCategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                      : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>

          {/* Time switch: All-time | Today | This Week */}
          <div className="flex items-center p-0.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs font-medium">
            {(['all-time', 'today', 'this-week'] as TimeWindow[]).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeWindow === tw
                    ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
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
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === ind
                  ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                  : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--card-border)]'
              }`}
            >
              {ind === 'All' ? 'All Industries' : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Heroes Leaderboard Evidence Table */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/40 text-xs font-semibold text-[var(--muted-text)]">
              <th scope="col" className="py-3 pl-4 pr-2 w-16 text-center">Spot</th>
              <th scope="col" className="py-3 px-3">Superstar & Cinema</th>
              <th scope="col" className="py-3 px-3 text-right tabular-nums">Total Backing</th>
              <th scope="col" className="py-3 pl-2 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {sortedHeroes.map((hero, idx) => {
              const isFirst = idx === 0;
              const displayAmt =
                timeWindow === 'today'
                  ? hero.todayBidAmount
                  : timeWindow === 'this-week'
                  ? hero.weekBidAmount
                  : hero.totalBidAmount;

              return (
                <tr
                  key={hero.id}
                  className={`transition-colors group text-xs sm:text-sm ${
                    isFirst
                      ? 'bg-amber-500/[0.06] hover:bg-amber-500/[0.10]'
                      : 'hover:bg-[var(--card-hover)]'
                  }`}
                >
                  {/* Rank / Spot Column */}
                  <td className="py-3.5 pl-4 pr-2 text-center font-bold tabular-nums">
                    {isFirst ? (
                      <span className="inline-flex items-center justify-center gap-0.5 px-2 py-1 rounded-md bg-amber-500 text-black text-xs font-extrabold shadow-xs">
                        <Crown className="w-3 h-3 fill-current" />
                        <span>#1</span>
                      </span>
                    ) : idx === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[var(--pill-bg)] text-[var(--foreground)] border border-[var(--pill-border)] text-xs">#2</span>
                    ) : idx === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[var(--pill-bg)] text-[var(--muted-text)] border border-[var(--pill-border)] text-xs">#3</span>
                    ) : (
                      <span className="text-[var(--muted-text)] font-medium">#{idx + 1}</span>
                    )}
                  </td>

                  {/* Hero Column */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/heroes/${hero.id}`}
                        className={`rounded-xl overflow-hidden shrink-0 border bg-[var(--pill-bg)] ${
                          isFirst ? 'w-11 h-11 border-amber-500/50 ring-1 ring-amber-500/30' : 'w-10 h-10 border-[var(--border-subtle)]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hero.avatarUrl}
                          alt={hero.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/heroes/${hero.id}`}
                            className={`font-bold hover:text-[#e95325] transition-colors truncate block ${
                              isFirst ? 'text-base text-[var(--foreground)]' : 'text-sm text-[var(--foreground)]'
                            }`}
                          >
                            {hero.name}
                          </Link>
                          {isFirst && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                              REIGNING #1
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--muted-text)] truncate flex items-center gap-1.5 mt-0.5 font-normal">
                          <span>{hero.region}</span>
                          <span>·</span>
                          <span>{hero.industry} Cinema</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Backing Column (Right-aligned numeric) */}
                  <td className="py-3.5 px-3 text-right">
                    <div className={`font-bold tabular-nums ${isFirst ? 'text-amber-500 text-base' : 'text-[var(--foreground)]'}`}>
                      {formatRupee(displayAmt)}
                    </div>
                    <div className="text-xs text-[var(--muted-text)] tabular-nums font-normal">
                      {hero.totalBidCount} bids
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 pl-2 pr-4 text-right">
                    <button
                      onClick={() => openBidModal(hero)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isFirst
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-xs font-bold'
                          : 'bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325]'
                      }`}
                      title={isFirst ? "Defend Crown" : "Claim Spot"}
                    >
                      {isFirst ? (
                        <>
                          <Crown className="w-3.5 h-3.5 fill-current" />
                          <span>Defend</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Claim</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
