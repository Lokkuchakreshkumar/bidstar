'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Trophy, Shield, HelpCircle, PlusCircle, Activity } from 'lucide-react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupeeCompact } from '@/lib/formatters';

export function Footer() {
  const { heroes, openRequestModal } = useCinebid();
  const totalBacked = heroes.reduce((acc, h) => acc + h.totalBidAmount, 0);

  return (
    <footer className="w-full border-t border-[var(--card-border)] bg-[var(--card-bg)]/50 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-black text-lg text-[var(--foreground)]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ff5722] to-[#ff8a65] flex items-center justify-center text-white">
                <Film className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="tracking-tight">cinebid<span className="text-[#ff5722]">.lol</span></span>
            </Link>

            <p className="text-xs text-[var(--muted-text)] max-w-sm leading-relaxed">
              The live financial battleground for Indian cinema fandom. Back your favourite hero, fight for #1 position, and outbid rival fandoms in real-time.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-text)] pt-1">
              <span>{heroes.length} Active Heroes</span>
              <span>•</span>
              <span className="text-[#ff5722]">{formatRupeeCompact(totalBacked)} Total Backed</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-[var(--foreground)]">Explore</h4>
            <ul className="space-y-1.5 font-medium text-[var(--muted-text)]">
              <li><Link href="/" className="hover:text-[var(--foreground)] transition-colors">Live Leaderboard</Link></li>
              <li><Link href="/heroes" className="hover:text-[var(--foreground)] transition-colors">Discover Heroes</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[var(--foreground)] transition-colors">Supporter Rankings</Link></li>
              <li><Link href="/activity" className="hover:text-[var(--foreground)] transition-colors">Live Activity Stream</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-[var(--foreground)]">Platform</h4>
            <ul className="space-y-1.5 font-medium text-[var(--muted-text)]">
              <li><Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">How It Works</Link></li>
              <li><Link href="/rules" className="hover:text-[var(--foreground)] transition-colors">Platform Mechanics</Link></li>
              <li>
                <button 
                  onClick={openRequestModal}
                  className="hover:text-[var(--foreground)] transition-colors text-left cursor-pointer"
                >
                  Suggest a Hero
                </button>
              </li>
              <li><Link href="/admin" className="hover:text-[var(--foreground)] transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal & Policies Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-[var(--foreground)]">Legal & Help</h4>
            <ul className="space-y-1.5 font-medium text-[var(--muted-text)]">
              <li><Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[var(--foreground)] transition-colors">Cancellation & Refund</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[var(--foreground)] transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--foreground)] transition-colors text-[#ff5722] font-bold">Contact Customer Desk</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--muted-text)]">
          <p>© {new Date().getFullYear()} Cinebid. All rights reserved. Indian cinema fandom ranking platform.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link>
            <Link href="/contact" className="hover:underline">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
