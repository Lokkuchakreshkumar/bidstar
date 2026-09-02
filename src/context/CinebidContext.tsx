'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Hero, Bid, ActivityEvent, HeroRequest, Region, Industry, TimeWindow, UserProfile, PlatformStats, PromoAdjustment, AdminFinancials, PaymentRecord } from '@/types';
import { INITIAL_HEROES } from '@/data/initialHeroes';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface ApiErrorNotification {
  message: string;
  fallback: string;
  code?: string;
}

interface CinebidContextType {
  heroes: Hero[];
  sortedHeroes: Hero[];
  timeWindow: TimeWindow;
  setTimeWindow: (w: TimeWindow) => void;
  selectedRegion: Region;
  setSelectedRegion: (r: Region) => void;
  selectedCategory: Industry;
  setSelectedCategory: (c: Industry) => void;
  bids: Bid[];
  activityFeed: ActivityEvent[];
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  heroRequests: HeroRequest[];
  platformStats: PlatformStats | null;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  sseConnected: boolean;
  // Error Handling
  apiError: ApiErrorNotification | null;
  clearApiError: () => void;
  // Modals
  activeBidHero: Hero | null;
  openBidModal: (hero: Hero) => void;
  closeBidModal: () => void;
  isRequestModalOpen: boolean;
  openRequestModal: () => void;
  closeRequestModal: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  shareHero: Hero | null;
  openShareModal: (hero: Hero) => void;
  closeShareModal: () => void;
  // Actions
  placeBid: (heroId: string, amount: number, note?: string, customUsername?: string) => Promise<{ success: boolean; newRank: number; previousRank: number }>;
  requestHero: (name: string, region: 'South' | 'North', industry: Industry, reason?: string) => Promise<void>;
  adminCreateHero: (hero: Partial<Hero>) => Promise<void>;
  adminToggleHeroActive: (heroId: string) => Promise<void>;
  adminApproveRequest: (requestId: string) => Promise<void>;
  adminRejectRequest: (requestId: string) => Promise<void>;
  adminResetData: () => Promise<void>;
  adminUpdateInitialPush: (heroId: string, pushAmount: number, reason?: string, adminKey?: string) => Promise<{ success: boolean; message?: string }>;
  adminFinancials: AdminFinancials | null;
  adminAdjustments: PromoAdjustment[];
  adminPayments: PaymentRecord[];
  refreshFinancials: () => Promise<void>;
  getHeroById: (id: string) => Hero | undefined;
  getTopSupportersGlobal: () => { username: string; totalAmount: number; topHeroName: string; bidsCount: number }[];
  currentLeader: Hero;
  amountToBeatNumberOne: number;
  refreshData: () => Promise<void>;
}

const CLEAN_USER: UserProfile = {
  id: 'user-local',
  username: 'fan',
  displayName: 'Cinema Fan',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  walletBalance: 0,
  totalBackedAmount: 0,
  totalBidsCount: 0,
  heroesBackedCount: 0,
  bestSupporterRank: 0,
  badges: [],
};

const CinebidContext = createContext<CinebidContextType | undefined>(undefined);

