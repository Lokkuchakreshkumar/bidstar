'use client';

import React from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { Sparkles, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

export function HomeSuggestSection() {
  const { heroRequests, openRequestModal } = useCinebid();

  // Show top 3 recent suggestions
  const recentRequests = heroRequests.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[#e95325] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Hero Curation</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Can&apos;t find your favorite cinema icon?
            </h2>

            <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
              bidstar is expanding across Indian cinema. Suggest your superstar from Telugu, Tamil, Hindi, Malayalam, or Kannada industries and rally the fandom to vote them onto the live leaderboard.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={openRequestModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs sm:text-sm font-bold tracking-tight shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Suggest a Superstar</span>
            </button>
          </div>
        </div>

        {/* Live Recent Community Suggestions */}
        {recentRequests.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-3">
              Recent Fan Suggestions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex flex-col justify-between hover:border-[var(--card-border)] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-[var(--foreground)] truncate">
                        {req.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {req.status === 'APPROVED' ? (
                          <><CheckCircle2 className="w-2.5 h-2.5" /> Listed</>
                        ) : (
                          <><Clock className="w-2.5 h-2.5" /> Review</>
                        )}
                      </span>
                    </div>

                    <div className="text-[10px] text-[var(--muted-text)] mt-1">
                      {req.region} • {req.industry}
                    </div>

                    {req.reason && (
                      <p className="text-[11px] text-[var(--muted-text)] mt-1.5 line-clamp-2 italic">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="text-[10px] text-[var(--muted-text)] mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span>By @{req.requestedBy}</span>
                    <span>{req.votesCount} upvote{req.votesCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
