'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { Search, X, Zap, ChevronRight, Film } from 'lucide-react';

export function SearchModal() {
  const { isSearchOpen, closeSearch, heroes, openBidModal } = useCinebid();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global keydown for CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSearchOpen) {
          closeSearch();
        } else {
          useCinebid;
        }
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const results = heroes.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.titleTag.toLowerCase().includes(query.toLowerCase()) ||
    h.latestBlockbuster.toLowerCase().includes(query.toLowerCase()) ||
    h.industry.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--card-border)]">
          <Search className="w-5 h-5 text-[var(--muted-text)] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search heroes by name, movie, industry or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[var(--muted-text)] hover:text-[var(--foreground)] mr-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="px-2 py-1 rounded-md text-[10px] font-bold bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--card-border)]/40">
          {results.length > 0 ? (
            results.map((hero) => (
              <div
                key={hero.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--card-hover)] transition-colors cursor-pointer group"
                onClick={() => {
                  closeSearch();
                  router.push(`/heroes/${hero.id}`);
                }}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[var(--card-border)]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[var(--foreground)] group-hover:text-[#ff5722] transition-colors">
                        {hero.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--muted-text)] font-semibold">
                        {hero.industry}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--muted-text)]">
                      {hero.titleTag} • {hero.latestBlockbuster}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#ff5722]">
                      #{hero.currentRank}
                    </span>
                    <div className="text-[10px] text-[var(--muted-text)] font-medium">
                      {formatRupee(hero.totalBidAmount)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSearch();
                      openBidModal(hero);
                    }}
                    className="p-2 rounded-xl bg-[var(--pill-bg)] hover:bg-[#ff5722] hover:text-white text-[var(--foreground)] transition-colors cursor-pointer"
                    title="Outbid"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[var(--muted-text)]">
              No matching heroes found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
