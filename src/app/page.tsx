'use client';

import React from 'react';
import { CategoryFilters } from '@/components/CategoryFilters';
import { ClaimRankHero } from '@/components/ClaimRankHero';
import { PodiumCards } from '@/components/PodiumCards';
import { RankedHeroList } from '@/components/RankedHeroList';
import { HomeSuggestSection } from '@/components/HomeSuggestSection';
import { LiveActivityDock } from '@/components/LiveActivityDock';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center pb-16">
      {/* 1. "All-time / Today" Toggle + "Claim #1 for ₹X" + Input Bar */}
      <ClaimRankHero />

      {/* 2. Category Pills Filter Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
        <CategoryFilters />
      </div>

      {/* 3. Top 3 Spotlight Podium Cards */}
      <PodiumCards />

      {/* 4. Ranked Contender List (#4, #5, #6...) */}
      <RankedHeroList />

      {/* 5. Suggest Heroes Community Section */}
      <HomeSuggestSection />

      {/* 6. Minimalist Live Activity Dock */}
      <LiveActivityDock />
    </div>
  );
}
