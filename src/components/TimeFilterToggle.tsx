'use client';

import React from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { TimeWindow } from '@/types';
import { Trophy, Flame, Calendar } from 'lucide-react';

export function TimeFilterToggle() {
  const { timeWindow, setTimeWindow } = useCinebid();

  const options: { id: TimeWindow; label: string; icon: React.ElementType }[] = [
    { id: 'all-time', label: 'All-time', icon: Trophy },
    { id: 'today', label: 'Today', icon: Flame },
    { id: 'this-week', label: 'This Week', icon: Calendar },
  ];

  return (
    <div className="flex items-center justify-center my-4 sm:my-6">
      <div className="inline-flex items-center p-1 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = timeWindow === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => setTimeWindow(opt.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--pill-bg)] text-[#ff5722] border border-[#ff5722]/30 shadow-xs'
                  : 'text-[var(--muted-text)] hover:text-[var(--foreground)] border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff5722]' : 'opacity-60'}`} />
              <span>{opt.label}</span>
              {opt.id === 'today' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722] animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
