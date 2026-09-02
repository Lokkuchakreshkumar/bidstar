'use client';

import React from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatTimeAgo } from '@/lib/formatters';
import { 
  Trophy, 
  Zap, 
  Check
} from 'lucide-react';

export function ProfilePage() {
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
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-[var(--card-border)] shrink-0 bg-[var(--pill-bg)]">
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
                    className="px-3 py-1 text-sm font-semibold rounded-lg bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)]"
                    placeholder="Enter handle"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveHandle}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#e95325] text-white cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingHandle(false)}
                    className="px-2 py-1 text-xs text-[var(--muted-text)] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                    {user.displayName}
                  </h1>
                  <button
                    onClick={() => setIsEditingHandle(true)}
                    className="text-xs px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--muted-text)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-xs text-[var(--muted-text)] mt-0.5 font-normal">
                @{user.username} • Verified Backer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-right">
              <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Active Fandom Backer</div>
              <div className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                {userBackedHeroes.length} Hero{userBackedHeroes.length === 1 ? '' : 'es'} Backed
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--border-subtle)]">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Total Backed</div>
            <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5 tabular-nums">
              {formatRupee(totalUserBacked)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Bids Placed</div>
            <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5 tabular-nums">
              {userBids.length}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Heroes Backed</div>
            <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5 tabular-nums">
              {userBackedHeroes.length}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--muted-text)]">Fandom Standing</div>
            <div className="text-lg sm:text-xl font-bold text-amber-500 mt-0.5 tabular-nums flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {userBids.length > 0 ? 'Active' : 'New Fan'}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase text-[var(--muted-text)] mb-3">
          Fandom Badges & Honours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center gap-3.5"
            >
              <div className="text-xl">{b.icon}</div>
              <div>
                <h3 className="text-xs font-bold text-[var(--foreground)]">{b.title}</h3>
                <p className="text-xs text-[var(--muted-text)] leading-tight mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heroes Supported by this User */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase text-[var(--muted-text)] mb-3">
          My Supported Heroes ({userBackedHeroes.length})
        </h2>

        {userBackedHeroes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userBackedHeroes.map(({ hero, userContribution, rankOnHero }) => (
              <div
                key={hero.id}
                className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col justify-between gap-4 hover:border-[var(--muted-text)]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.avatarUrl}
                      alt={hero.name}
                      className="w-11 h-11 rounded-xl object-cover border border-[var(--border-subtle)]"
                    />
                    <div>
                      <Link
                        href={`/heroes/${hero.id}`}
                        className="font-bold text-sm text-[var(--foreground)] hover:text-[#e95325] transition-colors"
                      >
                        {hero.name}
                      </Link>
                      <div className="text-xs text-[var(--muted-text)]">
                        Platform Rank: <strong className="text-[var(--foreground)] tabular-nums">#{hero.currentRank}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[var(--foreground)] tabular-nums">
                      #{rankOnHero} Supporter
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[var(--muted-text)] font-medium">Your Total Backing</div>
                    <div className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                      {formatRupee(userContribution.totalAmount)}
                    </div>
                  </div>

                  <button
                    onClick={() => openBidModal(hero)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[#e95325] hover:text-white text-[var(--foreground)] border border-[var(--pill-border)] hover:border-[#e95325] text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Top Up</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--muted-text)]">
            You have not backed any heroes yet. Explore the leaderboard and support your superstar.
          </div>
        )}
      </div>

      {/* Transaction / Bids History */}
      <div>
        <h2 className="text-xs font-semibold uppercase text-[var(--muted-text)] mb-3">
          My Recent Bid Transactions
        </h2>

        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--border-subtle)] overflow-hidden">
          {userBids.length > 0 ? (
            userBids.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">
                      Backed <strong className="text-[var(--foreground)]">{b.heroName}</strong>
                    </div>
                    <div className="text-xs text-[var(--muted-text)] mt-0.5">
                      <span className="tabular-nums">{formatTimeAgo(b.createdAt)}</span> • Result Rank: #{b.resultRank}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[var(--foreground)] tabular-nums">
                    {formatRupee(b.amount)}
                  </span>
                  <div className="text-[10px] text-emerald-500 font-medium">VERIFIED</div>
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

export default ProfilePage;
