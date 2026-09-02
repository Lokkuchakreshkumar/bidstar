'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { Industry, Region } from '@/types';
import { ChevronDown, Film, Check, Crown } from 'lucide-react';

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

  const customBidAmount = Math.max(50, amountToBeatNumberOne);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<string>('');
  const [isHeroDropdownOpen, setIsHeroDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsHeroDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHeroDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredHeroes = heroes.filter((h) => {
    const matchesRegion = selectedRegion === 'All' || h.region === selectedRegion;
    const matchesCategory = selectedCategory === 'All' || h.industry === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.titleTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesCategory && matchesSearch;
  });

  const selectedHero = heroes.find((h) => h.id === selectedHeroId) || 
    (searchTerm ? filteredHeroes[0] : currentLeader || heroes[0]);

  const isSelectedLeader = selectedHero?.id === currentLeader?.id;

  const handleClaim = () => {
    if (selectedHero) {
      openBidModal(selectedHero);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center mt-6 mb-8 px-4">
      
      {/* 1. Time Toggle: All-time | Today (Vercel Segmented Control) */}
      <div className="flex items-center justify-center mb-5">
        <div className="inline-flex items-center p-1 rounded-full bg-[var(--pill-bg)] border border-[var(--card-border)] shadow-xs">
          <button
            onClick={() => setTimeWindow('all-time')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              timeWindow === 'all-time'
                ? 'bg-[var(--card-bg)] text-[var(--foreground)] font-bold shadow-xs border border-[var(--border-subtle)]'
                : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            All-Time
          </button>

          <button
            onClick={() => setTimeWindow('today')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              timeWindow === 'today'
                ? 'bg-[var(--card-bg)] text-[var(--foreground)] font-bold shadow-xs border border-[var(--border-subtle)]'
                : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e95325]"></span>
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* 2. Main Heading: Clean, authoritative headline without awkward math symbols */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
        <span>{isSelectedLeader ? "Defend #1 with" : `Claim ${timeWindow === 'today' ? "Today's" : ''} #1 for`} </span>
        <span className="text-[#e95325] tabular-nums font-black">{formatRupee(customBidAmount)}</span>
      </h1>

      {/* 3. Subtitle with Champion Context */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-[var(--muted-text)] max-w-lg mx-auto leading-relaxed">
        {currentLeader && (
          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--foreground)] bg-[var(--pill-bg)] px-3 py-1 rounded-full border border-[var(--pill-border)]">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Reigning Champion: <strong>{currentLeader.name}</strong></span>
            <span className="text-[var(--muted-text)]">•</span>
            <span className="tabular-nums text-amber-500 font-semibold">{formatRupee(timeWindow === 'today' ? currentLeader.todayBidAmount : currentLeader.totalBidAmount)}</span>
          </span>
        )}
      </div>

      {/* 4. Input Bar & Dropdown Container */}
      <div ref={searchContainerRef} className="mt-6 relative">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 p-1.5 rounded-2xl sm:rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          
          {/* Left: Hero Selector Input */}
          <div className="relative flex-1 flex items-center px-3.5 py-2">
            <Film className="w-4 h-4 text-[var(--muted-text)] mr-2.5 shrink-0 opacity-60" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Select or search hero..."
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
            <span className="text-[11px] font-semibold text-[#e95325] shrink-0 bg-[#e95325]/10 px-2 py-0.5 rounded-md mr-1">
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
              {selectedCategory === 'All' ? 'Choose category' : selectedCategory}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {isCategoryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-60 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl z-50 p-2.5 text-left">
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
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedRegion === r
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'bg-[var(--pill-bg)] text-[var(--foreground)] hover:bg-[var(--card-hover)]'
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
                      ? 'bg-[#e95325]/10 text-[#e95325] font-bold'
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
          className="flex items-center justify-center px-6 py-2.5 rounded-xl sm:rounded-full bg-[#e95325] hover:bg-[#d84417] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-xs transition-all cursor-pointer"
        >
          <span>{isSelectedLeader ? "Defend #1" : "Claim rank"}</span>
        </button>
      </div>

      {/* Hero Selection Dropdown */}
      {isHeroDropdownOpen && (
        <div className="mt-2 w-full rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl overflow-hidden text-left z-40 max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-[var(--card-border)] bg-[var(--pill-bg)]/40 flex items-center justify-between text-[11px] font-semibold text-[var(--muted-text)]">
            <span>SELECT HERO TO BID</span>
            <button
              onClick={() => setIsHeroDropdownOpen(false)}
              className="text-xs text-[#e95325] hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>

          {filteredHeroes.length > 0 ? (
            filteredHeroes.map((h) => {
              const isSelected = selectedHeroId === h.id;
              const isHeroNumberOne = h.id === currentLeader?.id;

              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHeroId(h.id);
                    setSearchTerm(h.name);
                    setIsHeroDropdownOpen(false);
                    openBidModal(h);
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between hover:bg-[var(--card-hover)] cursor-pointer border-b border-[var(--border-subtle)] last:border-0 transition-colors ${
                    isSelected ? 'bg-[#e95325]/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.avatarUrl} alt={h.name} className="w-8 h-8 rounded-xl object-cover border border-[var(--card-border)]" />
                    <div>
                      <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                        <span>{h.name}</span>
                        {isHeroNumberOne && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold flex items-center gap-0.5">
                            <Crown className="w-3 h-3 fill-current" />
                            <span>#1</span>
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--pill-bg)] text-[var(--muted-text)] font-medium">
                          {h.region} • {h.industry}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#e95325]" />}
                      </div>
                      <div className="text-[11px] text-[var(--muted-text)]">{h.industry} Cinema</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#e95325] tabular-nums">Spot #{h.currentRank}</span>
                    <div className="text-[11px] text-[var(--muted-text)] tabular-nums">{formatRupee(h.totalBidAmount)}</div>
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
    </div>
  );
}
