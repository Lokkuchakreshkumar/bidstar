'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';

export function Footer() {
  const { heroes, openRequestModal } = useCinebid();

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--background)] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-[var(--foreground)]">
              <div className="flex flex-col gap-1 w-4 justify-center">
                <span className="w-full h-0.5 bg-[#e95325] rounded-full"></span>
                <span className="w-3/4 h-0.5 bg-[#e95325] rounded-full"></span>
              </div>
              <span className="tracking-tight">bidstar<span className="text-[#e95325]">.</span></span>
            </Link>

            <p className="text-xs text-[var(--muted-text)] max-w-sm leading-relaxed">
              The live financial battleground for Indian cinema fandom. Back your favourite hero, fight for #1 position, and outbid rival fandoms in real-time.
            </p>

            <div className="flex items-center gap-2 text-xs text-[var(--muted-text)] pt-1">
              <span className="tabular-nums">{heroes.length} Active Superstars Listed</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[var(--foreground)]">Explore</h4>
            <ul className="space-y-1.5 text-[var(--muted-text)]">
              <li><Link href="/" className="hover:text-[var(--foreground)] transition-colors">Live Leaderboard</Link></li>
              <li><Link href="/heroes" className="hover:text-[var(--foreground)] transition-colors">Discover Heroes</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[var(--foreground)] transition-colors">Standings & Spots</Link></li>
              <li><Link href="/activity" className="hover:text-[var(--foreground)] transition-colors">Live Activity</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[var(--foreground)]">Platform</h4>
            <ul className="space-y-1.5 text-[var(--muted-text)]">
              <li><Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">How It Works</Link></li>
              <li><Link href="/rules" className="hover:text-[var(--foreground)] transition-colors">Platform Rules</Link></li>
              <li>
                <button 
                  onClick={openRequestModal}
                  className="hover:text-[var(--foreground)] transition-colors text-left cursor-pointer"
                >
                  Suggest a Hero
                </button>
              </li>
              <li><Link href="/bidstaradmin" className="hover:text-[var(--foreground)] transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal & Policies Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[var(--foreground)]">Legal & Trust</h4>
            <ul className="space-y-1.5 text-[var(--muted-text)]">
              <li><Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-[var(--foreground)] transition-colors font-medium text-[#e95325]">Legal Disclaimer & IP</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[var(--foreground)] transition-colors">Cancellation & Refunds</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[var(--foreground)] transition-colors">Digital Delivery SLA</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Grievance & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Prominent Legal Disclaimer Banner */}
        <div className="my-6 p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] text-[11px] text-[var(--muted-text)] leading-relaxed space-y-1.5">
          <p>
            <strong className="text-[var(--foreground)]">Legal Disclaimer:</strong> bidstar is an independent, community-driven fan tribute and entertainment platform. It is strictly NOT affiliated with, authorized by, sponsored by, or endorsed by any actor, director, producer, celebrity estate, or film production studio. Names, likenesses, and cultural references are used solely for descriptive, cultural commentary, and fandom recognition purposes. All funds represent voluntary digital entertainment platform fees; zero funds are collected on behalf of or transferred to depicted individuals.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Strict Non-Gambling Declaration:</strong> bidstar is not a gambling, betting, lottery, sweepstakes, or prize competition service. Zero monetary returns, dividends, prizes, or tangible assets are awarded. Contributions are final and non-refundable upon digital fulfillment. For rights takedowns or grievances, contact <span className="font-mono text-[var(--foreground)]">grievance@bidstar.in</span>.
          </p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-text)]">
          <p>© {new Date().getFullYear()} bidstar. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            <Link href="/refund-policy" className="hover:underline">Refunds</Link>
            <Link href="/shipping-policy" className="hover:underline">Digital Delivery</Link>
            <Link href="/contact" className="hover:underline">Grievance Desk</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
