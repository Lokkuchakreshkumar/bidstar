'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { 
  User, 
  Trophy, 
  Award, 
  Zap, 
  Flame, 
  Clock, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile, heroes, bids, openBidModal } = useCinebid();
  const [isEditingHandle, setIsEditingHandle] = React.useState(false);
  const [editHandleInput, setEditHandleInput] = React.useState(user.username);

  React.useEffect(() => {
    setEditHandleInput(user.username);
  }, [user.username]);

  const handleSaveHandle = () => {
    if (editHandleInput.trim()) {
      updateUserProfile({ username: editHandleInput.trim(), displayName: editHandleInput.trim() });
      setIsEditingHandle(false);
    }
  };

  // Find heroes backed by this user
  const userBackedHeroes = heroes
    .map((h) => {
      const userSupporter = h.topSupporters.find((s) => s.username === user.username);
      if (!userSupporter) return null;
      const rankOnHero = h.topSupporters.findIndex((s) => s.username === user.username) + 1;
      return {
        hero: h,
        userContribution: userSupporter,
        rankOnHero,
      };
    })
    .filter(Boolean) as {
      hero: (typeof heroes)[0];
      userContribution: { totalAmount: number; bidCount: number; lastBidAt: string };
      rankOnHero: number;
    }[];

  const userBids = bids.filter((b) => b.username === user.username);
  const totalUserBacked = userBids.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#ff5722] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              {isEditingHandle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={editHandleInput}
                    onChange={(e) => setEditHandleInput(e.target.value)}
                    className="px-3 py-1 text-sm font-bold rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)]"
                    placeholder="Enter handle"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveHandle}
                    className="px-3 py-1 text-xs font-bold rounded-xl bg-[#ff5722] text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingHandle(false)}
                    className="px-2 py-1 text-xs text-[var(--muted-text)]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
                    {user.displayName}
                  </h1>
                  <button
                    onClick={() => setIsEditingHandle(true)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--muted-text)] hover:text-[#ff5722]"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-xs font-semibold text-[var(--muted-text)] mt-0.5">
                @{user.username} • Verified Backer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-right">
              <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Active Fandom Backer</div>
              <div className="text-sm font-black text-[#ff5722] tabular-nums">
                {userBackedHeroes.length} Hero{userBackedHeroes.length === 1 ? '' : 'es'} Backed
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--card-border)]">
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Total Backed</div>
            <div className="text-lg sm:text-xl font-black text-[#ff5722] mt-0.5 tabular-nums">
              {formatRupee(totalUserBacked)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Bids Placed</div>
            <div className="text-lg sm:text-xl font-black text-[var(--foreground)] mt-0.5 tabular-nums">
              {userBids.length}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Heroes Backed</div>
            <div className="text-lg sm:text-xl font-black text-[var(--foreground)] mt-0.5 tabular-nums">
              {userBackedHeroes.length}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--muted-text)]">Fandom Standing</div>
            <div className="text-lg sm:text-xl font-black text-amber-500 mt-0.5 tabular-nums flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {userBids.length > 0 ? 'Active' : 'New Fan'}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-3">
          Fandom Badges & Honours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center gap-3.5"
            >
              <div className="text-2xl">{b.icon}</div>
              <div>
                <h3 className="text-xs font-bold text-[var(--foreground)]">{b.title}</h3>
                <p className="text-[11px] text-[var(--muted-text)] leading-tight mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heroes Supported by this User */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-3">
          My Supported Heroes ({userBackedHeroes.length})
        </h2>

        {userBackedHeroes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userBackedHeroes.map(({ hero, userContribution, rankOnHero }) => (
              <div
                key={hero.id}
                className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col justify-between gap-4 hover:border-[#ff5722]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.avatarUrl}
                      alt={hero.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[var(--card-border)]"
                    />
                    <div>
                      <Link
                        href={`/heroes/${hero.id}`}
                        className="font-extrabold text-sm text-[var(--foreground)] hover:text-[#ff5722] transition-colors"
                      >
                        {hero.name}
                      </Link>
                      <div className="text-xs text-[var(--muted-text)]">
                        Platform Rank: <strong className="text-[#ff5722]">#{hero.currentRank}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                      rankOnHero === 1 ? 'bg-amber-400 text-black' : 'bg-[var(--pill-bg)] text-[var(--muted-text)]'
                    }`}>
                      #{rankOnHero} Supporter
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[var(--muted-text)] font-semibold">Your Total Backing</div>
                    <div className="text-sm font-black text-[#ff5722] tabular-nums">
                      {formatRupee(userContribution.totalAmount)}
                    </div>
                  </div>

                  <button
                    onClick={() => openBidModal(hero)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Fight Back / Top Up</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--muted-text)]">
            You have not backed any heroes yet. Explore the leaderboard and support your superstar!
          </div>
        )}
      </div>

      {/* Transaction / Bids History */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-3">
          My Recent Bid Transactions
        </h2>

        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--card-border)]/50 overflow-hidden">
          {userBids.length > 0 ? (
            userBids.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-[var(--foreground)]">
                      Backed <strong className="text-[#ff5722]">{b.heroName}</strong>
                    </div>
                    <div className="text-[10px] text-[var(--muted-text)]">
                      {formatTimeAgo(b.createdAt)} • Result Rank: #{b.resultRank}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-[var(--foreground)] tabular-nums">
                    {formatRupee(b.amount)}
                  </span>
                  <div className="text-[10px] text-emerald-500 font-semibold">VERIFIED</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[var(--muted-text)]">
              No recent bid transactions recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
