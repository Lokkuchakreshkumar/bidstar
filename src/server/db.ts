import EventEmitter from 'events';
import { 
  Hero, 
  Bid, 
  ActivityEvent, 
  HeroRequest, 
  Region, 
  Industry, 
  TimeWindow, 
  PlatformStats, 
  SupporterContribution, 
  PaymentRecord,
  PromoAdjustment,
  AdminFinancials
} from '@/types';
import { 
  getMongoClient, 
  getHeroesCollection, 
  getBidsCollection, 
  getPaymentsCollection, 
  getActivityCollection, 
  getHeroRequestsCollection, 
  getWebhookEventsCollection, 
  getPromoAdjustmentsCollection,
  verifyAdminPasswordInDb,
  initializeDatabase, 
  seedInitialHeroesZeroRs,
  HeroDocument,
  BidDocument,
  PaymentDocument,
  ActivityDocument,
  HeroRequestDocument,
  PromoAdjustmentDocument
} from './mongodb';

// Event emitter for Server-Sent Events (SSE)
export const sseEmitter = new EventEmitter();
sseEmitter.setMaxListeners(100);

export class MongoDatabaseEngine {
  private _initPromise: Promise<void> | null = null;

  private async ensureInitialized(): Promise<void> {
    if (!this._initPromise) {
      this._initPromise = initializeDatabase().catch((err) => {
        this._initPromise = null;
        console.error('Database initialization error:', err);
        throw err;
      });
    }
    await this._initPromise;
  }

  // --- HEROES RETRIEVAL & MANAGEMENT ---
  public async getHeroes(filter?: {
    region?: Region;
    industry?: Industry;
    timeWindow?: TimeWindow;
    search?: string;
    sortBy?: string;
  }): Promise<Hero[]> {
    await this.ensureInitialized();
    const heroesCol = await getHeroesCollection();

    const query: Record<string, unknown> = { active: true };

    if (filter?.region && filter.region !== 'All') {
      query.region = filter.region;
    }

    if (filter?.industry && filter.industry !== 'All') {
      query.industry = filter.industry;
    }

    if (filter?.search) {
      const regex = new RegExp(filter.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: regex },
        { displayName: regex },
        { titleTag: regex },
        { industry: regex },
        { region: regex },
      ];
    }

    const rawHeroes = await heroesCol.find(query).toArray();

    // Map documents to clean Hero interface
    const heroes: Hero[] = rawHeroes.map((h) => {
      const realPaidAmount = Number(h.realPaidAmount || 0);
      const initialPushAmount = Number(h.initialPushAmount || 0);
      const totalBidAmount = Math.max(Number(h.totalBidAmount || 0), realPaidAmount + initialPushAmount);
      const todayBidAmount = Math.max(Number(h.todayBidAmount || 0), Number(h.todayRealAmount || 0) + initialPushAmount);
      const weekBidAmount = Math.max(Number(h.weekBidAmount || 0), Number(h.weekRealAmount || 0) + initialPushAmount);

      return {
        id: h.id,
        name: h.name,
        displayName: h.displayName || h.name,
        avatarUrl: h.avatarUrl,
        coverUrl: h.coverUrl,
        region: h.region as 'South' | 'North',
        industry: h.industry as Industry,
        titleTag: h.titleTag,
        latestBlockbuster: h.latestBlockbuster || 'Upcoming Feature',
        bio: h.bio || '',
        totalBidAmount,
        todayBidAmount,
        weekBidAmount,
        initialPushAmount,
        realPaidAmount,
        totalBidCount: Number(h.totalBidCount || 0),
        supportersCount: Number(h.supportersCount || 0),
        currentRank: Number(h.currentRank || 1),
        previousRank: Number(h.previousRank || 1),
        highestSingleBid: Number(h.highestSingleBid || 0),
        lastBidAt: h.lastBidAt || '',
        active: h.active !== false,
        topSupporters: (h.topSupporters || []) as SupporterContribution[],
      };
    });

    const timeWindow = filter?.timeWindow || 'all-time';