export function CinebidProvider({ children }: { children: React.ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>(INITIAL_HEROES);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all-time');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [selectedCategory, setSelectedCategory] = useState<Industry>('All');
  const [bids, setBids] = useState<Bid[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [user, setUser] = useState<UserProfile>(CLEAN_USER);
  const [heroRequests, setHeroRequests] = useState<HeroRequest[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ApiErrorNotification | null>(null);
  const [adminFinancials, setAdminFinancials] = useState<AdminFinancials | null>(null);
  const [adminAdjustments, setAdminAdjustments] = useState<PromoAdjustment[]>([]);
  const [adminPayments, setAdminPayments] = useState<PaymentRecord[]>([]);

  // Modals state
  const [activeBidHero, setActiveBidHero] = useState<Hero | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareHero, setShareHero] = useState<Hero | null>(null);

  const clearApiError = useCallback(() => {
    setApiError(null);
  }, []);

  // Auto-dismiss API errors after 6 seconds
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  // Load user profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinebid_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username) {
          setUser((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('cinebid_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Fetch initial data from server APIs
  const refreshData = useCallback(async () => {
    try {
      const heroesRes = await fetch('/api/heroes');
      if (heroesRes.ok) {
        const json = await heroesRes.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setHeroes(json.data);
        }
      }

      const bidsRes = await fetch('/api/bids?limit=100');
      if (bidsRes.ok) {
        const bidsJson = await bidsRes.json();
        if (bidsJson.data) {
          setBids(bidsJson.data);
        }
      }

      const actRes = await fetch('/api/activity?limit=50');
      if (actRes.ok) {
        const actJson = await actRes.json();
        if (actJson.data) {
          setActivityFeed(actJson.data);
        }
      }

      const reqRes = await fetch('/api/requests');
      if (reqRes.ok) {
        const reqJson = await reqRes.json();
        if (reqJson.data) {
          setHeroRequests(reqJson.data);
        }
      }

      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.data) {
          setPlatformStats(statsJson.data);
        }
      }
    } catch (err) {
      console.warn('Backend fetch error:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Connect to Server-Sent Events (SSE) stream for real-time live events
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/activity/stream');

      eventSource.addEventListener('connected', () => {
        setSseConnected(true);
      });

      eventSource.addEventListener('update', (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.heroes) {
            setHeroes(payload.heroes);
          }
          if (payload.event) {
            setActivityFeed((prev) => [payload.event, ...prev.slice(0, 49)]);
          }
          if (payload.bid) {
            setBids((prev) => [payload.bid, ...prev]);
          }
        } catch {}
      });

      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch {
      setSseConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sort and filter heroes by Region, Category, and Time Window
  const sortedHeroes = useMemo(() => {
    let list = [...heroes];

    if (selectedRegion !== 'All') {
      list = list.filter((h) => h.region === selectedRegion);
    }

    if (selectedCategory !== 'All') {
      list = list.filter((h) => h.industry === selectedCategory);
    }

    list.sort((a, b) => {
      let valA = a.totalBidAmount;
      let valB = b.totalBidAmount;

      if (timeWindow === 'today') {
        valA = a.todayBidAmount;
        valB = b.todayBidAmount;
      } else if (timeWindow === 'this-week') {
        valA = a.weekBidAmount;
        valB = b.weekBidAmount;
      }

      if (valB !== valA) return valB - valA;
      return b.supportersCount - a.supportersCount;
    });

    return list.map((hero, index) => ({
      ...hero,
      currentRank: index + 1,
    }));
  }, [heroes, selectedRegion, selectedCategory, timeWindow]);

  const currentLeader = useMemo(() => {
    const list = [...sortedHeroes];
    return list[0] || INITIAL_HEROES[0];
  }, [sortedHeroes]);

  const amountToBeatNumberOne = useMemo(() => {
    const leaderAmount = timeWindow === 'today'
      ? currentLeader.todayBidAmount
      : timeWindow === 'this-week'
      ? currentLeader.weekBidAmount
      : currentLeader.totalBidAmount;
    return leaderAmount > 0 ? leaderAmount + 10 : 50;
  }, [currentLeader, timeWindow]);

  // Place a Bid via Server API with ACID transaction guarantee
  const placeBid = useCallback(
    async (heroId: string, amount: number, note?: string, customUsername?: string) => {
      if (amount < 50) {
        setApiError({
          message: 'Minimum contribution amount is ₹50',
          fallback: 'Please choose an amount of ₹50 or higher.',
        });
        return { success: false, newRank: 0, previousRank: 0 };
      }

      const bidderUsername = (customUsername && customUsername.trim()) || user.username || 'fan';
      if (customUsername && customUsername.trim() && customUsername !== user.username) {
        updateUserProfile({ username: customUsername.trim(), displayName: customUsername.trim() });
      }

      try {
        const response = await fetch('/api/bids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heroId,
            amount,
            userId: user.id,
            username: bidderUsername,
            userAvatar: user.avatarUrl,
            note,
          }),
        });

        const resJson = await response.json();

        if (response.ok && resJson.success) {
          const { hero, event, previousRank, newRank, becameRankOne } = resJson.data;

          setHeroes((prev) =>
            prev.map((h) => (h.id === heroId ? hero : h))
          );
          setActivityFeed((prev) => [event, ...prev.slice(0, 49)]);
          if (resJson.data.bid) {
            setBids((prev) => [resJson.data.bid, ...prev]);
          }

          setUser((prev) => ({
            ...prev,
            totalBackedAmount: prev.totalBackedAmount + amount,
            totalBidsCount: prev.totalBidsCount + 1,
          }));

          if (becameRankOne) {
            sound.playRankOneChime();
            try {
              confetti({
                particleCount: 120,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#ff5722', '#eab308', '#3b82f6', '#10b981'],
              });
            } catch {}
          } else {
            sound.playBidPlaced();
            try {
              confetti({
                particleCount: 40,
                spread: 55,
                origin: { y: 0.7 },
                colors: ['#ff5722', '#eab308'],
              });
            } catch {}
          }

          return { success: true, newRank, previousRank };
        } else {
          setApiError({
            message: resJson.error?.message || 'Transaction could not be completed',
            fallback: resJson.fallback || 'Your bid was not recorded. No changes were made.',
            code: resJson.error?.code,
          });
        }
      } catch (err: unknown) {
        console.error('Server bid failed:', err);
        setApiError({
          message: 'Network connection issue while placing bid.',
          fallback: 'Please check your internet connection and try again.',
          code: 'DB_CONNECTION_ERROR',
        });
      }

      return { success: false, newRank: 0, previousRank: 0 };
    },
    [user, updateUserProfile]
  );

  // Suggest / Request a Hero
  const requestHero = useCallback(
    async (name: string, region: 'South' | 'North', industry: Industry, reason?: string) => {
      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            region,
            industry,
            reason,
            requestedBy: user.username,
          }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          setHeroRequests((prev) => [json.data, ...prev]);
        } else {
          setApiError({
            message: json.error?.message || 'Failed to submit recommendation',
            fallback: json.fallback || 'Suggestion could not be saved to MongoDB.',
            code: json.error?.code,
          });
        }
      } catch (err) {
        console.error('Request hero failed:', err);
        setApiError({
          message: 'Failed to communicate with suggestion endpoint.',
          fallback: 'Please try again in a few moments.',
          code: 'DB_CONNECTION_ERROR',
        });
      }
    },
    [user.username]
  );

  // Admin Actions
  const adminCreateHero = useCallback(async (heroData: Partial<Hero>) => {
    try {
      const res = await fetch('/api/heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setHeroes((prev) => [...prev, json.data]);
      } else {
        setApiError({
          message: json.error?.message || 'Could not create hero',
          fallback: json.fallback || 'Hero could not be saved in MongoDB.',
        });
      }
    } catch (err) {
      console.error('Admin create hero error:', err);
    }
  }, []);

  const adminToggleHeroActive = useCallback(async (heroId: string) => {
    const current = heroes.find((h) => h.id === heroId);
    if (!current) return;

    try {
      const res = await fetch(`/api/heroes/${heroId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !current.active }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setHeroes((prev) =>
          prev.map((h) => (h.id === heroId ? { ...h, active: !h.active } : h))
        );
      }
    } catch (err) {
      console.error('Admin toggle hero error:', err);
    }
  }, [heroes]);

  const adminApproveRequest = useCallback(async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/approve`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setHeroes((prev) => [...prev, json.data]);
        setHeroRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
        );
      } else {
        setApiError({
          message: json.error?.message || 'Failed to approve request',
          fallback: json.fallback || 'Could not publish hero.',
        });
      }
    } catch (err) {
      console.error('Admin approve request error:', err);
    }
  }, []);

  const adminRejectRequest = useCallback(async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/reject`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setHeroRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED' } : r))
        );
      }
    } catch (err) {
      console.error('Admin reject request error:', err);
    }
  }, []);

  const adminResetData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Admin reset data error:', err);
    }
  }, [refreshData]);

  const refreshFinancials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/financials');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAdminFinancials(json.data.financials);
          setAdminAdjustments(json.data.adjustments || []);
          setAdminPayments(json.data.payments || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin financials:', err);
    }
  }, []);

  const adminUpdateInitialPush = useCallback(
    async (heroId: string, pushAmount: number, reason?: string, adminKey?: string) => {
      try {
        const res = await fetch('/api/admin/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroId, initialPushAmount: pushAmount, reason, adminKey }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          await refreshData();
          await refreshFinancials();
          return { success: true, message: json.message };
        } else {
          const errMsg = json.error?.message || json.fallback || 'Failed to update initial push';
          return { success: false, message: errMsg };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network error';
        return { success: false, message };
      }
    },
    [refreshData, refreshFinancials]
  );

  const getHeroById = useCallback(
    (id: string) => heroes.find((h) => h.id === id),
    [heroes]
  );

  const getTopSupportersGlobal = useCallback(() => {
    const supporterMap = new Map<string, { totalAmount: number; heroAmounts: Map<string, number>; bidsCount: number }>();

    heroes.forEach((h) => {
      (h.topSupporters || []).forEach((s) => {
        const existing = supporterMap.get(s.username) || { totalAmount: 0, heroAmounts: new Map<string, number>(), bidsCount: 0 };
        existing.totalAmount += s.totalAmount;
        existing.bidsCount += s.bidCount;
        const curHeroAmt = existing.heroAmounts.get(h.name) || 0;
        existing.heroAmounts.set(h.name, curHeroAmt + s.totalAmount);
        supporterMap.set(s.username, existing);
      });
    });

    const result: { username: string; totalAmount: number; topHeroName: string; bidsCount: number }[] = [];

    supporterMap.forEach((val, username) => {
      let topHero = 'Cinema';
      let maxHeroAmt = 0;
      val.heroAmounts.forEach((amt, heroName) => {
        if (amt > maxHeroAmt) {
          maxHeroAmt = amt;
          topHero = heroName;
        }
      });
      result.push({
        username,
        totalAmount: val.totalAmount,
        topHeroName: topHero,
        bidsCount: val.bidsCount,
      });
    });

    result.sort((a, b) => b.totalAmount - a.totalAmount);
    return result;
  }, [heroes]);

  const openBidModal = useCallback((hero: Hero) => {
    sound.playClick();
    setActiveBidHero(hero);
  }, []);

  const closeBidModal = useCallback(() => {
    setActiveBidHero(null);
  }, []);

  const openRequestModal = useCallback(() => {
    sound.playClick();
    setIsRequestModalOpen(true);
  }, []);

  const closeRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    sound.playClick();
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const openShareModal = useCallback((hero: Hero) => {
    sound.playClick();
    setShareHero(hero);
  }, []);

  const closeShareModal = useCallback(() => {
    setShareHero(null);
  }, []);

  return (
    <CinebidContext.Provider
      value={{
        heroes,
        sortedHeroes,
        timeWindow,
        setTimeWindow,
        selectedRegion,
        setSelectedRegion,
        selectedCategory,
        setSelectedCategory,
        bids,
        activityFeed,
        user,
        updateUserProfile,
        heroRequests,
        platformStats,
        soundEnabled,
        setSoundEnabled,
        sseConnected,
        apiError,
        clearApiError,
        activeBidHero,
        openBidModal,
        closeBidModal,
        isRequestModalOpen,
        openRequestModal,
        closeRequestModal,
        isSearchOpen,
        openSearch,
        closeSearch,
        shareHero,
        openShareModal,
        closeShareModal,
        placeBid,
        requestHero,
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
        getHeroById,
        getTopSupportersGlobal,
        currentLeader,
        amountToBeatNumberOne,
        refreshData,
      }}
    >
      {/* Global Fallback & API Error Banner */}
      {apiError && (
        <div className="fixed top-18 right-4 z-50 max-w-md w-full bg-[#1c1b1a] border border-amber-500/30 text-[var(--foreground)] p-4 rounded-xl shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {apiError.code || 'Notice'}
                </h4>
              </div>
              <p className="text-xs text-[var(--foreground)] font-medium mt-1">
                {apiError.message}
              </p>
              <p className="text-[11px] text-[var(--muted-text)] mt-1 border-t border-[var(--border-subtle)] pt-1">
                {apiError.fallback}
              </p>
            </div>
            <button
              onClick={clearApiError}
              className="text-[var(--muted-text)] hover:text-[var(--foreground)] text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {children}
    </CinebidContext.Provider>
  );
}

export function useCinebid() {
  const context = useContext(CinebidContext);
  if (!context) {
    throw new Error('useCinebid must be used within a CinebidProvider');
  }
  return context;
}
