'use client';

import React from 'react';
import { useCinebid } from '@/context/CinebidContext';

export function CategoryFilters() {
  const { 
    selectedRegion, 
    setSelectedRegion, 
    selectedCategory, 
    setSelectedCategory 
  } = useCinebid();

  const categories = [
    {
      id: 'all',
      label: 'All Cinema',
      isActive: selectedRegion === 'All' && selectedCategory === 'All',
      onClick: () => {
        setSelectedRegion('All');
        setSelectedCategory('All');
      },
    },
    {
      id: 'south',
      label: 'South Cinema',
      isActive: selectedRegion === 'South' && selectedCategory === 'All',
      onClick: () => {
        setSelectedRegion('South');
        setSelectedCategory('All');
      },
    },
    {
      id: 'north',
      label: 'North Cinema',
      isActive: selectedRegion === 'North' && selectedCategory === 'All',
      onClick: () => {
        setSelectedRegion('North');
        setSelectedCategory('All');
      },
    },
    {
      id: 'telugu',
      label: 'Telugu',
      isActive: selectedCategory === 'Telugu',
      onClick: () => {
        setSelectedRegion('South');
        setSelectedCategory('Telugu');
      },
    },
    {
      id: 'hindi',
      label: 'Hindi',
      isActive: selectedCategory === 'Hindi',
      onClick: () => {
        setSelectedRegion('North');
        setSelectedCategory('Hindi');
      },
    },
    {
      id: 'tamil',
      label: 'Tamil',
      isActive: selectedCategory === 'Tamil',
      onClick: () => {
        setSelectedRegion('South');
        setSelectedCategory('Tamil');
      },
    },
    {
      id: 'malayalam',
      label: 'Malayalam',
      isActive: selectedCategory === 'Malayalam',
      onClick: () => {
        setSelectedRegion('South');
        setSelectedCategory('Malayalam');
      },
    },
    {
      id: 'kannada',
      label: 'Kannada',
      isActive: selectedCategory === 'Kannada',
      onClick: () => {
        setSelectedRegion('South');
        setSelectedCategory('Kannada');
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center justify-center">
      <div className="flex items-center gap-1.5 min-w-max px-0.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={cat.onClick}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              cat.isActive
                ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold shadow-xs'
                : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--card-border)] hover:bg-[var(--card-hover)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
