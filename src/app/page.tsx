'use client';

import React from 'react';
import { CategoryFilters } from '@/components/CategoryFilters';
import { ClaimRankHero } from '@/components/ClaimRankHero';
import { PodiumCards } from '@/components/PodiumCards';
import { RankedHeroList } from '@/components/RankedHeroList';
import { LiveActivityDock } from '@/components/LiveActivityDock';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center pb-16">
      {/* 1. Category Pills Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <CategoryFilters />
      </div>

      {/* 2. "All-time / Today" Toggle + "Claim #1 for ₹X" + Input Bar */}
      <ClaimRankHero />

      {/* 3. Top 3 Spotlight Podium Cards (#1 Blue, #2 Teal with floating pill, #3 Charcoal) */}
      <PodiumCards />

      {/* 4. Ranked Contender List (#4, #5, #6...) */}
      <RankedHeroList />

      {/* 5. Minimalist Live Activity Dock */}
      <LiveActivityDock />
    </div>
  );
}
