'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatNumber } from '@/lib/formatters';
import { Industry, Region, Hero } from '@/types';
import { 
  ShieldCheck, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  Check, 
  Film 
} from 'lucide-react';

export default function AdminPage() {
  const { 
    heroes, 
    heroRequests, 
    adminCreateHero, 
    adminToggleHeroActive, 
    adminApproveRequest, 
    platformStats 
  } = useCinebid();

  const [activeTab, setActiveTab] = useState<'heroes' | 'create' | 'requests'>('heroes');

  // Form State
  const [formName, setFormName] = useState('');
  const [formRegion, setFormRegion] = useState<'South' | 'North'>('South');
  const [formIndustry, setFormIndustry] = useState<Industry>('Telugu');
  const [formTitleTag, setFormTitleTag] = useState('');
  const [formBlockbuster, setFormBlockbuster] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formCreatedMessage, setFormCreatedMessage] = useState(false);

  const totalPlatformVolume = heroes.reduce((acc, h) => acc + h.totalBidAmount, 0);
  const totalTodayVolume = heroes.reduce((acc, h) => acc + h.todayBidAmount, 0);
  const totalBidsCount = heroes.reduce((acc, h) => acc + h.totalBidCount, 0);

  const handleCreateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    await adminCreateHero({
      name: formName.trim(),
      displayName: formName.trim(),
      region: formRegion,
      industry: formIndustry,
      titleTag: formTitleTag.trim() || 'Superstar',
      latestBlockbuster: formBlockbuster.trim() || 'Upcoming Feature',
      bio: formBio.trim() || 'Indian cinema stalwart with huge fandom backing.',
      avatarUrl: formAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      coverUrl: formCover.trim() || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200',
    });

    setFormCreatedMessage(true);
    setTimeout(() => {
      setFormCreatedMessage(false);
      setFormName('');
      setFormTitleTag('');
      setFormBlockbuster('');
      setFormBio('');
      setFormAvatar('');
      setFormCover('');
      setActiveTab('heroes');
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--card-border)] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#ff5722]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
              Cinebid Admin Curation Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            Curate canonical hero images, review community hero suggestions, and monitor backend metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Hero</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">Total Backing Volume</div>
          <div className="text-lg sm:text-xl font-black text-[#ff5722] mt-1 tabular-nums">
            {formatRupee(totalPlatformVolume)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">Today&apos;s Volume</div>
          <div className="text-lg sm:text-xl font-black text-emerald-500 mt-1 tabular-nums">
            {formatRupee(totalTodayVolume)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">Active Heroes</div>
          <div className="text-lg sm:text-xl font-black text-[var(--foreground)] mt-1 tabular-nums">
            {heroes.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-text)]">Total Bids Processed</div>
          <div className="text-lg sm:text-xl font-black text-amber-500 mt-1 tabular-nums">
            {formatNumber(totalBidsCount)}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--card-border)] pb-2">
        <button
          onClick={() => setActiveTab('heroes')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'heroes'
              ? 'bg-[#ff5722] text-white shadow-xs'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          Manage Heroes ({heroes.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#ff5722] text-white shadow-xs'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <span>Hero Requests</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--pill-bg)] text-[var(--foreground)]">
            {heroRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-[#ff5722] text-white shadow-xs'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          + Add Hero Form
        </button>
      </div>

      {/* Tab Content: Manage Heroes */}
      {activeTab === 'heroes' && (
        <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
          <div className="divide-y divide-[var(--card-border)]/60">
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--card-hover)] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-black text-[var(--muted-text)] w-6 text-center">
                    #{hero.currentRank}
                  </span>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[var(--card-border)]"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[var(--foreground)]">
                        {hero.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#ff5722]/10 font-bold text-[#ff5722]">
                        {hero.region}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--pill-bg)] font-semibold text-[var(--muted-text)]">
                        {hero.industry}
                      </span>
                      {!hero.active && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold">
                          Archived
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--muted-text)]">
                      {hero.titleTag} • {hero.latestBlockbuster} • Backed: <strong className="text-[#ff5722]">{formatRupee(hero.totalBidAmount)}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => adminToggleHeroActive(hero.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      hero.active
                        ? 'bg-[var(--pill-bg)] text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {hero.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{hero.active ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Add Hero Form */}
      {activeTab === 'create' && (
        <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
          <h2 className="text-lg font-black text-[var(--foreground)] mb-1">
            Publish New Canonical Hero
          </h2>
          <p className="text-xs text-[var(--muted-text)] mb-6">
            Hero data and images are managed directly by Cinebid to maintain platform aesthetic standards.
          </p>

          {formCreatedMessage ? (
            <div className="py-8 text-center text-emerald-500 font-extrabold text-sm">
              ✓ Hero Successfully Published to Cinebid Leaderboard!
            </div>
          ) : (
            <form onSubmit={handleCreateHero} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                    Hero Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nagarjuna"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                    Region *
                  </label>
                  <select
                    value={formRegion}
                    onChange={(e) => {
                      const r = e.target.value as 'South' | 'North';
                      setFormRegion(r);
                      if (r === 'North') setFormIndustry('Hindi');
                      if (r === 'South') setFormIndustry('Telugu');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden"
                  >
                    <option value="South">South Indian Cinema</option>
                    <option value="North">North / Bollywood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                    Film Industry *
                  </label>
                  <select
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value as Industry)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden"
                  >
                    {formRegion === 'South' ? (
                      <>
                        <option value="Telugu">Telugu</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Kannada">Kannada</option>
                      </>
                    ) : (
                      <option value="Hindi">Hindi (Bollywood)</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                    Title / Honorific Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. King, Megastar, Ulaganayagan..."
                    value={formTitleTag}
                    onChange={(e) => setFormTitleTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                    Latest Blockbuster / Film
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kubera / Coolie"
                    value={formBlockbuster}
                    onChange={(e) => setFormBlockbuster(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                  Canonical Avatar Portrait Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                  Cover Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formCover}
                  onChange={(e) => setFormCover(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--muted-text)] uppercase mb-1">
                  Fandom Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of filmography, legacy, and fan following..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold text-xs shadow-md shadow-[#ff5722]/30 transition-all cursor-pointer"
              >
                Create & Publish Hero
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab Content: Hero Requests Queue */}
      {activeTab === 'requests' && (
        <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs divide-y divide-[var(--card-border)]/60">
          {heroRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-[var(--foreground)]">
                    {req.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#ff5722]/10 text-[10px] font-bold text-[#ff5722]">
                    {req.region}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[10px] font-bold text-[var(--muted-text)]">
                    {req.industry}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-[var(--muted-text)] mt-1">
                  Reason: &ldquo;{req.reason}&rdquo;
                </p>

                <div className="text-[10px] text-[var(--muted-text)] mt-1">
                  Requested by @{req.requestedBy} • {req.votesCount} community upvotes
                </div>
              </div>

              {req.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adminApproveRequest(req.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & List</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
