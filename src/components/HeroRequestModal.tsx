'use client';

import React, { useState } from 'react';
import { useCinebid } from '@/context/CinebidContext';
import { Industry } from '@/types';
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
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#e95325]" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">Suggest a New Hero</h3>
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
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[var(--foreground)]">Request Submitted</h4>
            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Our curators will review and list {name} on bidstar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                Superstar name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nani, Sivakarthikeyan, Dulquer, Kartik Aaryan..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-medium text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-medium text-[var(--foreground)] focus:outline-hidden"
                >
                  <option value="South">South Cinema</option>
                  <option value="North">North Cinema</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                  Industry *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs font-medium text-[var(--foreground)] focus:outline-hidden"
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
              <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                Reason / Recent Hits (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention recent box office hits or why they should be on bidstar..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325]"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white font-semibold text-xs tracking-tight transition-all cursor-pointer"
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
