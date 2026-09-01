'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { Industry, Region } from '@/types';
import { ChevronDown, Minus, Plus, Film, Check } from 'lucide-react';

export function ClaimRankHero() {
  const { 
    currentLeader, 
    amountToBeatNumberOne, 
    heroes, 
    openBidModal, 
    selectedRegion,
    setSelectedRegion,
    selectedCategory, 
    setSelectedCategory,
    timeWindow,
    setTimeWindow
  } = useCinebid();

  const [customBidAmount, setCustomBidAmount] = useState<number>(amountToBeatNumberOne);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<string>('');
  const [isHeroDropdownOpen, setIsHeroDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  React.useEffect(() => {
    setCustomBidAmount(amountToBeatNumberOne);
  }, [amountToBeatNumberOne]);

  const handleIncrement = () => {
    setCustomBidAmount((prev) => prev + 500);
  };

  const handleDecrement = () => {
    setCustomBidAmount((prev) => Math.max(amountToBeatNumberOne, prev - 500));
  };

  const filteredHeroes = heroes.filter((h) => {
    const matchesRegion = selectedRegion === 'All' || h.region === selectedRegion;
    const matchesCategory = selectedCategory === 'All' || h.industry === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.titleTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.latestBlockbuster.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesCategory && matchesSearch;
  });

  const selectedHero = heroes.find((h) => h.id === selectedHeroId) || 
    (searchTerm ? filteredHeroes[0] : currentLeader || heroes[0]);

  const handleClaim = () => {
    if (selectedHero) {
      openBidModal(selectedHero);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center mt-6 mb-8 px-4">
      
      {/* 1. Time Toggle: All-time | Today (Exact Outbid.lol style) */}
      <div className="flex items-center justify-center gap-6 mb-4 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setTimeWindow('all-time')}
          className={`pb-1 transition-colors cursor-pointer ${
            timeWindow === 'all-time'
              ? 'text-[var(--foreground)] font-bold border-b-2 border-[#ff5722]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          All-time
        </button>

        <button
          onClick={() => setTimeWindow('today')}
          className={`flex items-center gap-1.5 pb-1 transition-colors cursor-pointer ${
            timeWindow === 'today'
              ? 'text-[var(--foreground)] font-bold border-b-2 border-[#ff5722]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse"></span>
          <span>Today</span>
        </button>
      </div>

      {/* 2. Main Heading: Claim [today's] #1 for [- ₹Amount +] */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)]">
        <span>Claim {timeWindow === 'today' ? "today's" : ''} #1 for</span>
        
        <div className="inline-flex items-center gap-1">
          <button
            onClick={handleDecrement}
            disabled={customBidAmount <= amountToBeatNumberOne}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Decrease amount"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-[#ff5722] font-black tabular-nums tracking-tight">
            {formatRupee(customBidAmount)}
          </span>

          <button
            onClick={handleIncrement}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] transition-all cursor-pointer"
            title="Increase amount"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Subtitle */}
      <p className="mt-2 text-xs sm:text-sm text-[var(--muted-text)] font-normal max-w-md mx-auto">
        {timeWindow === 'today'
          ? 'Rank is what you backed in the last 24 hours. Each contribution counts for today.'
          : 'Rank is total public lifetime backing. Select your favourite superstar from the list below.'}
      </p>

      {/* 4. Input Bar: [ 🎬 Select hero from list ] | [ Choose a category ⌄ ] | [ Claim rank ] */}
      <div className="mt-6 relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 p-1.5 rounded-2xl sm:rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
        
        {/* Left: Hero Selector Input */}
        <div className="relative flex-1 flex items-center px-3.5 py-2">
          <Film className="w-4 h-4 text-[var(--muted-text)] mr-2.5 shrink-0 opacity-60" />
          <input
            type="text"
            placeholder="Select or search hero from list..."
            value={searchTerm}
            onFocus={() => setIsHeroDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedHeroId('');
              setIsHeroDropdownOpen(true);
            }}
            className="w-full bg-transparent text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)]/70 focus:outline-hidden font-medium"
          />
          {selectedHeroId && (
            <span className="text-[11px] font-bold text-[#ff5722] shrink-0 bg-[#ff5722]/10 px-2 py-0.5 rounded-md mr-1">
              {heroes.find(h => h.id === selectedHeroId)?.name}
            </span>
          )}
        </div>

        {/* Middle: Category Dropdown */}
        <div className="relative border-t sm:border-t-0 sm:border-l border-[var(--card-border)] px-3.5 py-1.5 flex items-center justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer w-full sm:w-auto"
          >
            <span>
              {selectedRegion !== 'All' ? `${selectedRegion} • ` : ''}
              {selectedCategory === 'All' ? 'Choose a category' : selectedCategory}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {isCategoryDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl z-50 p-2 text-left">
              <div className="text-[10px] font-bold uppercase text-[var(--muted-text)] px-2 py-1">
                Region
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {(['All', 'South', 'North'] as Region[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      setSelectedCategory('All');
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedRegion === r
                        ? 'bg-[#ff5722] text-white'
                        : 'bg-[var(--pill-bg)] text-[var(--foreground)]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="text-[10px] font-bold uppercase text-[var(--muted-text)] px-2 py-1 border-t border-[var(--card-border)] pt-2">
                Industry
              </div>
              {(['All', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'] as Industry[]).map((ind) => (
                <button
                  key={ind}
                  onClick={() => {
                    setSelectedCategory(ind);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === ind
                      ? 'bg-[#ff5722]/10 text-[#ff5722] font-bold'
                      : 'text-[var(--foreground)] hover:bg-[var(--card-hover)]'
                  }`}
                >
                  {ind === 'All' ? 'All Industries' : ind}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Claim Rank Button */}
        <button
          onClick={handleClaim}
          className="flex items-center justify-center px-6 py-2.5 rounded-xl sm:rounded-full bg-[#ff7a59] hover:bg-[#ff5722] text-white text-xs sm:text-sm font-bold tracking-tight shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span>Claim rank</span>
        </button>
      </div>

      {/* Hero Selection Dropdown (Select hero directly from list) */}
      {isHeroDropdownOpen && (
        <div className="mt-2 w-full rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl overflow-hidden text-left z-40 max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-[var(--card-border)] bg-[var(--pill-bg)]/40 flex items-center justify-between text-[11px] font-bold text-[var(--muted-text)]">
            <span>SELECT HERO TO BID</span>
            <button
              onClick={() => setIsHeroDropdownOpen(false)}
              className="text-xs text-[#ff5722] hover:underline"
            >
              Close
            </button>
          </div>

          {filteredHeroes.length > 0 ? (
            filteredHeroes.map((h) => {
              const isSelected = selectedHeroId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHeroId(h.id);
                    setSearchTerm(h.name);
                    setIsHeroDropdownOpen(false);
                    openBidModal(h);
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between hover:bg-[var(--card-hover)] cursor-pointer border-b border-[var(--card-border)]/40 last:border-0 transition-colors ${
                    isSelected ? 'bg-[#ff5722]/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.avatarUrl} alt={h.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <span>{h.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--pill-bg)] text-[#ff5722] font-semibold">
                          {h.region} • {h.industry}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ff5722]" />}
                      </div>
                      <div className="text-[10px] text-[var(--muted-text)]">{h.titleTag} • {h.latestBlockbuster}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#ff5722]">Spot #{h.currentRank}</span>
                    <div className="text-[10px] text-[var(--muted-text)]">{formatRupee(h.totalBidAmount)}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-xs text-[var(--muted-text)] text-center">
              No matching hero found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
