'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { Industry, Region } from '@/types';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

export function HeroRequestModal() {
  const { isRequestModalOpen, closeRequestModal, requestHero } = useCinebid();

  const [name, setName] = useState('');
  const [region, setRegion] = useState<'South' | 'North'>('South');
  const [industry, setIndustry] = useState<Industry>('Telugu');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isRequestModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await requestHero(name.trim(), region, industry, reason.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setReason('');
      closeRequestModal();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-extrabold text-sm text-[var(--foreground)]">Suggest a New Hero</h3>
          </div>

          <button
            onClick={closeRequestModal}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-[var(--foreground)]">Request Submitted!</h4>
            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Our curators will review and publish {name} to Cinebid.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1.5">
                Hero / Superstar Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nani, Sivakarthikeyan, Dulquer, Kartik Aaryan..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-sm font-semibold text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1.5">
                  Region *
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    const r = e.target.value as 'South' | 'North';
                    setRegion(r);
                    if (r === 'North') setIndustry('Hindi');
                    if (r === 'South') setIndustry('Telugu');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden"
                >
                  <option value="South">🔥 South Indian</option>
                  <option value="North">⭐ North / Bollywood</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1.5">
                  Industry *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] focus:outline-hidden"
                >
                  {region === 'South' ? (
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1.5">
                Reason / Recent Hits (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention recent box office hits or why they should be on Cinebid..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold text-xs tracking-tight shadow-md shadow-[#ff5722]/30 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                Submit Recommendation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
