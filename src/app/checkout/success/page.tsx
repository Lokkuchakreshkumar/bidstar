'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatRupee } from '@/lib/formatters';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Trophy,
  RefreshCw,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Hero } from '@/types';
import { PremiumBackerCard } from '@/components/PremiumBackerCard';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');
  const statusParam = searchParams.get('status');
  const heroId = searchParams.get('hero_id') || searchParams.get('heroId');

  const hasIdentifier = Boolean(paymentId || sessionId || statusParam === 'succeeded');

  const verificationQuery = React.useMemo(() => {
    const params = new URLSearchParams();
    if (paymentId) params.set('payment_id', paymentId);
    if (sessionId) params.set('session_id', sessionId);
    if (statusParam) params.set('status', statusParam);
    if (heroId) params.set('hero_id', heroId);
    return params.toString();
  }, [paymentId, sessionId, statusParam, heroId]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    hero?: Hero;
    amount?: number;
    username?: string;
    previousRank?: number;
    newRank?: number;
    becameRankOne?: boolean;
    alreadyFulfilled?: boolean;
  } | null>(null);

  const triggerVerification = React.useCallback(() => {
    if (!hasIdentifier) return;

    setLoading(true);
    setError(null);

    fetch(`/api/checkout/verify?${verificationQuery}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);

          // Play celebration audio and confetti
          if (json.data.becameRankOne) {
            sound.playRankOneChime();
            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.55 },
                colors: ['#e95325', '#f59e0b', '#10b981', '#ffffff'],
              });
            } catch {}
          } else {
            sound.playBidPlaced();
            try {
              confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#e95325', '#f59e0b', '#10b981'],
              });
            } catch {}
          }
        } else {
          setError(json.message || 'Payment is still being confirmed or was not completed.');
        }
      })
      .catch((err) => {
        console.error('Verification error:', err);
        setError('Failed to connect to verification server. Please retry.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hasIdentifier, verificationQuery]);

  useEffect(() => {
    if (!hasIdentifier) return;
    let active = true;

    fetch(`/api/checkout/verify?${verificationQuery}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success && json.data) {
          setData(json.data);

          // Play celebration audio and confetti
          if (json.data.becameRankOne) {
            sound.playRankOneChime();
            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.55 },
                colors: ['#e95325', '#f59e0b', '#10b981', '#ffffff'],
              });
            } catch {}
          } else {
            sound.playBidPlaced();
            try {
              confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#e95325', '#f59e0b', '#10b981'],
              });
            } catch {}
          }
        } else {
          setError(json.message || 'Payment is still being confirmed or was not completed.');
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error('Verification error:', err);
        setError('Failed to connect to verification server. Please retry.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hasIdentifier, verificationQuery]);

  const displayError = !hasIdentifier ? 'No payment or transaction identifier provided in the return URL.' : error;
  const isEvaluating = !hasIdentifier ? false : loading;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
      {isEvaluating ? (
        <div className="text-center py-24 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
          <div className="w-12 h-12 border-3 border-[#e95325] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Verifying Dodo Payments Transaction
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-text)]">
            Confirming receipt with Dodo Merchant of Record and updating live leaderboard...
          </p>
        </div>
      ) : displayError ? (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Payment Pending Confirmation
          </h2>
          <p className="mt-2 text-xs text-[var(--muted-text)] max-w-md mx-auto">
            {displayError}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={triggerVerification}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Verification
            </button>

            <Link
              href="/leaderboard"
              className="px-4 py-2 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-xs font-medium text-[var(--foreground)] transition-colors"
            >
              Go to Leaderboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Success Hero Header */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 text-center relative overflow-hidden">
            {/* Subtle top ambient indicator */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#e95325] to-emerald-500" />

            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Succeeded • Verified via Dodo Payments</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Contribution Confirmed!
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[var(--muted-text)] max-w-lg mx-auto">
              Thank you, <strong className="text-[var(--foreground)]">@{data?.username || 'Cinema Fan'}</strong>! Your backing of{' '}
              <strong className="text-[var(--foreground)] tabular-nums">{formatRupee(data?.amount || 0)}</strong> has been processed and applied in real time.
            </p>

            {/* Hero Quick Badge */}
            {data?.hero && (
              <div className="mt-6 p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.hero.avatarUrl}
                    alt={data.hero.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[var(--card-border)] shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[var(--foreground)] tracking-tight">
                        {data.hero.name}
                      </h3>
                      {data.hero.currentRank === 1 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          <Trophy className="w-3 h-3" /> #1 Champion
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--muted-text)] mt-0.5">
                      {data.hero.titleTag} • {data.hero.region} Cinema ({data.hero.industry})
                    </div>
                    <div className="text-xs text-[var(--foreground)] font-semibold mt-1 tabular-nums">
                      Total Backed: {formatRupee(data.hero.totalBidAmount)}
                    </div>
                  </div>
                </div>

                {/* Rank Movement */}
                <div className="flex items-center gap-3 bg-[var(--card-bg)] px-4 py-2.5 rounded-xl border border-[var(--card-border)] self-stretch sm:self-auto justify-around">
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Prior Spot</div>
                    <div className="text-sm font-bold text-[var(--muted-text)] tabular-nums">
                      #{data.previousRank ?? data.hero.previousRank}
                    </div>
                  </div>

                  <div className="text-[#e95325] font-bold text-base">→</div>

                  <div className="text-center">
                    <div className="text-[10px] uppercase font-semibold text-emerald-500">Live Spot</div>
                    <div className="text-lg font-bold text-emerald-500 flex items-center gap-0.5 justify-center tabular-nums">
                      #{data.newRank ?? data.hero.currentRank}
                      {(data.newRank ?? data.hero.currentRank) < (data.previousRank ?? data.hero.previousRank) && (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3D Three.js Collectible Backer Card */}
          {data?.hero && (
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#e95325]">
                  Official Proof of Backing
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5">
                  Your 3D Collectible Spot Card
                </h3>
                <p className="text-xs text-[var(--muted-text)] mt-1 max-w-md mx-auto">
                  Interactive WebGL trading card minted for this backing. Move mouse or drag to tilt in 3D space, flip to view security credentials, and download to share!
                </p>
              </div>

              <PremiumBackerCard
                hero={data.hero}
                amount={data.amount || 60}
                username={data.username || 'Cinema Fan'}
                rank={data.newRank ?? data.hero.currentRank}
                paymentId={paymentId || sessionId || undefined}
                becameRankOne={data.becameRankOne}
              />
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>View Live Leaderboard</span>
            </Link>

            <Link
              href="/heroes"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Back Another Star</span>
            </Link>
          </div>

          {/* Evidence & Transaction Metadata Table */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">
              Receipt & Transaction Evidence
            </h4>

            <div className="divide-y divide-[var(--border-subtle)] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Payment / Session ID</span>
                <span className="font-mono text-[11px] text-[var(--foreground)] tabular-nums truncate max-w-[200px] sm:max-w-none">
                  {paymentId || sessionId || 'Confirmed'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Supporter Name</span>
                <span className="font-medium text-[var(--foreground)] tabular-nums">
                  @{data?.username || 'Cinema Fan'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Merchant of Record</span>
                <span className="font-medium text-[var(--foreground)] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Dodo Payments
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Payment Status</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                  SUCCEEDED
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Product</span>
                <span className="font-medium text-[var(--foreground)]">
                  BidStar Contribution (GST-Inclusive)
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-text)]">Amount Settled</span>
                <span className="font-bold text-[var(--foreground)] tabular-nums">
                  {formatRupee(data?.amount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-xs text-[var(--muted-text)]">
          Loading checkout verification...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
