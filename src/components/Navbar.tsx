'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCinebid } from '@/context/CinebidContext';
import { useTheme } from '@/context/ThemeContext';
import { Search, Sun, Moon } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { 
    openSearch, 
    timeWindow, 
    setTimeWindow 
  } = useCinebid();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background)]/95 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Left: Brand + Stats Pill (Exact Outbid.lol layout) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-[var(--foreground)] hover:opacity-90 transition-opacity"
          >
            {/* Outbid style 2-bar icon */}
            <div className="flex flex-col gap-1 w-5 sm:w-6 justify-center">
              <span className="w-full h-1 bg-[#ff5722] rounded-full"></span>
              <span className="w-3/4 h-1 bg-[#ff5722] rounded-full"></span>
            </div>
            <span className="font-extrabold tracking-tight">cinebid<span className="text-[#ff5722]">.lol</span></span>
          </Link>

          {/* Stats Pill */}
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-500 font-bold">185 online</span>
            <span className="opacity-40">•</span>
            <span>stats →</span>
          </Link>
        </div>

        {/* Right Navigation: Exactly Daily, Categories, About, Search, Theme */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[var(--muted-text)]">
          {/* Daily */}
          <button
            onClick={() => setTimeWindow(timeWindow === 'today' ? 'all-time' : 'today')}
            className={`transition-colors cursor-pointer ${
              timeWindow === 'today'
                ? 'text-[#ff5722] font-bold'
                : 'hover:text-[var(--foreground)]'
            }`}
          >
            Daily
          </button>

          {/* Categories (Heroes) */}
          <Link
            href="/heroes"
            className={`transition-colors ${
              pathname === '/heroes'
                ? 'text-[var(--foreground)] font-bold'
                : 'hover:text-[var(--foreground)]'
            }`}
          >
            Categories
          </Link>

          {/* About */}
          <Link
            href="/how-it-works"
            className={`transition-colors ${
              pathname === '/how-it-works'
                ? 'text-[var(--foreground)] font-bold'
                : 'hover:text-[var(--foreground)]'
            }`}
          >
            About
          </Link>

          {/* Search Trigger Icon */}
          <button
            onClick={openSearch}
            className="text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer p-1"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Icon */}
          <button
            onClick={toggleTheme}
            className="text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer p-1"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 hover:text-amber-400 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 hover:text-slate-900 transition-colors" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
