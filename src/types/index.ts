export type Region = 'All' | 'South' | 'North';

export type Industry = 'Telugu' | 'Hindi' | 'Tamil' | 'Malayalam' | 'Kannada' | 'All';

export type TimeWindow = 'all-time' | 'today' | 'this-week';

export interface SupporterContribution {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalAmount: number;
  bidCount: number;
  lastBidAt: string;
}

export interface Hero {
  id: string;
  name: string;
  displayName: string;
  avatarUrl: string;
  coverUrl: string;
  region: 'South' | 'North';
  industry: Industry;
  titleTag: string; // e.g. "Icon Star", "Rebel Star", "King Khan"
  latestBlockbuster?: string;
  bio?: string;
  totalBidAmount: number; // All-time backing in INR (realPaidAmount + initialPushAmount)
  todayBidAmount: number; // Today's backing in INR
  weekBidAmount: number; // This week's backing in INR
  initialPushAmount?: number; // Admin promotional / seed baseline in INR
  realPaidAmount?: number; // Actual fan payments collected via Dodo in INR
  todayRealAmount?: number;
  weekRealAmount?: number;
  totalBidCount: number;
  supportersCount: number;
  currentRank: number;
  previousRank: number;
  highestSingleBid: number;
  lastBidAt: string;
  active: boolean;
  topSupporters: SupporterContribution[];
}

export interface Bid {
  id: string;
  heroId: string;
  heroName: string;
  userId: string;
  username: string;
  userAvatar?: string;
  amount: number; // in INR
  currency: 'INR';
  createdAt: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  rankAtBidTime: number;
  resultRank: number;
  note?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'BID_PLACED' | 'RANK_1_OVERTAKE' | 'RANK_CHANGE' | 'SUPPORTER_OVERTAKE' | 'NEW_HERO_LISTED';
  heroId: string;
  heroName: string;
  heroAvatar: string;
  userId: string;
  username: string;
  userAvatar?: string;
  amount?: number;
  previousRank?: number;
  newRank?: number;
  targetUsername?: string;
  timestamp: string;
}

export interface HeroRequest {
  id: string;
  name: string;
  region: 'South' | 'North';
  industry: Industry;
  reason?: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  votesCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  walletBalance: number;
  totalBackedAmount: number;
  totalBidsCount: number;
  heroesBackedCount: number;
  bestSupporterRank: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
}

export interface PlatformStats {
  totalVolume: number;
  todayVolume: number;
  totalBids: number;
  totalHeroes: number;
  totalSupporters: number;
  onlineCount: number;
  topSouthHero: { name: string; amount: number; rank: number };
  topNorthHero: { name: string; amount: number; rank: number };
}

export interface PaymentRecord {
  sessionId: string;
  paymentId?: string;
  idempotencyKey?: string;
  checkoutUrl?: string;
  heroId: string;
  heroName: string;
  userId: string;
  username: string;
  userAvatar?: string;
  amount: number;
  currency: string;
  note?: string;
  customerEmail?: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  fulfilledAt?: string;
}

export interface PromoAdjustment {
  id: string;
  heroId: string;
  heroName: string;
  previousPushAmount: number;
  newPushAmount: number;
  delta: number;
  updatedBy: string;
  reason?: string;
  createdAt: string;
}

export interface AdminFinancials {
  totalRealPayments: number;
  totalPromoPush: number;
  totalDisplayVolume: number;
  realPaymentsCount: number;
  heroesCount: number;
}
