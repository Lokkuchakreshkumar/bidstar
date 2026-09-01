'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo, formatNumber } from '@/lib/formatters';
import { 
  ArrowLeft, 
  Zap, 
  Share2, 
  Clock, 
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';

export default function HeroDetailPage() {
  const params = useParams();
  const router = useRouter();
  const heroId = params?.id as string;

  const { getHeroById, openBidModal, openShareModal, bids, currentLeader, timeWindow } = useCinebid();
  const hero = getHeroById(heroId);

  if (!hero) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Hero not found</h2>
        <p className="text-xs text-[var(--muted-text)] mt-1">This hero might have been unlisted or does not exist.</p>
        <Link href="/heroes" className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#ff5722] text-white text-xs font-bold">
          Explore All Heroes
        </Link>
      </div>
    );
  }

  const leaderAmount = timeWindow === 'today'
    ? (currentLeader?.todayBidAmount || 0)
    : timeWindow === 'this-week'
    ? (currentLeader?.weekBidAmount || 0)
    : (currentLeader?.totalBidAmount || 0);

  const heroAmount = timeWindow === 'today'
    ? hero.todayBidAmount
    : timeWindow === 'this-week'
    ? hero.weekBidAmount
    : hero.totalBidAmount;

  const isLeader = hero.id === currentLeader?.id;
  const amountToTakeNumberOne = isLeader
    ? 10
    : Math.max(10, (leaderAmount - heroAmount) + 10);

  const heroBids = bids.filter((b) => b.heroId === hero.id);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </button>

      {/* Cinematic Cover & Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg">
        {/* Cover Backdrop */}
        <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.coverUrl}
            alt={hero.name}
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/40 to-transparent"></div>
        </div>

        {/* Profile Content Overlay */}
        <div className="relative px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-[var(--card-bg)] shadow-2xl shrink-0 bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-[#ff5722] text-white shadow-xs">
                SPOT #{hero.currentRank}
              </div>
            </div>

            {/* Name & Titles */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30">
                  {hero.region} • {hero.industry}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {hero.titleTag}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight mt-1">
                {hero.name}
              </h1>

              <p className="text-xs sm:text-sm text-[var(--muted-text)] font-semibold mt-0.5">
                Latest: <span className="text-[var(--foreground)]">{hero.latestBlockbuster}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => openShareModal(hero)}
              className="p-3 rounded-2xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-[var(--foreground)] transition-all cursor-pointer"
              title="Share Hero Spot"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openBidModal(hero)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#ff5722]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isLeader ? `Hold #1 for ${formatRupee(10)}` : `Put ${formatRupee(amountToTakeNumberOne)} & Take #1`}</span>
            </button>
          </div>
        </div>

        {/* Hero Bio */}
        <div className="px-6 sm:px-8 pb-6 border-t border-[var(--card-border)]/60 pt-4">
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed max-w-3xl">
            {hero.bio}
          </p>
        </div>
      </div>

      {/* Prominent Money-to-Top Callout Card */}
      {!isLeader && (
        <div className="my-6 p-4 rounded-3xl bg-gradient-to-r from-[#ff5722]/20 via-[#ff5722]/10 to-[var(--card-bg)] border border-[#ff5722]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center font-bold shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">
                Take the #1 spot from {currentLeader.name}
              </div>
              <div className="text-xs text-[var(--muted-text)]">
                Put exactly <strong className="text-[#ff5722] font-black">{formatRupee(amountToTakeNumberOne)}</strong> to propel {hero.name} to #1 on the live leaderboard.
              </div>
            </div>
          </div>

          <button
            onClick={() => openBidModal(hero)}
            className="px-5 py-2.5 rounded-2xl bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold text-xs shadow-md shadow-[#ff5722]/30 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            Put {formatRupee(amountToTakeNumberOne)} & Claim #1
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
            Total Backing
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#ff5722] mt-1 tabular-nums">
            {formatRupee(hero.totalBidAmount)}
          </div>
          <div className="text-[10px] text-[var(--muted-text)] mt-0.5">
            {hero.totalBidCount} contributions
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
            Amount for #1
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1 tabular-nums">
            {formatRupee(amountToTakeNumberOne)}
          </div>
          <div className="text-[10px] text-[var(--muted-text)] mt-0.5">
            {isLeader ? 'To defend position' : 'To overtake leader'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
            Current Spot
          </div>
          <div className="text-xl sm:text-2xl font-black text-[var(--foreground)] mt-1 tabular-nums flex items-center gap-1">
            <Trophy className="w-5 h-5 text-amber-500" />
            #{hero.currentRank}
          </div>
          <div className="text-[10px] text-[var(--muted-text)] mt-0.5">
            Leaderboard rank
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
            Backers Count
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-500 mt-1 tabular-nums">
            {formatNumber(hero.supportersCount)}
          </div>
          <div className="text-[10px] text-[var(--muted-text)] mt-0.5">
            Fans participating
          </div>
        </div>
      </div>

      {/* Hero Activity Log */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs my-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-extrabold text-base text-[var(--foreground)]">Recent Spot Contributions</h3>
          </div>

          <button
            onClick={() => openBidModal(hero)}
            className="px-4 py-1.5 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Claim Spot
          </button>
        </div>

        <div className="space-y-2.5">
          {heroBids.length > 0 ? (
            heroBids.map((b) => (
              <div key={b.id} className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[var(--foreground)]">@{b.username}</span> backed <strong className="text-[#ff5722]">{formatRupee(b.amount)}</strong>
                    <div className="text-[10px] text-[var(--muted-text)] mt-0.5">
                      Result rank: #{b.resultRank} • {formatTimeAgo(b.createdAt)}
                    </div>
                  </div>
                </div>
                <span className="font-black text-sm text-[#ff5722] tabular-nums">+{formatRupee(b.amount)}</span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[var(--muted-text)]">
              No contributions yet for {hero.name}. Be the first to put {formatRupee(amountToTakeNumberOne)} and claim #1 on the leaderboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
