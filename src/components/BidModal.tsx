'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { 
  X, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  Flame
} from 'lucide-react';

export function BidModal() {
  const { 
    activeBidHero, 
    closeBidModal, 
    heroes, 
    currentLeader,
    timeWindow,
    openShareModal,
    user 
  } = useCinebid();

  const leaderAmount = timeWindow === 'today' 
    ? (currentLeader?.todayBidAmount || 0) 
    : timeWindow === 'this-week'
    ? (currentLeader?.weekBidAmount || 0)
    : (currentLeader?.totalBidAmount || 0);

  const heroCurrentAmount = timeWindow === 'today'
    ? (activeBidHero?.todayBidAmount || 0)
    : timeWindow === 'this-week'
    ? (activeBidHero?.weekBidAmount || 0)
    : (activeBidHero?.totalBidAmount || 0);

  const isAlreadyLeader = activeBidHero?.id === currentLeader?.id;
  const amountToTakeNumberOne = isAlreadyLeader
    ? 50
    : Math.max(50, (leaderAmount - heroCurrentAmount) + 10);

  const [bidAmount, setBidAmount] = useState<number>(amountToTakeNumberOne);
  const [customAmountInput, setCustomAmountInput] = useState<string>(amountToTakeNumberOne.toString());
  const [supporterName, setSupporterName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bidstar_fan_name') || localStorage.getItem('cinebid_fan_name');
        if (saved && saved.trim()) return saved.trim();
      } catch {}
    }
    return user?.username && user.username !== 'fan' ? user.username : '';
  });
  const [fanNote, setFanNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prevHeroId, setPrevHeroId] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    newRank: number;
    previousRank: number;
    amountPaid: number;
  } | null>(null);

  // Sync state when active hero changes during render (canonical React pattern)
  if (activeBidHero && activeBidHero.id !== prevHeroId) {
    setPrevHeroId(activeBidHero.id);
    setBidAmount(amountToTakeNumberOne);
    setCustomAmountInput(amountToTakeNumberOne.toString());
    setErrorMessage(null);
  }

  if (!activeBidHero) return null;

  const PRESETS = [50, 100, 250, 500, 1000, 2500, 5000];
  const projectedHeroTotal = heroCurrentAmount + bidAmount;

  const otherHeroes = heroes.filter((h) => h.id !== activeBidHero.id);
  const higherCount = otherHeroes.filter((h) => {
    const hAmt = timeWindow === 'today' ? h.todayBidAmount : timeWindow === 'this-week' ? h.weekBidAmount : h.totalBidAmount;
    return hAmt > projectedHeroTotal;
  }).length;
  const projectedRank = higherCount + 1;

  const handleSelectPreset = (amount: number) => {
    setBidAmount(amount);
    setCustomAmountInput(amount.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setBidAmount(num);
    } else {
      setBidAmount(0);
    }
  };

  const handleConfirmBid = async () => {
    const bidderUsername = supporterName.trim();
    if (!bidderUsername || bidderUsername.length < 2) {
      setErrorMessage('Please enter your fan name or handle (min 2 characters) to appear on the live leaderboard.');
      return;
    }

    if (bidAmount < 50) {
      setErrorMessage('Minimum backing amount is ₹50.');
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Save name to localStorage for future use
      try {
        localStorage.setItem('bidstar_fan_name', bidderUsername);
      } catch {}

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId: activeBidHero.id,
          amount: bidAmount,
          username: bidderUsername,
          userAvatar: user.avatarUrl,
          note: fanNote.trim() || undefined,
          userId: user.id,
        }),
      });

      const data = await response.json();
      const checkoutUrl = data.data?.checkoutUrl || data.checkoutUrl;

      if (!response.ok || !checkoutUrl) {
        const errorMsg = data.error?.message || data.fallback || data.error || 'Failed to initialize Dodo checkout session';
        throw new Error(errorMsg);
      }

      // Redirect directly to Dodo Payments hosted checkout
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const message = err instanceof Error ? err.message : 'Failed to initialize checkout. Please try again.';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    setErrorMessage(null);
    closeBidModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl animate-in zoom-in-95 duration-150 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/30">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeBidHero.avatarUrl} 
              alt={activeBidHero.name} 
              className="w-10 h-10 rounded-xl object-cover border border-[var(--border-subtle)]"
            />
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)] tracking-tight">
                Back {activeBidHero.name}
              </h3>
              <div className="text-xs text-[var(--muted-text)]">
                Spot #{activeBidHero.currentRank} • {activeBidHero.region} Cinema • {formatRupee(heroCurrentAmount)} backed
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {successResult ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              Contribution Applied
            </h4>

            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Backed <strong className="text-[var(--foreground)]">{activeBidHero.name}</strong> with{' '}
              <strong className="text-[var(--foreground)] tabular-nums">{formatRupee(successResult.amountPaid)}</strong>.
            </p>

            {/* Rank Change Card */}
            <div className="my-5 p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center justify-around">
              <div className="text-center">
                <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Previous Spot</div>
                <div className="text-lg font-bold text-[var(--muted-text)] tabular-nums">#{successResult.previousRank}</div>
              </div>

              <div className="text-[#e95325] font-bold text-lg">→</div>

              <div className="text-center">
                <div className="text-[10px] uppercase font-semibold text-emerald-500">New Spot</div>
                <div className="text-2xl font-bold text-emerald-500 flex items-center gap-1 justify-center tabular-nums">
                  #{successResult.newRank}
                  {successResult.newRank < successResult.previousRank && (
                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  handleClose();
                  openShareModal(activeBidHero);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Spot Card</span>
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] text-[var(--foreground)] border border-[var(--pill-border)] text-xs font-medium transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            
            {/* 1. Take #1 Callout */}
            <div className="mb-4 p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-[var(--muted-text)] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#e95325]" />
                  <span>Amount to claim #1 spot:</span>
                </div>
                <div className="text-sm font-bold text-[var(--foreground)] mt-0.5 tabular-nums">
                  {formatRupee(amountToTakeNumberOne)} needed
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPreset(amountToTakeNumberOne)}
                className="px-3 py-1.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                Put {formatRupee(amountToTakeNumberOne)}
              </button>
            </div>

            {/* Quick Amount Presets */}
            <label className="block text-xs font-medium text-[var(--muted-text)] mb-2">
              Select or enter contribution (INR)
            </label>

            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer tabular-nums ${
                    bidAmount === amt
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                      : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)] hover:border-[var(--card-border)]'
                  }`}
                >
                  +{formatRupee(amt)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleSelectPreset(amountToTakeNumberOne)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer tabular-nums ${
                  bidAmount === amountToTakeNumberOne
                    ? 'bg-[#e95325] text-white'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                }`}
                title="Exact amount to claim #1 spot"
              >
                Claim #1
              </button>
            </div>

            {/* Custom Input */}
            <div className="relative flex items-center mb-4">
              <span className="absolute left-3.5 font-bold text-sm text-[var(--muted-text)]">₹</span>
              <input
                type="text"
                value={customAmountInput}
                onChange={handleCustomInputChange}
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-sm font-semibold text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors tabular-nums"
                placeholder="Enter custom amount"
              />
            </div>

            {/* Real-time Calculation */}
            <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[var(--muted-text)] font-normal">
                <span>Current Backing:</span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">{formatRupee(heroCurrentAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--muted-text)] font-normal">
                <span>Projected Total:</span>
                <span className="font-bold text-[var(--foreground)] tabular-nums">{formatRupee(projectedHeroTotal)}</span>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between font-semibold">
                <span className="text-[var(--foreground)]">Resulting Spot:</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[var(--card-bg)] text-[#e95325] tabular-nums border border-[var(--card-border)]">
                  Spot #{projectedRank} {projectedRank < activeBidHero.currentRank ? '↑' : ''}
                </span>
              </div>
            </div>

            {/* Supporter Handle & Cheer Note */}
            <div className="mt-4 space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--foreground)]">
                    Your Fan Name / Handle <span className="text-[#e95325]">*</span>
                  </label>
                  <span className="text-[10px] text-[var(--muted-text)] font-medium">
                    Saved on this device
                  </span>
                </div>
                <input
                  type="text"
                  value={supporterName}
                  onChange={(e) => {
                    setSupporterName(e.target.value);
                    try {
                      localStorage.setItem('bidstar_fan_name', e.target.value);
                    } catch {}
                  }}
                  maxLength={30}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] placeholder-[var(--muted-text)]/50 focus:outline-hidden focus:border-[#e95325] transition-colors"
                  placeholder="e.g. Rahul, SuperFan_Prabhas, BhaijaanArmy"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                  Cheer note (optional)
                </label>
                <input
                  type="text"
                  value={fanNote}
                  onChange={(e) => setFanNote(e.target.value)}
                  maxLength={80}
                  className="w-full px-3.5 py-1.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors"
                  placeholder="e.g. Rampage at the box office!"
                />
              </div>
            </div>

            {/* Dodo Payments Trust Badge */}
            <div className="mt-4 p-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted-text)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Secured by <strong>Dodo Payments</strong> (MoR)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-[10px] text-[var(--foreground)] shrink-0">
                <span className="px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)]">UPI</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)]">Cards</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)]">NetBanking</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Compliance & Consumer Transparency Notice */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] text-[11px] text-[var(--muted-text)] leading-relaxed text-center">
              <span>Voluntary fandom contribution for digital leaderboard rank & 3D collectible card. </span>
              <span className="text-[var(--foreground)] font-medium">Non-refundable upon execution. No monetary prizes or financial returns.</span>
            </div>

            {/* Action Button */}
            <div className="mt-3">
              <button
                onClick={handleConfirmBid}
                disabled={bidAmount < 50 || isProcessing}
                className="w-full py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#e95325]/15"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Connecting to Dodo Checkout...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    Pay {formatRupee(bidAmount)} & Claim Spot #{projectedRank}
                  </span>
                )}
              </button>

              <div className="mt-2 text-center text-[10px] text-[var(--muted-text)]">
                By paying, you agree to bidstar&apos;s <Link href="/terms" target="_blank" className="underline hover:text-[var(--foreground)]">Terms of Service</Link> & <Link href="/disclaimer" target="_blank" className="underline hover:text-[var(--foreground)]">Disclaimer</Link>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