    heroes.sort((a, b) => {
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

    return heroes.map((h, idx) => ({
      ...h,
      currentRank: idx + 1,
      previousRank: h.previousRank || idx + 1,
    }));
  }

  public async getHeroById(id: string): Promise<Hero | null> {
    await this.ensureInitialized();
    const heroesCol = await getHeroesCollection();
    const raw = await heroesCol.findOne({ id });
    if (!raw) return null;

    // Get real-time rank among active heroes
    const allHeroes = await this.getHeroes();
    const ranked = allHeroes.find((h) => h.id === id);
    if (ranked) return ranked;

    const realPaidAmount = Number(raw.realPaidAmount || 0);
    const initialPushAmount = Number(raw.initialPushAmount || 0);
    const totalBidAmount = Math.max(Number(raw.totalBidAmount || 0), realPaidAmount + initialPushAmount);
    const todayBidAmount = Math.max(Number(raw.todayBidAmount || 0), Number(raw.todayRealAmount || 0) + initialPushAmount);
    const weekBidAmount = Math.max(Number(raw.weekBidAmount || 0), Number(raw.weekRealAmount || 0) + initialPushAmount);

    return {
      id: raw.id,
      name: raw.name,
      displayName: raw.displayName || raw.name,
      avatarUrl: raw.avatarUrl,
      coverUrl: raw.coverUrl,
      region: raw.region as 'South' | 'North',
      industry: raw.industry as Industry,
      titleTag: raw.titleTag,
      latestBlockbuster: raw.latestBlockbuster || 'Upcoming Feature',
      bio: raw.bio || '',
      totalBidAmount,
      todayBidAmount,
      weekBidAmount,
      initialPushAmount,
      realPaidAmount,
      totalBidCount: Number(raw.totalBidCount || 0),
      supportersCount: Number(raw.supportersCount || 0),
      currentRank: Number(raw.currentRank || 1),
      previousRank: Number(raw.previousRank || 1),
      highestSingleBid: Number(raw.highestSingleBid || 0),
      lastBidAt: raw.lastBidAt || '',
      active: raw.active !== false,
      topSupporters: (raw.topSupporters || []) as SupporterContribution[],
    };
  }

  public async createHero(heroData: Partial<Hero>): Promise<Hero> {
    await this.ensureInitialized();
    const heroesCol = await getHeroesCollection();
    const id = heroData.id || `hero-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const existingCount = await heroesCol.countDocuments({ active: true });
    const newRank = existingCount + 1;

    const doc: HeroDocument = {
      id,
      name: heroData.name || 'New Hero',
      displayName: heroData.displayName || heroData.name || 'New Hero',
      avatarUrl: heroData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      coverUrl: heroData.coverUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200',
      region: heroData.region || 'South',
      industry: heroData.industry || 'Telugu',
      titleTag: heroData.titleTag || 'Superstar',
      latestBlockbuster: heroData.latestBlockbuster || 'Upcoming Feature',
      bio: heroData.bio || 'Indian cinema icon.',
      totalBidAmount: 0,
      todayBidAmount: 0,
      weekBidAmount: 0,
      totalBidCount: 0,
      supportersCount: 0,
      currentRank: newRank,
      previousRank: newRank,
      highestSingleBid: 0,
      lastBidAt: '',
      active: heroData.active !== false,
      topSupporters: [],
      createdAt: now,
      updatedAt: now,
    };

    await heroesCol.insertOne(doc);
    return (await this.getHeroById(id))!;
  }

  public async updateHero(id: string, updates: Partial<Hero>): Promise<Hero> {
    await this.ensureInitialized();
    const heroesCol = await getHeroesCollection();
    const now = new Date().toISOString();

    const updateFields: Record<string, unknown> = { updatedAt: now };
    if (updates.name !== undefined) updateFields.name = updates.name;
    if (updates.displayName !== undefined) updateFields.displayName = updates.displayName;
    if (updates.avatarUrl !== undefined) updateFields.avatarUrl = updates.avatarUrl;
    if (updates.coverUrl !== undefined) updateFields.coverUrl = updates.coverUrl;
    if (updates.region !== undefined) updateFields.region = updates.region;
    if (updates.industry !== undefined) updateFields.industry = updates.industry;
    if (updates.titleTag !== undefined) updateFields.titleTag = updates.titleTag;
    if (updates.latestBlockbuster !== undefined) updateFields.latestBlockbuster = updates.latestBlockbuster;
    if (updates.bio !== undefined) updateFields.bio = updates.bio;
    if (updates.active !== undefined) updateFields.active = updates.active;

    await heroesCol.updateOne({ id }, { $set: updateFields });
    const updated = await this.getHeroById(id);
    if (!updated) throw new Error(`Hero with id ${id} not found after update`);
    return updated;
  }

  public async toggleHeroActive(heroId: string): Promise<Hero> {
    const hero = await this.getHeroById(heroId);
    if (!hero) throw new Error(`Hero with id ${heroId} not found`);
    return await this.updateHero(heroId, { active: !hero.active });
  }

  // --- ATOMIC BID CREATION WITH ACID TRANSACTIONS ---
  public async createBid(params: {
    heroId: string;
    amount: number;
    userId: string;
    username: string;
    userAvatar?: string;
    note?: string;
  }): Promise<{
    bid: Bid;
    hero: Hero;
    event: ActivityEvent;
    previousRank: number;
    newRank: number;
    becameRankOne: boolean;
  }> {
    await this.ensureInitialized();
    const { heroId, amount, userId, username, userAvatar, note } = params;

    if (amount <= 0 || isNaN(amount)) {
      throw new Error('Bid amount must be a positive number greater than 0');
    }

    const client = await getMongoClient();
    const session = client.startSession();

    try {
      let resultData: {
        bid: Bid;
        hero: Hero;
        event: ActivityEvent;
        previousRank: number;
        newRank: number;
        becameRankOne: boolean;
        allHeroesAfter: Hero[];
      } | null = null;

      await session.withTransaction(async () => {
        const heroesCol = client.db('cinebid').collection<HeroDocument>('heroes');
        const bidsCol = client.db('cinebid').collection<BidDocument>('bids');
        const actCol = client.db('cinebid').collection<ActivityDocument>('activity_events');

        const rawHero = await heroesCol.findOne({ id: heroId }, { session });
        if (!rawHero) {
          throw new Error(`Hero with ID '${heroId}' not found`);
        }

        // Get snapshot of all active heroes before bid
        const allHeroesBefore = await heroesCol
          .find({ active: true }, { session })
          .sort({ totalBidAmount: -1, supportersCount: -1 })
          .toArray();

        const heroBeforeIndex = allHeroesBefore.findIndex((h) => h.id === heroId);
        const previousRank = heroBeforeIndex !== -1 ? heroBeforeIndex + 1 : allHeroesBefore.length + 1;
        const previousLeader = allHeroesBefore[0] || null;

        const bidId = `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const now = new Date().toISOString();

        // 1. Insert Bid Record
        const newBid: BidDocument = {
          id: bidId,
          heroId,
          heroName: rawHero.name,
          userId: userId || 'anon-user',
          username: username || 'fan',
          userAvatar: userAvatar || undefined,
          amount,
          currency: 'INR',
          note: note || undefined,
          status: 'PAID',
          rankAtBidTime: previousRank,
          resultRank: 1, // calculated below
          createdAt: now,
        };
        await bidsCol.insertOne(newBid, { session });

        // 2. Recompute Hero Stats
        const newRealPaidAmount = (rawHero.realPaidAmount || 0) + amount;
        const newTodayRealAmount = (rawHero.todayRealAmount || 0) + amount;
        const newWeekRealAmount = (rawHero.weekRealAmount || 0) + amount;
        const initialPush = Number(rawHero.initialPushAmount || 0);

        const newTotalAmount = newRealPaidAmount + initialPush;
        const newTodayAmount = newTodayRealAmount + initialPush;
        const newWeekAmount = newWeekRealAmount + initialPush;
        const newTotalCount = (rawHero.totalBidCount || 0) + 1;
        const newHighestSingle = Math.max(rawHero.highestSingleBid || 0, amount);

        // Update top supporters for this hero
        const topSupportersAgg = await bidsCol
          .aggregate<SupporterContribution>(
            [
              { $match: { heroId, status: 'PAID' } },
              {
                $group: {
                  _id: '$username',
                  userId: { $first: '$userId' },
                  username: { $first: '$username' },
                  avatarUrl: { $first: '$userAvatar' },
                  totalAmount: { $sum: '$amount' },
                  bidCount: { $sum: 1 },
                  lastBidAt: { $max: '$createdAt' },
                },
              },
              { $sort: { totalAmount: -1 } },
              { $limit: 10 },
            ],
            { session }
          )
          .toArray();

        const uniqueSupportersCount = await bidsCol
          .distinct('username', { heroId, status: 'PAID' }, { session });

        await heroesCol.updateOne(
          { id: heroId },
          {
            $set: {
              realPaidAmount: newRealPaidAmount,
              todayRealAmount: newTodayRealAmount,
              weekRealAmount: newWeekRealAmount,
              totalBidAmount: newTotalAmount,
              todayBidAmount: newTodayAmount,
              weekBidAmount: newWeekAmount,
              totalBidCount: newTotalCount,
              supportersCount: uniqueSupportersCount.length,
              highestSingleBid: newHighestSingle,
              lastBidAt: now,
              topSupporters: topSupportersAgg,
              updatedAt: now,
            },
          },
          { session }
        );

        // 3. Recalculate ranks across all active heroes
        const allHeroesAfterRaw = await heroesCol
          .find({ active: true }, { session })
          .sort({ totalBidAmount: -1, supportersCount: -1 })
          .toArray();

        let newRank = 1;
        for (let idx = 0; idx < allHeroesAfterRaw.length; idx++) {
          const rank = idx + 1;
          const h = allHeroesAfterRaw[idx];
          if (h.id === heroId) {
            newRank = rank;
          }
          if (h.currentRank !== rank) {
            await heroesCol.updateOne(
              { id: h.id },
              { $set: { previousRank: h.currentRank || rank, currentRank: rank } },
              { session }
            );
          }
        }

        // Update resultRank on the bid document
        newBid.resultRank = newRank;
        await bidsCol.updateOne({ id: bidId }, { $set: { resultRank: newRank } }, { session });

        const becameRankOne = newRank === 1 && previousLeader !== null && previousLeader.id !== heroId && (previousLeader.totalBidAmount || 0) > 0;

        // 4. Create Activity Event
        const eventId = becameRankOne ? `act-${Date.now()}-overtake` : `act-${Date.now()}-bid`;
        const eventType = becameRankOne ? 'RANK_1_OVERTAKE' : 'BID_PLACED';

        const newEvent: ActivityDocument = {
          id: eventId,
          type: eventType,
          heroId: rawHero.id,
          heroName: rawHero.name,
          heroAvatar: rawHero.avatarUrl,
          userId: userId || 'anon-user',
          username: username || 'fan',
          userAvatar: userAvatar || undefined,
          amount,
          previousRank,
          newRank,
          timestamp: now,
        };
        await actCol.insertOne(newEvent, { session });

        const updatedHero: Hero = {
          id: rawHero.id,
          name: rawHero.name,
          displayName: rawHero.displayName || rawHero.name,
          avatarUrl: rawHero.avatarUrl,
          coverUrl: rawHero.coverUrl,
          region: rawHero.region as 'South' | 'North',
          industry: rawHero.industry as Industry,
          titleTag: rawHero.titleTag,
          latestBlockbuster: rawHero.latestBlockbuster || '',
          bio: rawHero.bio || '',
          totalBidAmount: newTotalAmount,
          todayBidAmount: newTodayAmount,
          weekBidAmount: newWeekAmount,
          totalBidCount: newTotalCount,
          supportersCount: uniqueSupportersCount.length,
          currentRank: newRank,
          previousRank,
          highestSingleBid: newHighestSingle,
          lastBidAt: now,
          active: true,
          topSupporters: topSupportersAgg,
        };

        const allHeroesMapped: Hero[] = allHeroesAfterRaw.map((h, idx) => ({
          id: h.id,
          name: h.name,
          displayName: h.displayName || h.name,
          avatarUrl: h.avatarUrl,
          coverUrl: h.coverUrl,
          region: h.region as 'South' | 'North',
          industry: h.industry as Industry,
          titleTag: h.titleTag,
          latestBlockbuster: h.latestBlockbuster || '',
          bio: h.bio || '',
          totalBidAmount: h.id === heroId ? newTotalAmount : Number(h.totalBidAmount || 0),
          todayBidAmount: h.id === heroId ? newTodayAmount : Number(h.todayBidAmount || 0),
          weekBidAmount: h.id === heroId ? newWeekAmount : Number(h.weekBidAmount || 0),
          totalBidCount: h.id === heroId ? newTotalCount : Number(h.totalBidCount || 0),
          supportersCount: h.id === heroId ? uniqueSupportersCount.length : Number(h.supportersCount || 0),
          currentRank: idx + 1,
          previousRank: h.id === heroId ? previousRank : (h.previousRank || idx + 1),
          highestSingleBid: h.id === heroId ? newHighestSingle : Number(h.highestSingleBid || 0),
          lastBidAt: h.id === heroId ? now : (h.lastBidAt || ''),
          active: true,
          topSupporters: h.id === heroId ? topSupportersAgg : (h.topSupporters || []),
        }));

        resultData = {
          bid: newBid,
          hero: updatedHero,
          event: newEvent,
          previousRank,
          newRank,
          becameRankOne,
          allHeroesAfter: allHeroesMapped,
        };
      });

