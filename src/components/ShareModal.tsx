'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatNumber } from '@/lib/formatters';
import { X, Copy, Check, Share2, Film, Sparkles } from 'lucide-react';

export function ShareModal() {
  const { shareHero, closeShareModal, user } = useCinebid();
  const [copied, setCopied] = useState(false);

  if (!shareHero) return null;

  const shareText = `I just backed ${shareHero.name} on Cinebid! Currently Rank #${shareHero.currentRank} with ${formatRupee(shareHero.totalBidAmount)} in fandom backing. Outbid us if you can! 🔥 #Cinebid #${shareHero.name.replace(/\s+/g, '')}`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/heroes/${shareHero.id}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-extrabold text-sm text-[var(--foreground)]">Share Hero Rank</h3>
          </div>

          <button
            onClick={closeShareModal}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Share Card */}
        <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-[#1c1815] to-[#0a0807] border border-[#ff5722]/30 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5722]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-extrabold text-xs tracking-tighter">
              <Film className="w-3.5 h-3.5 text-[#ff5722]" />
              <span>CINEBID<span className="text-[#ff5722]">.LOL</span></span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ff5722] text-white">
              RANK #{shareHero.currentRank}
            </span>
          </div>

          <div className="my-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={shareHero.avatarUrl} 
              alt={shareHero.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div>
              <h4 className="font-black text-lg text-white leading-tight">{shareHero.name}</h4>
              <div className="text-xs text-amber-400 font-semibold">{shareHero.titleTag}</div>
              <div className="text-[10px] text-zinc-400">{shareHero.latestBlockbuster}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Total Fandom Backed</div>
              <div className="text-base font-black text-amber-400 tabular-nums">{formatRupee(shareHero.totalBidAmount)}</div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Backed By</div>
              <div className="text-xs font-bold text-white">@{user.username}</div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareTwitter}
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-800"
            >
              <span>Post on X</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-[var(--foreground)] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
