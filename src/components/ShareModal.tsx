'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee } from '@/lib/formatters';
import { X, Copy, Check, Share2, Film } from 'lucide-react';

export function ShareModal() {
  const { shareHero, closeShareModal, user } = useCinebid();
  const [copied, setCopied] = useState(false);

  if (!shareHero) return null;

  const shareText = `I just backed ${shareHero.name} on bidstar! Currently Rank #${shareHero.currentRank} with ${formatRupee(shareHero.totalBidAmount)} in fandom backing. Outbid us if you can! #bidstar #${shareHero.name.replace(/\s+/g, '')}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#e95325]" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">Share Hero Rank</h3>
          </div>

          <button
            onClick={closeShareModal}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Share Card */}
        <div className="my-5 p-5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs tracking-tight">
              <Film className="w-3.5 h-3.5 text-[#e95325]" />
              <span>bidstar<span className="text-[#e95325]">.</span></span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e95325] text-white">
              RANK #{shareHero.currentRank}
            </span>
          </div>

          <div className="my-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={shareHero.avatarUrl} 
              alt={shareHero.name} 
              className="w-13 h-13 rounded-xl object-cover border border-[var(--border-subtle)]"
            />
            <div>
              <h4 className="font-bold text-base text-[var(--foreground)] leading-tight">{shareHero.name}</h4>
              <div className="text-xs text-[var(--muted-text)] font-normal">{shareHero.region} Cinema • {shareHero.industry}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] uppercase text-[var(--muted-text)] font-medium">Total Backed</div>
              <div className="text-sm font-bold text-[var(--foreground)] tabular-nums">{formatRupee(shareHero.totalBidAmount)}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase text-[var(--muted-text)] font-medium">Backed By</div>
              <div className="text-xs font-semibold text-[var(--foreground)]">@{user.username}</div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareTwitter}
              className="w-full py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Post on X</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-[var(--foreground)] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
