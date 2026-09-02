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
  Trophy,
  Flame,
  Crown,
  Shield
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
        <Link href="/heroes" className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#e95325] text-white text-xs font-semibold">
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
    ? 50
    : Math.max(50, (leaderAmount - heroAmount) + 10);

  const heroBids = bids.filter((b) => b.heroId === hero.id);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </button>

      {/* Cinematic Cover & Hero Header */}
      <div className={`relative rounded-2xl overflow-hidden bg-[var(--card-bg)] shadow-xs ${
        isLeader ? 'border-2 border-amber-500/50 ring-1 ring-amber-500/20' : 'border border-[var(--card-border)]'
      }`}>
        {/* Cover Backdrop */}
        <div className="h-48 sm:h-60 w-full relative overflow-hidden bg-[var(--pill-bg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.coverUrl}
            alt={hero.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/40 to-transparent"></div>
        </div>

        {/* Profile Content Overlay */}
        <div className="relative px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 shadow-md shrink-0 bg-[var(--card-bg)] ${
              isLeader ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-[var(--card-border)]'
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                isLeader ? 'bg-amber-500 text-black shadow-xs' : 'bg-[var(--foreground)] text-[var(--background)]'
              }`}>
                {isLeader && <Crown className="w-3 h-3 fill-current" />}
                <span>SPOT #{hero.currentRank}</span>
              </div>
            </div>

            {/* Name & Titles */}
            <div>
              <div className="flex items-center gap-2">
                {isLeader ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-black flex items-center gap-1 shadow-xs">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>REIGNING #1 SUPERSTAR</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)]">
                    {hero.region} Superstar
                  </span>
                )}
                <span className="text-xs font-medium text-[var(--muted-text)]">
                  {hero.industry} Cinema
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight mt-1">
                {hero.name}
              </h1>

              <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5 font-normal">
                {hero.titleTag} • {hero.latestBlockbuster}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full sm:w-auto flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => openShareModal(hero)}
              className="p-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-[var(--foreground)] transition-all cursor-pointer shrink-0"
              title="Share Hero Spot"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openBidModal(hero)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
                isLeader
                  ? 'bg-amber-500 hover:bg-amber-400 text-black'
                  : 'bg-[#e95325] hover:bg-[#d84417] text-white'
              }`}
            >
              {isLeader ? (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Defend Crown (from {formatRupee(50)})</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Put {formatRupee(amountToTakeNumberOne)} & Take #1</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Money-to-Top Callout Card (or Defend Card) */}
      {!isLeader ? (
        <div className="my-6 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e95325]/10 text-[#e95325] flex items-center justify-center font-bold shrink-0">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--foreground)]">
                Take the #1 spot from {currentLeader.name}
              </div>
              <div className="text-xs text-[var(--muted-text)]">
                Contribute <strong className="text-[var(--foreground)] font-semibold tabular-nums">{formatRupee(amountToTakeNumberOne)}</strong> to propel {hero.name} to #1 on the live leaderboard.
              </div>
            </div>
          </div>

          <button
            onClick={() => openBidModal(hero)}
            className="px-4 py-2 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white font-semibold text-xs transition-all shrink-0 cursor-pointer"
          >
            Put {formatRupee(amountToTakeNumberOne)} & Claim #1
          </button>
        </div>
      ) : (
        <div className="my-6 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--foreground)]">
                {hero.name} holds the #1 Throne!
              </div>
              <div className="text-xs text-[var(--muted-text)]">
                Lead is actively being contested by rivals. Strengthen the lead with any amount.
              </div>
            </div>
          </div>

          <button
            onClick={() => openBidModal(hero)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shrink-0 cursor-pointer"
          >
            Defend #1 Position
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className={`p-4 rounded-xl bg-[var(--card-bg)] border ${isLeader ? 'border-amber-500/40' : 'border-[var(--card-border)]'}`}>
          <div className="text-[10px] font-semibold uppercase text-[var(--muted-text)]">
            Total Backing
          </div>
          <div className={`text-lg sm:text-xl font-bold mt-1 tabular-nums ${isLeader ? 'text-amber-500' : 'text-[var(--foreground)]'}`}>
            {formatRupee(hero.totalBidAmount)}
          </div>
          <div className="text-xs text-[var(--muted-text)] mt-0.5 tabular-nums font-normal">
            {hero.totalBidCount} contributions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-semibold uppercase text-[var(--muted-text)]">
            Amount for #1
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#e95325] mt-1 tabular-nums">
            {formatRupee(amountToTakeNumberOne)}
          </div>
          <div className="text-xs text-[var(--muted-text)] mt-0.5 font-normal">
            {isLeader ? 'To defend position' : 'To overtake leader'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-semibold uppercase text-[var(--muted-text)]">
            Current Spot
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-1 tabular-nums flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            #{hero.currentRank}
          </div>
          <div className="text-xs text-[var(--muted-text)] mt-0.5 font-normal">
            Leaderboard rank
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-semibold uppercase text-[var(--muted-text)]">
            Backers Count
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-1 tabular-nums">
            {formatNumber(hero.supportersCount)}
          </div>
          <div className="text-xs text-[var(--muted-text)] mt-0.5 font-normal">
            Fans participating
          </div>
        </div>
      </div>

      {/* Hero Activity Log */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs my-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--muted-text)]" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">Recent Spot Contributions</h3>
          </div>

          <button
            onClick={() => openBidModal(hero)}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] text-xs font-semibold transition-all cursor-pointer"
          >
            {isLeader ? "Defend Crown" : "Claim Spot"}
          </button>
        </div>

        <div className="space-y-2.5">
          {heroBids.length > 0 ? (
            heroBids.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[var(--card-bg)] text-[#e95325] flex items-center justify-center font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">@{b.username}</span> backed <strong className="text-[var(--foreground)] tabular-nums">{formatRupee(b.amount)}</strong>
                    <div className="text-[11px] text-[var(--muted-text)] mt-0.5 tabular-nums">
                      Result rank: #{b.resultRank} • {formatTimeAgo(b.createdAt)}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-[var(--foreground)] tabular-nums">+{formatRupee(b.amount)}</span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[var(--muted-text)]">
              No contributions yet for {hero.name}. Be the first to contribute {formatRupee(amountToTakeNumberOne)} and claim #1 on the leaderboard.
            </div>
          )}
        </div>
      </div>

      {/* Editorial Fandom Disclaimer */}
      <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] text-[11px] text-[var(--muted-text)] leading-relaxed my-6 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-[#e95325] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--foreground)]">Fan Tribute Listing:</strong> This profile is an independent fan community tribute for {hero.name} and is not affiliated with, sponsored by, or endorsed by {hero.name} or their management. All contributions represent voluntary digital platform fees for leaderboard ranking; zero funds are transferred to or collected on behalf of the depicted artist. <Link href="/disclaimer" className="underline hover:text-[var(--foreground)]">Read full legal disclaimer</Link>.
        </div>
      </div>
    </div>
  );
}
