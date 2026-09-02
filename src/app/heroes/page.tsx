'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatNumber } from '@/lib/formatters';
import { Region, Industry } from '@/types';
import { 
  Search, 
  Grid, 
  List, 
  Zap, 
  PlusCircle, 
  Film
} from 'lucide-react';

export function HeroesPage() {
  const { 
    heroes, 
    openBidModal, 
    openRequestModal, 
    selectedRegion,
    setSelectedRegion,
    selectedCategory, 
    setSelectedCategory 
  } = useCinebid();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'amount' | 'fans' | 'today'>('rank');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = heroes.filter((h) => {
    const matchesRegion = selectedRegion === 'All' || h.region === selectedRegion;
    const matchesCat = selectedCategory === 'All' || h.industry === selectedCategory;
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.titleTag.toLowerCase().includes(search.toLowerCase()) ||
      h.region.toLowerCase().includes(search.toLowerCase()) ||
      h.industry.toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesCat && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'amount') return b.totalBidAmount - a.totalBidAmount;
    if (sortBy === 'fans') return b.supportersCount - a.supportersCount;
    if (sortBy === 'today') return b.todayBidAmount - a.todayBidAmount;
    return a.currentRank - b.currentRank;
  });

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Discover Superstars
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            Browse Indian cinema superstars across South and North industries. Back your favourite to rise in rank.
          </p>
        </div>

        <button
          onClick={openRequestModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-[var(--foreground)] text-xs font-semibold transition-all cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#e95325]" />
          <span>Suggest a Hero</span>
        </button>
      </div>

      {/* Region & Industry Filters Bar */}
      <div className="my-6 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                        : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <span>{reg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-industry selector pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pl-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedCategory(ind)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === ind
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                      : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {ind === 'All' ? 'All Industries' : ind}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Sort, View mode */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
              <input
                type="text"
                placeholder="Search hero or movie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-hidden focus:border-[#e95325]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rank' | 'amount' | 'fans' | 'today')}
              className="px-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-xs font-medium text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="rank">Sort: Rank (Default)</option>
              <option value="amount">Sort: Total Backed</option>
              <option value="today">Sort: Today&apos;s Momentum</option>
              <option value="fans">Sort: Most Fans</option>
            </select>

            <div className="flex items-center p-0.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[var(--pill-bg)] text-[var(--foreground)]' : 'text-[var(--muted-text)]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[var(--pill-bg)] text-[var(--foreground)]' : 'text-[var(--muted-text)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Hero Display */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
          <Film className="w-8 h-8 text-[var(--muted-text)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[var(--foreground)]">No heroes found</h3>
          <p className="text-xs text-[var(--muted-text)] mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any listed hero matching your filters.
          </p>
          <button
            onClick={openRequestModal}
            className="mt-4 px-4 py-2 rounded-xl bg-[#e95325] text-white text-xs font-semibold cursor-pointer"
          >
            Suggest Hero
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((hero) => (
            <div
              key={hero.id}
              className="group flex flex-col justify-between rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--muted-text)]/40 p-4 transition-all duration-150 shadow-xs"
            >
              <div>
                {/* Header: Rank + Region Tag + Amount */}
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-bold tabular-nums bg-[var(--pill-bg)] text-[var(--foreground)] border border-[var(--pill-border)]">
                      #{hero.currentRank}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[var(--pill-bg)] text-[var(--muted-text)]">
                      {hero.region}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[var(--foreground)] tabular-nums">
                    {formatRupee(hero.totalBidAmount)}
                  </span>
                </div>

                {/* Avatar + Info */}
                <div className="flex items-center gap-3 my-2">
                  <Link
                    href={`/heroes/${hero.id}`}
                    className="w-13 h-13 rounded-xl overflow-hidden shrink-0 border border-[var(--border-subtle)] bg-[var(--pill-bg)] group-hover:opacity-90 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.avatarUrl}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="overflow-hidden min-w-0">
                    <Link
                      href={`/heroes/${hero.id}`}
                      className="font-bold text-sm text-[var(--foreground)] hover:text-[#e95325] transition-colors truncate block"
                    >
                      {hero.name}
                    </Link>
                    <div className="text-xs text-[var(--muted-text)] truncate mt-0.5">
                      <span>{hero.industry} Cinema</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--muted-text)] font-normal tabular-nums">
                  {formatNumber(hero.supportersCount)} fans
                </span>

                <button
                  onClick={() => openBidModal(hero)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325] text-xs font-semibold transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {sorted.map((hero) => (
            <div
              key={hero.id}
              className="flex items-center justify-between py-3.5 px-3 hover:bg-[var(--card-hover)] transition-all cursor-pointer"
              onClick={() => openBidModal(hero)}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className="w-6 text-center text-xs font-bold text-[var(--muted-text)] tabular-nums">
                  #{hero.currentRank}
                </span>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.avatarUrl}
                  alt={hero.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)] bg-[var(--pill-bg)]"
                />

                <div className="truncate">
                  <Link
                    href={`/heroes/${hero.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-sm text-[var(--foreground)] hover:text-[#e95325] transition-colors"
                  >
                    {hero.name}
                  </Link>
                  <div className="text-xs text-[var(--muted-text)] truncate">
                    {hero.region} Cinema • {hero.industry}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                    {formatRupee(hero.totalBidAmount)}
                  </div>
                  <div className="text-xs text-[var(--muted-text)] tabular-nums font-normal">
                    {formatNumber(hero.supportersCount)} supporters
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openBidModal(hero);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325] text-xs font-semibold transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroesPage;
