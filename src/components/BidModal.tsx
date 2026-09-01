'use client';

import React, { useState, useEffect } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { 
  X, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';

export function BidModal() {
  const { 
    activeBidHero, 
    closeBidModal, 
    placeBid, 
    heroes, 
    currentLeader,
    timeWindow,
    openShareModal,
    user 
  } = useCinebid();

  // Leader amount
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

  // Exact amount needed to take #1
  const isAlreadyLeader = activeBidHero?.id === currentLeader?.id;
  const amountToTakeNumberOne = isAlreadyLeader
    ? 10 // Minimum increment to defend
    : Math.max(10, (leaderAmount - heroCurrentAmount) + 10);

  const [bidAmount, setBidAmount] = useState<number>(amountToTakeNumberOne);
  const [customAmountInput, setCustomAmountInput] = useState<string>(amountToTakeNumberOne.toString());
  const [supporterName, setSupporterName] = useState<string>(user.username || 'fan');
  const [fanNote, setFanNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    newRank: number;
    previousRank: number;
    amountPaid: number;
  } | null>(null);

  useEffect(() => {
    if (user?.username) {
      setSupporterName(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (activeBidHero) {
      setBidAmount(amountToTakeNumberOne);
      setCustomAmountInput(amountToTakeNumberOne.toString());
    }
  }, [activeBidHero, amountToTakeNumberOne]);

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
    if (bidAmount < 10) return;
    setIsProcessing(true);

    setTimeout(async () => {
      const res = await placeBid(activeBidHero.id, bidAmount, fanNote, supporterName);
      setIsProcessing(false);
      if (res.success) {
        setSuccessResult({
          newRank: res.newRank,
          previousRank: res.previousRank,
          amountPaid: bidAmount,
        });
      }
    }, 800);
  };

  const handleClose = () => {
    setSuccessResult(null);
    closeBidModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)] bg-[var(--pill-bg)]/40">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeBidHero.avatarUrl} 
              alt={activeBidHero.name} 
              className="w-10 h-10 rounded-xl object-cover border border-[var(--card-border)]"
            />
            <div>
              <h3 className="font-extrabold text-base text-[var(--foreground)] tracking-tight">
                Back {activeBidHero.name}
              </h3>
              <div className="text-xs font-semibold text-[#ff5722]">
                Current Spot #{activeBidHero.currentRank} • {activeBidHero.region} Cinema • {formatRupee(heroCurrentAmount)} backed
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-black text-[var(--foreground)] tracking-tight">
              🎬 Contribution Applied!
            </h4>

            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Backed <strong className="text-[var(--foreground)]">{activeBidHero.name}</strong> with{' '}
              <strong className="text-[#ff5722]">{formatRupee(successResult.amountPaid)}</strong>.
            </p>

            {/* Rank Change Card */}
            <div className="my-5 p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] flex items-center justify-around">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Previous Spot</div>
                <div className="text-lg font-extrabold text-[var(--muted-text)]">#{successResult.previousRank}</div>
              </div>

              <div className="text-[#ff5722] font-black text-xl">→</div>

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-500">New Spot</div>
                <div className="text-2xl font-black text-emerald-500 flex items-center gap-1 justify-center">
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
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Spot Card</span>
              </button>

              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] text-[var(--foreground)] border border-[var(--pill-border)] text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            
            {/* 1. Take #1 Callout Box */}
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#ff5722]/15 via-[#ff5722]/10 to-transparent border border-[#ff5722]/30 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#ff5722] flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Amount to take #1 spot:</span>
                </div>
                <div className="text-sm sm:text-base font-black text-[var(--foreground)] mt-0.5">
                  {formatRupee(amountToTakeNumberOne)} needed
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPreset(amountToTakeNumberOne)}
                className="px-3 py-1.5 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                Put {formatRupee(amountToTakeNumberOne)} for #1
              </button>
            </div>

            {/* Quick Amount Presets */}
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-2">
              Select or Enter Contribution (INR)
            </label>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bidAmount === amt
                      ? 'bg-[#ff5722] text-white shadow-sm shadow-[#ff5722]/30 scale-[1.02]'
                      : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)] hover:border-[var(--muted-text)]'
                  }`}
                >
                  +{formatRupee(amt)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleSelectPreset(amountToTakeNumberOne)}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  bidAmount === amountToTakeNumberOne
                    ? 'bg-[#ff5722] text-white shadow-sm scale-[1.02]'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                }`}
                title="Exact amount to take #1 spot"
              >
                Take #1
              </button>
            </div>

            {/* Custom Input */}
            <div className="relative flex items-center mb-4">
              <span className="absolute left-4 font-black text-lg text-[var(--muted-text)]">₹</span>
              <input
                type="text"
                value={customAmountInput}
                onChange={handleCustomInputChange}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-base font-black text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors tabular-nums"
                placeholder="Enter custom amount"
              />
            </div>

            {/* Real-time Calculation Card */}
            <div className="p-3.5 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[var(--muted-text)] font-medium">
                <span>Current Backing:</span>
                <span className="font-bold text-[var(--foreground)] tabular-nums">{formatRupee(heroCurrentAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--muted-text)] font-medium">
                <span>Projected Backing:</span>
                <span className="font-bold text-[#ff5722] tabular-nums">{formatRupee(projectedHeroTotal)}</span>
              </div>

              <div className="pt-2 border-t border-[var(--pill-border)] flex items-center justify-between font-bold">
                <span className="flex items-center gap-1 text-[var(--foreground)]">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Resulting Spot:
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                  projectedRank === 1 ? 'bg-amber-400 text-black animate-pulse' : 'bg-[var(--card-bg)] text-[#ff5722]'
                }`}>
                  Spot #{projectedRank} {projectedRank < activeBidHero.currentRank ? '↑' : ''}
                </span>
              </div>

              {projectedRank === 1 && (
                <div className="pt-1 text-[11px] text-amber-500 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  This contribution locks the #1 spot for {activeBidHero.name}!
                </div>
              )}
            </div>

            {/* Supporter Handle & Cheer Note */}
            <div className="mt-4 space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                  Your Supporter Handle / Fan Name
                </label>
                <input
                  type="text"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-bold text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors"
                  placeholder="e.g. chakresh, mega_fan, darling_diehard"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                  Fan Shoutout / Cheer Note (Optional)
                </label>
                <input
                  type="text"
                  value={fanNote}
                  onChange={(e) => setFanNote(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors"
                  placeholder="e.g. Rebel Star box office rampage! 💥"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: ShieldCheck },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as 'upi' | 'card' | 'netbanking')}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[var(--card-hover)] border-2 border-[#ff5722] text-[var(--foreground)]'
                          : 'bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5">
              <button
                onClick={handleConfirmBid}
                disabled={bidAmount < 10 || isProcessing}
                className="w-full py-3 rounded-2xl bg-[#ff5722] hover:bg-[#f4511e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm tracking-tight shadow-lg shadow-[#ff5722]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing Contribution...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    Pay {formatRupee(bidAmount)} & Claim Spot #{projectedRank}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
