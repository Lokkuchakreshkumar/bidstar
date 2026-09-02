'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCinebid } from '@/context/CinebidContext';
import { formatRupee, formatNumber, formatTimeAgo } from '@/lib/formatters';
import { Industry } from '@/types';
import { 
  PlusCircle, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Database,
  Film,
  Lock,
  Unlock,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  History,
  DollarSign,
  Flame,
  LogOut,
  ArrowLeft,
  Key
} from 'lucide-react';

export default function BidstarAdminPage() {
  const { 
    heroes, 
    heroRequests, 
    adminCreateHero, 
    adminToggleHeroActive, 
    adminApproveRequest,
    adminRejectRequest,
    adminResetData,
    adminUpdateInitialPush,
    adminFinancials,
    adminAdjustments,
    adminPayments,
    refreshFinancials,
    refreshData,
  } = useCinebid();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [savedAdminPassword, setSavedAdminPassword] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'push' | 'requests' | 'heroes' | 'create' | 'audit' | 'payments' | 'database'>('push');

  // Admin Action Lock State (controls inside dashboard)
  const [isLocked, setIsLocked] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [adminPassphrase, setAdminPassphrase] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isVerifyingUnlock, setIsVerifyingUnlock] = useState(false);

  // Initial Push Edit State per hero (heroId -> input string)
  const [pushInputs, setPushInputs] = useState<Record<string, string>>({});
  const [savingPushId, setSavingPushId] = useState<string | null>(null);
  const [pushSuccessId, setPushSuccessId] = useState<string | null>(null);
  const [pushErrorId, setPushErrorId] = useState<{ id: string; msg: string } | null>(null);

  // Hero Creation Form State
  const [formName, setFormName] = useState('');
  const [formRegion, setFormRegion] = useState<'South' | 'North'>('South');
  const [formIndustry, setFormIndustry] = useState<Industry>('Telugu');
  const [formTitleTag, setFormTitleTag] = useState('');
  const [formBlockbuster, setFormBlockbuster] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formInitialPush, setFormInitialPush] = useState('0');
  const [formCreatedMessage, setFormCreatedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset Confirmation State
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Set current time for staleness checking without impure renders
  useEffect(() => {
    setCurrentTime(Date.now());
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        if (res.ok) {
          const json = await res.json();
          if (json.data?.authenticated) {
            setIsAuthenticated(true);
            refreshFinancials();
          }
        }
      } catch (err) {
        console.error('Failed to verify admin authentication session:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [refreshFinancials]);

  // Sync hero inputs with live push values
  useEffect(() => {
    const initialMap: Record<string, string> = {};
    heroes.forEach((h) => {
      initialMap[h.id] = String(h.initialPushAmount || 0);
    });
    setPushInputs(initialMap);
  }, [heroes]);

  const pendingRequestsCount = heroRequests.filter((r) => r.status === 'PENDING').length;

  // Handle Route Access Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword.trim() }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSavedAdminPassword(loginPassword.trim());
        setIsAuthenticated(true);
        setLoginPassword('');
        await refreshData();
        await refreshFinancials();
      } else {
        setLoginError(json.error?.message || json.fallback || 'Incorrect administrator password');
      }
    } catch {
      setLoginError('Authentication service unavailable. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign Out / Lock
  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setIsAuthenticated(false);
      setSavedAdminPassword('');
      setIsLocked(true);
    }
  };

  // Handle Unlocking Promotional Push Controls via DB verification
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassphrase.trim() || isVerifyingUnlock) return;

    setIsVerifyingUnlock(true);
    setUnlockError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassphrase.trim(), action: 'verify' }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSavedAdminPassword(adminPassphrase.trim());
        setIsLocked(false);
        setShowUnlockModal(false);
        setAdminPassphrase('');
        setUnlockError('');
      } else {
        setUnlockError(json.error?.message || json.fallback || 'Incorrect password. Access denied.');
      }
    } catch {
      setUnlockError('Verification request failed. Please check connection.');
    } finally {
      setIsVerifyingUnlock(false);
    }
  };

  const handleSavePush = async (heroId: string, customAmount?: number) => {
    if (isLocked) {
      setShowUnlockModal(true);
      return;
    }

    const hero = heroes.find((h) => h.id === heroId);
    if (!hero) return;

    const amountToSet = customAmount !== undefined ? customAmount : Number(pushInputs[heroId] || 0);
    if (isNaN(amountToSet) || amountToSet < 0) {
      setPushErrorId({ id: heroId, msg: 'Please enter a valid positive number' });
      return;
    }

    setSavingPushId(heroId);
    setPushErrorId(null);

    const res = await adminUpdateInitialPush(
      heroId, 
      amountToSet, 
      `Admin promotional push adjustment for ${hero.name}`,
      savedAdminPassword
    );

    setSavingPushId(null);

    if (res.success) {
      setPushInputs((prev) => ({ ...prev, [heroId]: String(amountToSet) }));
      setPushSuccessId(heroId);
      setTimeout(() => setPushSuccessId(null), 2000);
    } else {
      setPushErrorId({ id: heroId, msg: res.message || 'Failed to update' });
    }
  };

  const handleCreateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const initialPushNum = Math.max(0, Number(formInitialPush) || 0);
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
        initialPushAmount: initialPushNum,
        totalBidAmount: initialPushNum,
        todayBidAmount: initialPushNum,
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
        setFormInitialPush('0');
        setActiveTab('push');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await adminResetData();
      await refreshFinancials();
      setShowResetConfirm(false);
      setResetSuccessMessage(true);
      setTimeout(() => {
        setResetSuccessMessage(false);
      }, 3000);
    } finally {
      setIsResetting(false);
    }
  };

  // -------------------------------------------------------------
  // 1. Loading State
  // -------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-xs text-[var(--muted-text)]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#e95325]" />
          <span>Verifying administrator privileges...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Unauthenticated Admin Password Gate
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#e95325]/10 border border-[#e95325]/30 text-[#e95325] flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Admin Access Gate
            </h1>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed max-w-sm mx-auto">
              Restricted platform console. Please enter the master password saved in database to proceed.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter admin password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)]/50 focus:outline-hidden focus:border-[#e95325] transition-colors"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying with Database...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticate & Enter Console</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Platform</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. Authenticated Admin Dashboard
  // -------------------------------------------------------------
  const totalRealPayments = adminFinancials?.totalRealPayments ?? 0;
  const totalPromoPush = adminFinancials?.totalPromoPush ?? heroes.reduce((acc, h) => acc + (h.initialPushAmount || 0), 0);
  const totalDisplayVolume = totalRealPayments + totalPromoPush;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. Admin Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-text)] mb-1">
            <span>Admin Console</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">Platform Operations</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
              Platform Administration
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Authenticated • MongoDB Atlas Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1 max-w-2xl leading-relaxed">
            Manage promotional initial push baselines, track real fan payments via Dodo, monitor audit logs, and curate superstar rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Action Lock Toggle */}
          <button
            onClick={() => {
              if (isLocked) {
                setShowUnlockModal(true);
              } else {
                setIsLocked(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLocked
                ? 'bg-[var(--pill-bg)] text-[var(--muted-text)] border-[var(--card-border)] hover:text-[var(--foreground)]'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title={isLocked ? "Controls are locked to prevent accidental edits" : "Controls are unlocked for editing"}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isLocked ? 'Controls: Locked' : 'Controls: Unlocked'}</span>
          </button>

          <button
            onClick={async () => {
              await refreshData();
              await refreshFinancials();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all cursor-pointer"
            title="Refresh database state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Hero</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-xs font-semibold text-[var(--muted-text)] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            title="Sign out of admin console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Exit</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Real Fan Payments */}
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-emerald-500/30 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-emerald-400 tracking-wider">
              Real Payments (Dodo)
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1.5 tabular-nums tracking-tight">
            {formatRupee(totalRealPayments)}
          </div>
          <div className="text-[11px] text-[var(--muted-text)] mt-1">
            Real fan money collected
          </div>
        </div>

        {/* Promotional Initial Push */}
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[#e95325]/30 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#e95325]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#e95325] tracking-wider">
              Initial Push (Promo)
            </span>
            <Flame className="w-3.5 h-3.5 text-[#e95325]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#e95325] mt-1.5 tabular-nums tracking-tight">
            {formatRupee(totalPromoPush)}
          </div>
          <div className="text-[11px] text-[var(--muted-text)] mt-1">
            Admin seeded baseline
          </div>
        </div>

        {/* Public Display Volume */}
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[var(--muted-text)] tracking-wider">
              Public Display Volume
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--muted-text)]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1.5 tabular-nums tracking-tight">
            {formatRupee(totalDisplayVolume)}
          </div>
          <div className="text-[11px] text-[var(--muted-text)] mt-1">
            Visible total (Real + Promo)
          </div>
        </div>

        {/* Superstars Count */}
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[var(--muted-text)] tracking-wider">
              Active Superstars
            </span>
            <Film className="w-3.5 h-3.5 text-[var(--muted-text)]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1.5 tabular-nums tracking-tight">
            {heroes.length}
          </div>
          <div className="text-[11px] text-[var(--muted-text)] mt-1">
            {heroes.filter(h => h.active).length} active • {heroes.filter(h => !h.active).length} hidden
          </div>
        </div>
      </div>

      {/* Action Lock Mode Notice */}
      {isLocked ? (
        <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] flex items-center justify-between gap-3 text-xs text-[var(--muted-text)]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Safe Protection Mode Active:</strong> Promotional adjustments are locked against accidental changes. Unlock controls to edit baselines.
            </span>
          </div>
          <button
            onClick={() => setShowUnlockModal(true)}
            className="text-xs font-semibold text-amber-400 hover:underline shrink-0 cursor-pointer"
          >
            Unlock Now →
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-400">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Edit Mode Unlocked:</strong> Any initial push adjustments will update live rankings and website numbers immediately.
            </span>
          </div>
          <button
            onClick={() => setIsLocked(true)}
            className="text-xs font-bold text-amber-400 hover:underline shrink-0 cursor-pointer"
          >
            Lock Controls
          </button>
        </div>
      )}

      {resetSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>Database successfully cleared and reseeded starting at clean ₹0 baseline!</span>
        </div>
      )}

      {/* 3. Vercel Segmented Navigation */}
      <div className="inline-flex p-1 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] gap-1 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('push')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'push'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#e95325]" />
          <span>Initial Push Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'requests'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Suggestions</span>
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#e95325] text-white font-bold tabular-nums">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('heroes')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'heroes'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Catalog ({heroes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Logs ({adminAdjustments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'payments'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Real Transactions ({adminPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'create'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'database'
              ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs border border-[var(--border-subtle)]'
              : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database Baseline</span>
        </button>
      </div>

      {/* ==================== TAB 1: INITIAL PUSH MANAGER ==================== */}
      {activeTab === 'push' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>Promotional Initial Push Manager</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e95325]/10 text-[#e95325] border border-[#e95325]/20">
                  Cold-Start Accelerator
                </span>
              </h2>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                Set baseline seed amounts for each superstar. On the public site, fans see the combined total to jumpstart engagement.
              </p>
            </div>
            <div className="text-xs text-[var(--muted-text)]">
              {isLocked ? (
                <span className="text-amber-500 font-medium flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Unlock with DB password to edit
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Edit controls verified & enabled
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/40 text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">Rank</th>
                  <th className="py-3 px-4">Superstar</th>
                  <th className="py-3 px-4 text-right">Real Paid (Dodo)</th>
                  <th className="py-3 px-4 text-center">Initial Push (Promo)</th>
                  <th className="py-3 px-4 text-right">Public Display Total</th>
                  <th className="py-3 px-4 text-right">Adjust & Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                {heroes.map((hero) => {
                  const realAmt = hero.realPaidAmount || 0;
                  const currentPush = hero.initialPushAmount || 0;
                  const displayTotal = hero.totalBidAmount;
                  const inputVal = pushInputs[hero.id] ?? String(currentPush);
                  const isSaving = savingPushId === hero.id;
                  const isSuccess = pushSuccessId === hero.id;
                  const hasError = pushErrorId?.id === hero.id;

                  return (
                    <tr key={hero.id} className="hover:bg-[var(--card-hover)] transition-colors">
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-bold text-[var(--muted-text)] tabular-nums">
                        #{hero.currentRank}
                      </td>

                      {/* Superstar Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={hero.avatarUrl}
                            alt={hero.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[var(--card-border)] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                              <Link href={`/heroes/${hero.id}`} className="hover:underline hover:text-[#e95325]">
                                {hero.name}
                              </Link>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--muted-text)] font-normal border border-[var(--pill-border)]">
                                {hero.titleTag}
                              </span>
                            </div>
                            <div className="text-[11px] text-[var(--muted-text)]">
                              {hero.region} • {hero.industry} Cinema
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Real Fan Payments */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <div className="font-bold text-emerald-400">
                          {formatRupee(realAmt)}
                        </div>
                        <div className="text-[10px] text-[var(--muted-text)]">
                          {hero.totalBidCount} fan bids
                        </div>
                      </td>

                      {/* Initial Push (Promo) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e95325]/10 border border-[#e95325]/30 text-[#e95325] font-bold tabular-nums">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{formatRupee(currentPush)}</span>
                        </div>
                      </td>

                      {/* Public Display Total */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <div className="font-extrabold text-[var(--foreground)] text-sm">
                          {formatRupee(displayTotal)}
                        </div>
                        <div className="text-[10px] text-[var(--muted-text)]">
                          {formatRupee(realAmt)} + {formatRupee(currentPush)}
                        </div>
                      </td>

                      {/* Controls & Quick Presets */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5">
                            {/* Input Field */}
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)]">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="50"
                                disabled={isLocked || isSaving}
                                value={inputVal}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPushInputs((prev) => ({ ...prev, [hero.id]: val }));
                                }}
                                className={`w-28 pl-6 pr-2 py-1 rounded-lg border text-xs font-semibold tabular-nums focus:outline-hidden transition-colors ${
                                  isLocked 
                                    ? 'bg-[var(--pill-bg)] text-[var(--muted-text)] border-[var(--border-subtle)] cursor-not-allowed opacity-75'
                                    : 'bg-[var(--card-bg)] text-[var(--foreground)] border-[var(--card-border)] focus:border-[#e95325]'
                                }`}
                              />
                            </div>

                            {/* Save Button */}
                            <button
                              onClick={() => handleSavePush(hero.id)}
                              disabled={isLocked || isSaving}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                isSuccess
                                  ? 'bg-emerald-500 text-white'
                                  : isLocked
                                  ? 'bg-[var(--pill-bg)] text-[var(--muted-text)] border border-[var(--border-subtle)] cursor-not-allowed'
                                  : 'bg-[#e95325] hover:bg-[#d84417] text-white shadow-xs'
                              }`}
                            >
                              {isSaving ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : isSuccess ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <span>Save</span>
                              )}
                            </button>
                          </div>

                          {/* Quick Presets */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-[var(--muted-text)] mr-0.5">Quick:</span>
                            {[
                              { label: '+50', val: currentPush + 50 },
                              { label: '+100', val: currentPush + 100 },
                              { label: '+500', val: currentPush + 500 },
                              { label: '+600', val: 600 },
                              { label: '+1000', val: currentPush + 1000 },
                              { label: 'Reset 0', val: 0 },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                disabled={isLocked || isSaving}
                                onClick={() => {
                                  setPushInputs((prev) => ({ ...prev, [hero.id]: String(preset.val) }));
                                  handleSavePush(hero.id, preset.val);
                                }}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                                  isLocked
                                    ? 'opacity-50 cursor-not-allowed bg-[var(--pill-bg)] text-[var(--muted-text)]'
                                    : 'bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] text-[var(--foreground)] border border-[var(--pill-border)] cursor-pointer'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          {hasError && (
                            <span className="text-[10px] text-red-400 font-semibold">
                              {pushErrorId?.msg}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: AUDIT LOGS ==================== */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                <span>Promotional Push Audit Log</span>
              </h2>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                Immutable ledger of all initial push adjustments made by administrators.
              </p>
            </div>
            <button
              onClick={() => refreshFinancials()}
              className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Logs</span>
            </button>
          </div>

          {adminAdjustments.length === 0 ? (
            <div className="p-10 text-center text-xs text-[var(--muted-text)]">
              No promotional adjustments recorded yet. Adjust an initial push above to create the first audit record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/40 text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Superstar</th>
                    <th className="py-3 px-4 text-right">Previous Push</th>
                    <th className="py-3 px-4 text-center">Delta</th>
                    <th className="py-3 px-4 text-right">New Push</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {adminAdjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-[var(--card-hover)] transition-colors">
                      <td className="py-3 px-4 text-[var(--muted-text)] tabular-nums">
                        <div>{formatTimeAgo(adj.createdAt)}</div>
                        <div className="text-[10px] opacity-75">{new Date(adj.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[var(--foreground)]">
                        {adj.heroName}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-[var(--muted-text)]">
                        {formatRupee(adj.previousPushAmount)}
                      </td>
                      <td className="py-3 px-4 text-center tabular-nums">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          adj.delta >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {adj.delta >= 0 ? `+${formatRupee(adj.delta)}` : `-${formatRupee(Math.abs(adj.delta))}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-[var(--foreground)]">
                        {formatRupee(adj.newPushAmount)}
                      </td>
                      <td className="py-3 px-4 text-[var(--muted-text)] max-w-xs truncate">
                        {adj.reason || 'Admin push adjustment'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: REAL TRANSACTIONS ==================== */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Real Payments Stream (Dodo Payments)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
                  {adminPayments.filter(p => p.status === 'PAID').length} Paid • ₹{formatNumber(adminFinancials?.totalRealPayments || 0)} Total
                </span>
              </h2>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                Real customer transactions processed through Dodo Payments gateways.
              </p>
            </div>
            <button
              onClick={() => refreshFinancials()}
              className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Payments</span>
            </button>
          </div>

          {adminPayments.length === 0 ? (
            <div className="p-10 text-center text-xs text-[var(--muted-text)]">
              No real payments recorded in database yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/40 text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Superstar</th>
                    <th className="py-3 px-4">Fan</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Payment & Session Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {adminPayments.map((p) => {
                    const isPaid = p.status === 'PAID';
                    const isStalePending = !isPaid && currentTime > 0 && (currentTime - new Date(p.createdAt).getTime() > 30 * 60 * 1000);

                    return (
                      <tr key={p.sessionId} className="hover:bg-[var(--card-hover)] transition-colors">
                        <td className="py-3.5 px-4 text-[var(--muted-text)] tabular-nums">
                          <div>{formatTimeAgo(p.fulfilledAt || p.createdAt)}</div>
                          <div className="text-[10px] opacity-75">{new Date(p.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[var(--foreground)]">{p.heroName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--muted-text)]">
                          <div className="font-semibold text-[var(--foreground)]">@{p.username}</div>
                          {p.customerEmail && (
                            <div className="text-[10px] text-[var(--muted-text)]">{p.customerEmail}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold tabular-nums text-emerald-400 text-sm">
                          {formatRupee(p.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isStalePending
                              ? 'bg-[var(--pill-bg)] text-[var(--muted-text)] border border-[var(--pill-border)]'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {isPaid && <Check className="w-3 h-3" />}
                            <span>{isPaid ? 'PAID' : isStalePending ? 'ABANDONED' : 'PENDING'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px]">
                          {p.paymentId ? (
                            <div className="space-y-0.5">
                              <div className="font-mono font-semibold text-emerald-400 text-[11px]">
                                {p.paymentId}
                              </div>
                              <div className="font-mono text-[10px] text-[var(--muted-text)] truncate max-w-xs">
                                Session: {p.sessionId}
                              </div>
                            </div>
                          ) : (
                            <div className="font-mono text-[10px] text-[var(--muted-text)] truncate max-w-xs">
                              {p.sessionId}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: FAN SUGGESTIONS ==================== */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
              Community Hero Suggestions
            </h2>
            <span className="text-xs text-[var(--muted-text)]">
              Suggestions submitted by fans via the homepage &ldquo;Suggest Heroes&rdquo; section.
            </span>
          </div>

          {heroRequests.length === 0 ? (
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-12 text-center">
              <Sparkles className="w-8 h-8 text-[var(--muted-text)] mx-auto mb-3 opacity-40" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">No Hero Suggestions Yet</h3>
              <p className="text-xs text-[var(--muted-text)] mt-1">
                Fans can suggest new stars from the home page &ldquo;Suggest Heroes&rdquo; module.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs divide-y divide-[var(--border-subtle)]">
              {heroRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--card-hover)] transition-colors"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-[var(--foreground)]">
                        {req.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--pill-bg)] text-[var(--muted-text)] border border-[var(--pill-border)]">
                        {req.region} • {req.industry} Cinema
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : req.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {req.reason && (
                      <p className="text-xs text-[var(--muted-text)] leading-relaxed italic">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                    )}

                    <div className="text-[11px] text-[var(--muted-text)] flex items-center gap-2">
                      <span>Suggested by <strong>@{req.requestedBy}</strong></span>
                      <span>•</span>
                      <span className="tabular-nums">{formatTimeAgo(req.requestedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => adminApproveRequest(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & List (₹0)</span>
                        </button>

                        <button
                          onClick={() => adminRejectRequest(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-[var(--pill-bg)] hover:bg-red-500/10 text-[var(--muted-text)] hover:text-red-400 border border-[var(--pill-border)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--muted-text)] italic">
                        Resolution completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 5: CATALOG (HEROES) ==================== */}
      {activeTab === 'heroes' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)]">
                Superstar Roster ({heroes.length})
              </h2>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                Active catalog synced with MongoDB Atlas. Toggle visibility or view live profiles.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--pill-bg)]/40 text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Superstar</th>
                  <th className="py-3 px-4">Cinema Industry</th>
                  <th className="py-3 px-4 text-right">Backing Volume</th>
                  <th className="py-3 px-4 text-right">Backers</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                {heroes.map((hero) => (
                  <tr key={hero.id} className="hover:bg-[var(--card-hover)] transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-[var(--muted-text)] tabular-nums">
                      #{hero.currentRank}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hero.avatarUrl}
                          alt={hero.name}
                          className="w-9 h-9 rounded-xl object-cover border border-[var(--card-border)] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                            <Link href={`/heroes/${hero.id}`} className="hover:underline hover:text-[#e95325]">
                              {hero.name}
                            </Link>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--muted-text)] font-normal border border-[var(--pill-border)]">
                              {hero.titleTag}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--muted-text)]">
                            {hero.latestBlockbuster}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-text)]">
                      <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--pill-border)] text-[11px]">
                        {hero.region} • {hero.industry}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[var(--foreground)] tabular-nums">
                      {formatRupee(hero.totalBidAmount)}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--muted-text)] tabular-nums">
                      {formatNumber(hero.totalBidCount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        hero.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {hero.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => adminToggleHeroActive(hero.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                          hero.active
                            ? 'bg-[var(--pill-bg)] text-[var(--muted-text)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--pill-border)]'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        }`}
                      >
                        {hero.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{hero.active ? 'Disable' : 'Enable'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: CREATE HERO ==================== */}
      {activeTab === 'create' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs max-w-2xl mx-auto">
          <div className="pb-4 mb-6 border-b border-[var(--border-subtle)]">
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
              Add Superstar to Catalog
            </h2>
            <p className="text-xs text-[var(--muted-text)] mt-1">
              Add a new star directly into MongoDB Atlas. Initial push defaults to ₹0, or enter a promotional seed baseline.
            </p>
          </div>

          {formCreatedMessage && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Superstar successfully listed and initialized in database!</span>
            </div>
          )}

          <form onSubmit={handleCreateHero} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Full Stage Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jr NTR, Yash, Thalapathy Vijay"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted-text)]/60 focus:outline-hidden focus:border-[#e95325]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Cinema Region
                </label>
                <select
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value as 'South' | 'North')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-hidden"
                >
                  <option value="South">South Cinema</option>
                  <option value="North">North Cinema</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Primary Industry
                </label>
                <select
                  value={formIndustry}
                  onChange={(e) => setFormIndustry(e.target.value as Industry)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-hidden"
                >
                  <option value="Telugu">Telugu (Tollywood)</option>
                  <option value="Tamil">Tamil (Kollywood)</option>
                  <option value="Hindi">Hindi (Bollywood)</option>
                  <option value="Malayalam">Malayalam (Mollywood)</option>
                  <option value="Kannada">Kannada (Sandalwood)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Fandom Title Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Young Tiger, Rocking Star"
                  value={formTitleTag}
                  onChange={(e) => setFormTitleTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted-text)]/60 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Initial Push / Promo Amount (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="e.g. 600 (default 0)"
                  value={formInitialPush}
                  onChange={(e) => setFormInitialPush(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted-text)]/60 focus:outline-hidden tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Latest Blockbuster Film
              </label>
              <input
                type="text"
                placeholder="e.g. Devara: Part 1, Toxic, Leo"
                value={formBlockbuster}
                onChange={(e) => setFormBlockbuster(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted-text)]/60 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Portrait / Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted-text)]/60 focus:outline-hidden"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create & List Superstar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== TAB 7: DATABASE BASELINE ==================== */}
      {activeTab === 'database' && (
        <div className="rounded-2xl bg-[var(--card-bg)] border border-red-500/20 p-6 shadow-xs max-w-xl mx-auto text-xs space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Dangerous Operation: Reset Database to ₹0</span>
          </div>

          <p className="text-[var(--muted-text)] leading-relaxed">
            This operation completely clears all bids, checkout sessions, activity logs, and resets all listed superstars back to the clean baseline with strictly ₹0 total bids.
          </p>

          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-[11px] text-red-300">
            <strong>Warning:</strong> This cannot be undone. All real transaction logs and promotional baselines will be purged.
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold transition-all cursor-pointer"
            >
              Reset All Data to Clean ₹0
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-subtle)] space-y-3">
              <p className="font-semibold text-[var(--foreground)]">
                Are you absolutely certain? This will wipe the database.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirmReset}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all cursor-pointer"
                >
                  {isResetting ? 'Resetting DB...' : 'Yes, Wipe Everything to ₹0'}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 rounded-lg bg-[var(--card-bg)] text-[var(--muted-text)] hover:text-[var(--foreground)] border border-[var(--pill-border)] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unlock Passcode Modal (verified against DB) */}
      {showUnlockModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowUnlockModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-2xl animate-in zoom-in-95 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)]">
                <Unlock className="w-4 h-4 text-amber-500" />
                <span>Unlock Promotional Controls</span>
              </div>
              <button 
                onClick={() => setShowUnlockModal(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUnlock} className="mt-4 space-y-3.5 text-xs">
              <p className="text-[var(--muted-text)] leading-relaxed">
                Enter your master password (saved in DB) to unlock live initial push adjustments.
              </p>

              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter admin password..."
                  value={adminPassphrase}
                  onChange={(e) => setAdminPassphrase(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325]"
                />
              </div>

              {unlockError && (
                <div className="text-[11px] text-red-400 font-semibold">
                  {unlockError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingUnlock}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isVerifyingUnlock ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Confirm & Unlock</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
