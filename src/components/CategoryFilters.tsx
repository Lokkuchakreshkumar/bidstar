'use client';

import React from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { Region, Industry } from '@/types';
import { 
  LayoutGrid, 
  Trophy, 
  Flame, 
  Zap, 
  Film, 
  Sparkles, 
  Star, 
  Compass, 
  Globe2 
} from 'lucide-react';
import Link from 'next/link';

export function CategoryFilters() {
  const { 
    selectedRegion, 
    setSelectedRegion, 
    selectedCategory, 
    setSelectedCategory 
  } = useCinebid();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-0.5">
        
        {/* All Cinema */}
        <button
          onClick={() => {
            setSelectedRegion('All');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedRegion === 'All' && selectedCategory === 'All'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>All</span>
        </button>

        {/* Leaderboards */}
        <Link
          href="/leaderboard"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] transition-all cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 opacity-70" />
          <span>Leaderboards</span>
        </Link>

        {/* South Cinema Filter */}
        <button
          onClick={() => {
            setSelectedRegion('South');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedRegion === 'South' && selectedCategory === 'All'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>South Cinema</span>
        </button>

        {/* North Cinema Filter */}
        <button
          onClick={() => {
            setSelectedRegion('North');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedRegion === 'North' && selectedCategory === 'All'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>North Cinema</span>
        </button>

        {/* Telugu */}
        <button
          onClick={() => {
            setSelectedRegion('South');
            setSelectedCategory('Telugu');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'Telugu'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Telugu</span>
        </button>

        {/* Hindi */}
        <button
          onClick={() => {
            setSelectedRegion('North');
            setSelectedCategory('Hindi');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'Hindi'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Hindi</span>
        </button>

        {/* Tamil */}
        <button
          onClick={() => {
            setSelectedRegion('South');
            setSelectedCategory('Tamil');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'Tamil'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Tamil</span>
        </button>

        {/* Malayalam */}
        <button
          onClick={() => {
            setSelectedRegion('South');
            setSelectedCategory('Malayalam');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'Malayalam'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Malayalam</span>
        </button>

        {/* Kannada */}
        <button
          onClick={() => {
            setSelectedRegion('South');
            setSelectedCategory('Kannada');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'Kannada'
              ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 border border-[#ff5722]'
              : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kannada</span>
        </button>

        {/* Explore */}
        <Link
          href="/heroes"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 opacity-70" />
          <span>Explore</span>
        </Link>
      </div>
    </div>
  );
}
