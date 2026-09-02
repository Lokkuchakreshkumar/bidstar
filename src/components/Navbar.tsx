'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCinebid } from '@/context/CinebidContext';
import { useTheme } from '@/context/ThemeContext';
import { Search, Sun, Moon, Menu, X, Sparkles, Trophy, Shield, HelpCircle, Activity, Film } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { openSearch, openRequestModal } = useCinebid();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/heroes', label: 'Heroes', icon: Film },
    { href: '/leaderboard', label: 'Standings', icon: Trophy },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { href: '/rules', label: 'Rules', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--background)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-4">
        
        {/* Left: Brand + Live Status Pill */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[var(--foreground)] hover:opacity-90 transition-opacity"
          >
            {/* Minimalist 2-bar logo */}
            <div className="flex flex-col gap-1 w-4 sm:w-5 justify-center">
              <span className="w-full h-0.5 sm:h-1 bg-[#e95325] rounded-full"></span>
              <span className="w-3/4 h-0.5 sm:h-1 bg-[#e95325] rounded-full"></span>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              bidstar<span className="text-[#e95325]">.</span>
            </span>
          </Link>

          {/* Live rankings pill */}
          <Link
            href="/leaderboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--card-border)] transition-colors tabular-nums"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-500 font-medium">live</span>
            <span className="opacity-40">•</span>
            <span>rankings →</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-[var(--foreground)] font-semibold bg-[var(--pill-bg)] border border-[var(--pill-border)] shadow-2xs'
                    : 'text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--pill-bg)]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools (Suggest Button, Search, Theme, Mobile Hamburger) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Suggest Hero Button */}
          <button
            onClick={openRequestModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
            title="Suggest a new superstar to be listed"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e95325]" />
            <span>Suggest Star</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--pill-bg)] border border-transparent hover:border-[var(--card-border)] transition-all cursor-pointer"
            title="Search superstars (⌘K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--pill-bg)] border border-transparent hover:border-[var(--card-border)] transition-all cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 hover:text-amber-400 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 hover:text-[var(--foreground)] transition-colors" />
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--pill-bg)] border border-transparent hover:border-[var(--card-border)] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[var(--pill-bg)] text-[var(--foreground)] border border-[var(--pill-border)]'
                      : 'text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--pill-bg)]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openRequestModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Suggest Superstar</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)] text-xs font-medium"
              >
                <Search className="w-4 h-4" />
                <span>Search Superstars (⌘K)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