      if (!resultData) {
        throw new Error('Transaction completed without result data');
      }

      const res = resultData as {
        bid: Bid;
        hero: Hero;
        event: ActivityEvent;
        previousRank: number;
        newRank: number;
        becameRankOne: boolean;
        allHeroesAfter: Hero[];
      };

      // Broadcast SSE update to all live connected users
      sseEmitter.emit('bid_event', {
        bid: res.bid,
        hero: res.hero,
        event: res.event,
        heroes: res.allHeroesAfter,
      });

      return {
        bid: res.bid,
        hero: res.hero,
        event: res.event,
        previousRank: res.previousRank,
        newRank: res.newRank,
        becameRankOne: res.becameRankOne,
      };
    } finally {
      await session.endSession();
    }
  }

  // --- DODO PAYMENTS RECORDING & FULFILLMENT ---
  public async recordCheckoutSession(params: {
    sessionId: string;
    heroId: string;
    heroName: string;
    userId: string;
    username: string;
    userAvatar?: string;
    amount: number;
    note?: string;
    customerEmail?: string;
    idempotencyKey?: string;
    checkoutUrl?: string;
  }): Promise<void> {
    await this.ensureInitialized();
    const paymentsCol = await getPaymentsCollection();
    const now = new Date().toISOString();

    const paymentDoc: PaymentDocument = {
      sessionId: params.sessionId,
      idempotencyKey: params.idempotencyKey,
      checkoutUrl: params.checkoutUrl,
      heroId: params.heroId,
      heroName: params.heroName,
      userId: params.userId,
      username: params.username,
      userAvatar: params.userAvatar,
      amount: params.amount,
      currency: 'INR',
      note: params.note,
      customerEmail: params.customerEmail,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    await paymentsCol.updateOne(
      { sessionId: params.sessionId },
      { $set: paymentDoc },
      { upsert: true }
    );
  }

  public async getPaymentByIdempotencyKey(idempotencyKey: string): Promise<PaymentRecord | null> {
    await this.ensureInitialized();
    const paymentsCol = await getPaymentsCollection();
    const raw = await paymentsCol.findOne({ idempotencyKey });
    if (!raw) return null;
    return {
      sessionId: raw.sessionId,
      paymentId: raw.paymentId,
      idempotencyKey: raw.idempotencyKey,
      checkoutUrl: raw.checkoutUrl,
      heroId: raw.heroId,
      heroName: raw.heroName,
      userId: raw.userId,
      username: raw.username,
      userAvatar: raw.userAvatar,
      amount: raw.amount,
      currency: raw.currency,
      note: raw.note,
      customerEmail: raw.customerEmail,
      status: raw.status,
      createdAt: raw.createdAt,
      fulfilledAt: raw.fulfilledAt,
    };
  }

  public async getPayment(sessionId: string): Promise<PaymentRecord | null> {
    await this.ensureInitialized();
    const paymentsCol = await getPaymentsCollection();
    const raw = await paymentsCol.findOne({ sessionId });
    if (!raw) return null;

    return {
      sessionId: raw.sessionId,
      paymentId: raw.paymentId,
      heroId: raw.heroId,
      heroName: raw.heroName,
      userId: raw.userId,
      username: raw.username,
      userAvatar: raw.userAvatar,
      amount: raw.amount,
      currency: raw.currency || 'INR',
      note: raw.note,
      customerEmail: raw.customerEmail,
      status: raw.status as 'PENDING' | 'PAID' | 'FAILED',
      createdAt: raw.createdAt,
      fulfilledAt: raw.fulfilledAt,
    };
  }

  public async fulfillPayment(
    sessionId: string,
    paymentId?: string
  ): Promise<{
    bid: Bid;
    hero: Hero;
    event: ActivityEvent;
    previousRank: number;
    newRank: number;
    becameRankOne: boolean;
    alreadyFulfilled: boolean;
  }> {
    await this.ensureInitialized();
    const payment = await this.getPayment(sessionId);
    if (!payment) {
      throw new Error(`Payment session not found: ${sessionId}`);
    }

    if (payment.status === 'PAID') {
      const hero = (await this.getHeroById(payment.heroId))!;
      return {
        bid: {
          id: `bid-session-${sessionId}`,
          heroId: payment.heroId,
          heroName: payment.heroName,
          userId: payment.userId,
          username: payment.username,
          userAvatar: payment.userAvatar,
          amount: payment.amount,
          currency: 'INR',
          status: 'PAID',
          rankAtBidTime: hero.currentRank,
          resultRank: hero.currentRank,
          createdAt: payment.fulfilledAt || payment.createdAt,
          note: payment.note,
        },
        hero,
        event: {
          id: `act-session-${sessionId}`,
          type: 'BID_PLACED',
          heroId: hero.id,
          heroName: hero.name,
          heroAvatar: hero.avatarUrl,
          userId: payment.userId,
          username: payment.username,
          amount: payment.amount,
          previousRank: hero.currentRank,
          newRank: hero.currentRank,
          timestamp: payment.fulfilledAt || payment.createdAt,
        },
        previousRank: hero.currentRank,
        newRank: hero.currentRank,
        becameRankOne: false,
        alreadyFulfilled: true,
      };
    }

    // Update payment record to PAID
    const paymentsCol = await getPaymentsCollection();
    const now = new Date().toISOString();
    await paymentsCol.updateOne(
      { sessionId },
      {
        $set: {
          status: 'PAID',
          paymentId: paymentId || undefined,
          fulfilledAt: now,
          updatedAt: now,
        },
      }
    );

    // Apply the bid atomically to MongoDB
    const result = await this.createBid({
      heroId: payment.heroId,
      amount: payment.amount,
      userId: payment.userId,
      username: payment.username,
      userAvatar: payment.userAvatar,
      note: payment.note,
    });

    return {
      ...result,
      alreadyFulfilled: false,
    };
  }

  public async fulfillByPaymentId(
    paymentId: string,
    details: {
      heroId: string;
      amount: number;
      userId?: string;
      username?: string;
      userAvatar?: string;
      note?: string;
      customerEmail?: string;
    }
  ): Promise<{
    bid: Bid;
    hero: Hero;
    event: ActivityEvent;
    previousRank: number;
    newRank: number;
    becameRankOne: boolean;
    alreadyFulfilled: boolean;
  }> {
    await this.ensureInitialized();
    const paymentsCol = await getPaymentsCollection();
    const existing = await paymentsCol.findOne({ paymentId });

    if (existing && existing.status === 'PAID') {
      const hero = (await this.getHeroById(existing.heroId))!;
      return {
        bid: {
          id: `bid-pay-${paymentId}`,
          heroId: existing.heroId,
          heroName: existing.heroName,
          userId: existing.userId,
          username: existing.username,
          userAvatar: existing.userAvatar,
          amount: existing.amount,
          currency: 'INR',
          status: 'PAID',
          rankAtBidTime: hero.currentRank,
          resultRank: hero.currentRank,
          createdAt: existing.fulfilledAt || existing.createdAt,
          note: existing.note,
        },
        hero,
        event: {
          id: `act-pay-${paymentId}`,
          type: 'BID_PLACED',
          heroId: hero.id,
          heroName: hero.name,
          heroAvatar: hero.avatarUrl,
          userId: existing.userId,
          username: existing.username,
          userAvatar: existing.userAvatar,
          amount: existing.amount,
          previousRank: hero.currentRank,
          newRank: hero.currentRank,
          timestamp: existing.fulfilledAt || existing.createdAt,
        },
        previousRank: hero.currentRank,
        newRank: hero.currentRank,
        becameRankOne: false,
        alreadyFulfilled: true,
      };
    }

    const hero = await this.getHeroById(details.heroId);
    if (!hero) {
      throw new Error(`Hero '${details.heroId}' not found`);
    }

    const now = new Date().toISOString();
    const sessionId = existing?.sessionId || `session-for-${paymentId}`;

    await paymentsCol.updateOne(
      { paymentId },
      {
        $set: {
          sessionId,
          paymentId,
          heroId: hero.id,
          heroName: hero.name,
          userId: details.userId || 'anon-user',
          username: details.username || 'fan',
          userAvatar: details.userAvatar,
          amount: details.amount,
          currency: 'INR',
          note: details.note,
          customerEmail: details.customerEmail,
          status: 'PAID',
          createdAt: existing?.createdAt || now,
          fulfilledAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    const result = await this.createBid({
      heroId: hero.id,
      amount: details.amount,
      userId: details.userId || 'anon-user',
      username: details.username || 'fan',
      userAvatar: details.userAvatar,
      note: details.note,
    });

    return {
      ...result,
      alreadyFulfilled: false,
    };
  }

  // Idempotent webhook event recorder
  public async recordWebhookEvent(webhookId: string, eventType: string, payload?: string): Promise<boolean> {
    await this.ensureInitialized();
    const whCol = await getWebhookEventsCollection();
    try {
      const now = new Date().toISOString();
      await whCol.insertOne({
        webhookId,
        eventType,
        payload: payload || undefined,
        createdAt: now,
      });
      return true;
    } catch (err: unknown) {
      // MongoDB duplicate key error code 11000
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
        return false;
      }
      return false;
    }
  }

  // --- ACTIVITY FEED ---
  public async getActivity(limit = 50): Promise<ActivityEvent[]> {
    await this.ensureInitialized();
    const actCol = await getActivityCollection();
    const events = await actCol.find().sort({ timestamp: -1 }).limit(limit).toArray();

    return events.map((e) => ({
      id: e.id,
      type: e.type,
      heroId: e.heroId,
      heroName: e.heroName,
      heroAvatar: e.heroAvatar,
      userId: e.userId,
      username: e.username,
      userAvatar: e.userAvatar,
      amount: e.amount,
      previousRank: e.previousRank,
      newRank: e.newRank,
      targetUsername: e.targetUsername,
      timestamp: e.timestamp,
    }));
  }

  // --- BIDS HISTORY ---
  public async getBids(heroId?: string, limit = 50): Promise<Bid[]> {
    await this.ensureInitialized();
    const bidsCol = await getBidsCollection();
    const query: Record<string, unknown> = { status: 'PAID' };
    if (heroId) {
      query.heroId = heroId;
    }
    const raw = await bidsCol.find(query).sort({ createdAt: -1 }).limit(limit).toArray();

    return raw.map((b) => ({
      id: b.id,
      heroId: b.heroId,
      heroName: b.heroName,
      userId: b.userId,
      username: b.username,
      userAvatar: b.userAvatar,
      amount: b.amount,
      currency: b.currency || 'INR',
      note: b.note,
      status: b.status as 'PAID' | 'PENDING' | 'FAILED',
      rankAtBidTime: b.rankAtBidTime,
      resultRank: b.resultRank,
      createdAt: b.createdAt,
    }));
  }

  // --- GLOBAL TOP SUPPORTERS ---
  public async getGlobalTopSupporters(): Promise<{ username: string; totalAmount: number; topHeroName: string; bidsCount: number }[]> {
    await this.ensureInitialized();
    const bidsCol = await getBidsCollection();

    const pipeline = [
      { $match: { status: 'PAID' } },
      {
        $group: {
          _id: '$username',
          totalAmount: { $sum: '$amount' },
          bidsCount: { $sum: 1 },
          heroNames: { $push: '$heroName' },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 50 },
    ];

    interface SupporterAgg {
      _id: string;
      totalAmount: number;
      bidsCount: number;
      heroNames: string[];
    }

    const rows = await bidsCol.aggregate<SupporterAgg>(pipeline).toArray();

    return rows.map((r) => {
      // Find most frequent heroName
      const counts: Record<string, number> = {};
      let topHero = 'Cinema';
      let maxC = 0;
      for (const name of r.heroNames) {
        counts[name] = (counts[name] || 0) + 1;
        if (counts[name] > maxC) {
          maxC = counts[name];
          topHero = name;
        }
      }

      return {
        username: r._id,
        totalAmount: Number(r.totalAmount || 0),
        topHeroName: topHero,
        bidsCount: Number(r.bidsCount || 0),
      };
    });
  }

  // --- HERO SUGGESTIONS / REQUESTS ---
  public async createRequest(data: {
    name: string;
    region: 'South' | 'North';
    industry: Industry;
    reason?: string;
    requestedBy: string;
  }): Promise<HeroRequest> {
    await this.ensureInitialized();
    const reqCol = await getHeroRequestsCollection();
    const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newReq: HeroRequestDocument = {
      id,
      name: data.name,
      region: data.region,
      industry: data.industry,
      reason: data.reason,
      requestedBy: data.requestedBy || 'cinema_fan',
      requestedAt: now,
      status: 'PENDING',
      votesCount: 1,
      updatedAt: now,
    };

    await reqCol.insertOne(newReq);

    return {
      id,
      name: newReq.name,
      region: newReq.region,
      industry: newReq.industry,
      reason: newReq.reason,
      requestedBy: newReq.requestedBy,
      requestedAt: newReq.requestedAt,
      status: newReq.status,
      votesCount: newReq.votesCount,
    };
  }

  public async getRequests(): Promise<HeroRequest[]> {
    await this.ensureInitialized();
    const reqCol = await getHeroRequestsCollection();
    const rows = await reqCol.find().sort({ requestedAt: -1 }).toArray();

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      region: r.region,
      industry: r.industry,
      reason: r.reason,
      requestedBy: r.requestedBy,
      requestedAt: r.requestedAt,
      status: r.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      votesCount: r.votesCount,
    }));
  }

  public async approveRequest(id: string): Promise<Hero> {
    await this.ensureInitialized();
    const reqCol = await getHeroRequestsCollection();
    const rawReq = await reqCol.findOne({ id });
    if (!rawReq) throw new Error(`Hero suggestion with ID '${id}' not found`);

    const now = new Date().toISOString();
    await reqCol.updateOne({ id }, { $set: { status: 'APPROVED', updatedAt: now } });

    // Create the new hero in MongoDB
    return await this.createHero({
      name: rawReq.name,
      displayName: rawReq.name,
      region: rawReq.region,
      industry: rawReq.industry,
      titleTag: 'Superstar',
      latestBlockbuster: 'Upcoming Feature',
      bio: rawReq.reason || 'Indian cinema stalwart suggested by the community.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200',
      active: true,
    });
  }

  public async rejectRequest(id: string): Promise<void> {
    await this.ensureInitialized();
    const reqCol = await getHeroRequestsCollection();
    const now = new Date().toISOString();
    await reqCol.updateOne({ id }, { $set: { status: 'REJECTED', updatedAt: now } });
  }

  // --- PLATFORM STATS ---
  public async getStats(): Promise<PlatformStats> {
    await this.ensureInitialized();
    const bidsCol = await getBidsCollection();
    const heroesCol = await getHeroesCollection();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const statsAgg = await bidsCol
      .aggregate<{
        totalVolume: number;
        totalBids: number;
      }>([
        { $match: { status: 'PAID' } },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: '$amount' },
            totalBids: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const todayAgg = await bidsCol
      .aggregate<{ todayVolume: number }>([
        {
          $match: {
            status: 'PAID',
            createdAt: { $gte: startOfToday.toISOString() },
          },
        },
        {
          $group: {
            _id: null,
            todayVolume: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    const distinctSupporters = await bidsCol.distinct('username', { status: 'PAID' });
    const heroCount = await heroesCol.countDocuments({ active: true });

    const heroes = await this.getHeroes();
    const southHeroes = heroes.filter((h) => h.region === 'South');
    const northHeroes = heroes.filter((h) => h.region === 'North');

    const topSouth = southHeroes[0] || { name: 'None', totalBidAmount: 0, currentRank: 0 };
    const topNorth = northHeroes[0] || { name: 'None', totalBidAmount: 0, currentRank: 0 };

    return {
      totalVolume: Number(statsAgg[0]?.totalVolume || 0),
      todayVolume: Number(todayAgg[0]?.todayVolume || 0),
      totalBids: Number(statsAgg[0]?.totalBids || 0),
      totalHeroes: heroCount,
      totalSupporters: distinctSupporters.length,
      onlineCount: Math.max(12, Math.floor(Math.random() * 20) + 115),
      topSouthHero: { name: topSouth.name, amount: topSouth.totalBidAmount, rank: topSouth.currentRank },
      topNorthHero: { name: topNorth.name, amount: topNorth.totalBidAmount, rank: topNorth.currentRank },
    };
  }

  // --- PROMOTIONAL BASELINE / INITIAL PUSH ---
  public async updateHeroInitialPush(params: {
    heroId: string;
    initialPushAmount: number;
    reason?: string;
    updatedBy?: string;
  }): Promise<{ hero: Hero; adjustment: PromoAdjustment }> {
    await this.ensureInitialized();
    const { heroId, initialPushAmount, reason, updatedBy } = params;

    if (isNaN(initialPushAmount) || initialPushAmount < 0) {
      throw new Error('Initial push amount must be a non-negative number');
    }

    const client = await getMongoClient();
    const session = client.startSession();

    try {
      let adjustmentDoc: PromoAdjustment | null = null;

      await session.withTransaction(async () => {
        const heroesCol = client.db('cinebid').collection<HeroDocument>('heroes');
        const promoCol = client.db('cinebid').collection<PromoAdjustmentDocument>('promo_adjustments');

        const hero = await heroesCol.findOne({ id: heroId }, { session });
        if (!hero) {
          throw new Error(`Hero with ID '${heroId}' not found`);
        }

        const previousPushAmount = Number(hero.initialPushAmount || 0);
        const realPaidAmount = Number(hero.realPaidAmount || 0);
        const todayRealAmount = Number(hero.todayRealAmount || 0);
        const weekRealAmount = Number(hero.weekRealAmount || 0);

        const newTotalAmount = realPaidAmount + initialPushAmount;
        const newTodayAmount = todayRealAmount + initialPushAmount;
        const newWeekAmount = weekRealAmount + initialPushAmount;
        const delta = initialPushAmount - previousPushAmount;
        const now = new Date().toISOString();

        await heroesCol.updateOne(
          { id: heroId },
          {
            $set: {
              initialPushAmount,
              totalBidAmount: newTotalAmount,
              todayBidAmount: newTodayAmount,
              weekBidAmount: newWeekAmount,
              updatedAt: now,
            },
          },
          { session }
        );

        const adjustmentId = `adj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        adjustmentDoc = {
          id: adjustmentId,
          heroId: hero.id,
          heroName: hero.name,
          previousPushAmount,
          newPushAmount: initialPushAmount,
          delta,
          updatedBy: updatedBy || 'admin',
          reason: reason || 'Promotional baseline adjustment',
          createdAt: now,
        };

        await promoCol.insertOne(adjustmentDoc, { session });
      });

      const hero = await this.getHeroById(heroId);
      if (!hero || !adjustmentDoc) {
        throw new Error('Failed to retrieve updated hero after initial push update');
      }

      // Re-sort all active heroes to determine new ranks
      const allRanked = await this.getHeroes();
      const updatedHeroWithRank = allRanked.find((h) => h.id === heroId) || hero;

      // Broadcast update via SSE
      sseEmitter.emit('bid_event', {
        type: 'INITIAL_PUSH_UPDATED',
        heroId: hero.id,
        heroName: hero.name,
        initialPushAmount,
        totalBidAmount: updatedHeroWithRank.totalBidAmount,
        timestamp: new Date().toISOString(),
      });

      return {
        hero: updatedHeroWithRank,
        adjustment: adjustmentDoc,
      };
    } finally {
      await session.endSession();
    }
  }

  public async getAdminFinancials(): Promise<AdminFinancials> {
    await this.ensureInitialized();
    const client = await getMongoClient();
    const db = client.db('cinebid');

    // 1. Calculate real payments total from PAID bids
    const bidsCol = db.collection<BidDocument>('bids');
    const bidsAgg = await bidsCol
      .aggregate<{ totalReal: number; count: number }>([
        { $match: { status: 'PAID' } },
        {
          $group: {
            _id: null,
            totalReal: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const totalRealPayments = bidsAgg[0]?.totalReal || 0;
    const realPaymentsCount = bidsAgg[0]?.count || 0;

    // 2. Calculate promotional push total from heroes
    const heroesCol = db.collection<HeroDocument>('heroes');
    const heroes = await heroesCol.find({ active: true }).toArray();
    const totalPromoPush = heroes.reduce((acc, h) => acc + Number(h.initialPushAmount || 0), 0);
    const totalDisplayVolume = totalRealPayments + totalPromoPush;

    return {
      totalRealPayments,
      totalPromoPush,
      totalDisplayVolume,
      realPaymentsCount,
      heroesCount: heroes.length,
    };
  }

  public async getPromoAdjustments(limit = 50): Promise<PromoAdjustment[]> {
    await this.ensureInitialized();
    const promoCol = await getPromoAdjustmentsCollection();
    const adjustments = await promoCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return adjustments.map((a) => ({
      id: a.id,
      heroId: a.heroId,
      heroName: a.heroName,
      previousPushAmount: Number(a.previousPushAmount || 0),
      newPushAmount: Number(a.newPushAmount || 0),
      delta: Number(a.delta || 0),
      updatedBy: a.updatedBy || 'admin',
      reason: a.reason,
      createdAt: a.createdAt,
    }));
  }

  public async verifyAdminPassword(password: string): Promise<boolean> {
    await this.ensureInitialized();
    return await verifyAdminPasswordInDb(password);
  }

  // --- RESET ALL DATA TO STRICT ₹0 BASELINE ---
  public async resetToCleanState(): Promise<void> {
    const client = await getMongoClient();
    const db = client.db('cinebid');

    await db.collection('bids').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('activity_events').deleteMany({});
    await db.collection('hero_requests').deleteMany({});
    await db.collection('webhook_events').deleteMany({});
    await db.collection('heroes').deleteMany({});

    await seedInitialHeroesZeroRs();
  }
}

// Global Singleton Database Instance with dynamic prototype refresh for Turbopack HMR
declare global {
  var __cinebid_mongo_db: MongoDatabaseEngine | undefined;
}

global.__cinebid_mongo_db = new MongoDatabaseEngine();
export const db = global.__cinebid_mongo_db;
