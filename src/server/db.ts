import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { DatabaseSync } from 'node:sqlite';
import { Hero, Bid, ActivityEvent, HeroRequest, Region, Industry, TimeWindow, PlatformStats, SupporterContribution } from '@/types';
import { INITIAL_HEROES } from '@/data/initialHeroes';

// Event emitter for Server-Sent Events (SSE)
export const sseEmitter = new EventEmitter();
sseEmitter.setMaxListeners(100);

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DATA_DIR, 'cinebid.db');

class DatabaseEngine {
  private _db: DatabaseSync | null = null;

  private getDb(): DatabaseSync {
    if (!this._db) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      this._db = new DatabaseSync(DB_PATH);
      this._db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 10000;
        PRAGMA synchronous = NORMAL;
      `);
      this.initializeSchema(this._db);
      this.seedInitialHeroesIfEmpty(this._db);
    }
    return this._db;
  }

  private initializeSchema(db: DatabaseSync) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS heroes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        cover_url TEXT NOT NULL,
        region TEXT NOT NULL,
        industry TEXT NOT NULL,
        title_tag TEXT NOT NULL,
        latest_blockbuster TEXT,
        bio TEXT,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        hero_id TEXT NOT NULL,
        hero_name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        user_avatar TEXT,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        note TEXT,
        status TEXT DEFAULT 'PAID',
        rank_at_bid_time INTEGER DEFAULT 0,
        result_rank INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_bids_hero_id ON bids(hero_id);
      CREATE INDEX IF NOT EXISTS idx_bids_username ON bids(username);
      CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at);

      CREATE TABLE IF NOT EXISTS activity_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        hero_id TEXT NOT NULL,
        hero_name TEXT NOT NULL,
        hero_avatar TEXT NOT NULL,
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        user_avatar TEXT,
        amount INTEGER,
        previous_rank INTEGER,
        new_rank INTEGER,
        target_username TEXT,
        timestamp TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_events(timestamp DESC);

      CREATE TABLE IF NOT EXISTS hero_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        region TEXT NOT NULL,
        industry TEXT NOT NULL,
        reason TEXT,
        requested_by TEXT NOT NULL,
        requested_at TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        votes_count INTEGER DEFAULT 1
      );
    `);
  }

  private seedInitialHeroesIfEmpty(db: DatabaseSync) {
    const rowCountQuery = db.prepare('SELECT COUNT(*) as count FROM heroes');
    const result = rowCountQuery.get() as { count: number };
    
    if (result.count === 0) {
      const insertStmt = db.prepare(`
        INSERT INTO heroes (
          id, name, display_name, avatar_url, cover_url, region, industry, title_tag, latest_blockbuster, bio, active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      for (const h of INITIAL_HEROES) {
        insertStmt.run(
          h.id,
          h.name,
          h.displayName || h.name,
          h.avatarUrl,
          h.coverUrl,
          h.region,
          h.industry,
          h.titleTag,
          h.latestBlockbuster,
          h.bio,
          h.active ? 1 : 0,
          now
        );
      }
    }
  }

  public resetToCleanState() {
    const db = this.getDb();
    db.exec(`
      DELETE FROM bids;
      DELETE FROM activity_events;
      DELETE FROM hero_requests;
      DELETE FROM heroes;
    `);
    this.seedInitialHeroesIfEmpty(db);
  }

  // --- HERO AGGREGATION & RETRIEVAL ---
  private buildHeroObject(rawHero: {
    id: string;
    name: string;
    display_name: string;
    avatar_url: string;
    cover_url: string;
    region: string;
    industry: string;
    title_tag: string;
    latest_blockbuster: string;
    bio: string;
    active: number;
    created_at: string;
  }): Hero {
    const db = this.getDb();
    // Calculate total, today, week bid amount, counts, highest bid, last bid
    const statsQuery = db.prepare(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalBidAmount,
        COALESCE(SUM(CASE WHEN date(created_at) = date('now') THEN amount ELSE 0 END), 0) as todayBidAmount,
        COALESCE(SUM(CASE WHEN datetime(created_at) >= datetime('now', '-7 days') THEN amount ELSE 0 END), 0) as weekBidAmount,
        COUNT(*) as totalBidCount,
        COUNT(DISTINCT username) as supportersCount,
        COALESCE(MAX(amount), 0) as highestSingleBid,
        COALESCE(MAX(created_at), '') as lastBidAt
      FROM bids
      WHERE hero_id = ? AND status = 'PAID'
    `);

    const stats = statsQuery.get(rawHero.id) as {
      totalBidAmount: number;
      todayBidAmount: number;
      weekBidAmount: number;
      totalBidCount: number;
      supportersCount: number;
      highestSingleBid: number;
      lastBidAt: string;
    };

    // Calculate top supporters for this hero
    const supportersQuery = db.prepare(`
      SELECT 
        user_id as userId,
        username,
        user_avatar as avatarUrl,
        SUM(amount) as totalAmount,
        COUNT(*) as bidCount,
        MAX(created_at) as lastBidAt
      FROM bids
      WHERE hero_id = ? AND status = 'PAID'
      GROUP BY username
      ORDER BY totalAmount DESC
      LIMIT 10
    `);

    const topSupporters = supportersQuery.all(rawHero.id) as unknown as SupporterContribution[];

    return {
      id: rawHero.id,
      name: rawHero.name,
      displayName: rawHero.display_name,
      avatarUrl: rawHero.avatar_url,
      coverUrl: rawHero.cover_url,
      region: rawHero.region as 'South' | 'North',
      industry: rawHero.industry as Industry,
      titleTag: rawHero.title_tag,
      latestBlockbuster: rawHero.latest_blockbuster || '',
      bio: rawHero.bio || '',
      totalBidAmount: Number(stats?.totalBidAmount || 0),
      todayBidAmount: Number(stats?.todayBidAmount || 0),
      weekBidAmount: Number(stats?.weekBidAmount || 0),
      totalBidCount: Number(stats?.totalBidCount || 0),
      supportersCount: Number(stats?.supportersCount || 0),
      currentRank: 1,
      previousRank: 1,
      highestSingleBid: Number(stats?.highestSingleBid || 0),
      lastBidAt: stats?.lastBidAt || '',
      active: rawHero.active === 1,
      topSupporters: topSupporters || [],
    };
  }

  public getHeroes(filter?: {
    region?: Region;
    industry?: Industry;
    timeWindow?: TimeWindow;
    search?: string;
    sortBy?: string;
  }): Hero[] {
    const db = this.getDb();
    const rawHeroes = db.prepare('SELECT * FROM heroes WHERE active = 1').all() as any[];
    let heroes = rawHeroes.map((rh) => this.buildHeroObject(rh));

    if (filter?.region && filter.region !== 'All') {
      heroes = heroes.filter((h) => h.region === filter.region);
    }

    if (filter?.industry && filter.industry !== 'All') {
      heroes = heroes.filter((h) => h.industry === filter.industry);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      heroes = heroes.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.titleTag.toLowerCase().includes(q) ||
          h.latestBlockbuster.toLowerCase().includes(q)
      );
    }

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

  public getHeroById(id: string): Hero | null {
    const db = this.getDb();
    const rawHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id) as any;
    if (!rawHero) return null;

    const allHeroes = this.getHeroes();
    const heroWithRank = allHeroes.find((h) => h.id === id);
    if (heroWithRank) return heroWithRank;

    return this.buildHeroObject(rawHero);
  }

  // --- ATOMIC BID EXECUTION ---
  public createBid(params: {
    heroId: string;
    amount: number;
    userId: string;
    username: string;
    userAvatar?: string;
    note?: string;
  }): {
    bid: Bid;
    hero: Hero;
    event: ActivityEvent;
    previousRank: number;
    newRank: number;
    becameRankOne: boolean;
  } {
    const { heroId, amount, userId, username, userAvatar, note } = params;

    if (amount <= 0) {
      throw new Error('Bid amount must be greater than 0');
    }

    const db = this.getDb();
    const rawHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(heroId) as any;
    if (!rawHero) {
      throw new Error(`Hero with ID ${heroId} not found`);
    }

    const heroesBefore = this.getHeroes();
    const targetHeroBefore = heroesBefore.find((h) => h.id === heroId);
    const previousRank = targetHeroBefore ? targetHeroBefore.currentRank : heroesBefore.length;
    const previousLeader = heroesBefore[0] || { id: '', totalBidAmount: 0 };

    const bidId = `bid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    // Insert Bid Record
    const insertBid = db.prepare(`
      INSERT INTO bids (
        id, hero_id, hero_name, user_id, username, user_avatar, amount, currency, note, status, rank_at_bid_time, result_rank, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBid.run(
      bidId,
      heroId,
      rawHero.name,
      userId || 'anon-user',
      username || 'fan',
      userAvatar || null,
      amount,
      'INR',
      note || null,
      'PAID',
      previousRank,
      1, // temporarily set, updated after ranking
      now
    );

    // Recalculate ranks
    const heroesAfter = this.getHeroes();
    const targetHeroAfter = heroesAfter.find((h) => h.id === heroId)!;
    const newRank = targetHeroAfter.currentRank;
    const becameRankOne = newRank === 1 && previousLeader.id !== heroId && previousLeader.totalBidAmount > 0;

    // Update result_rank in bid
    db.prepare('UPDATE bids SET result_rank = ? WHERE id = ?').run(newRank, bidId);

    const newBid: Bid = {
      id: bidId,
      heroId,
      heroName: rawHero.name,
      userId: userId || 'anon-user',
      username: username || 'fan',
      userAvatar,
      amount,
      currency: 'INR',
      createdAt: now,
      status: 'PAID',
      rankAtBidTime: previousRank,
      resultRank: newRank,
      note,
    };

    // Create Activity Event
    const eventId = becameRankOne ? `act-${Date.now()}-overtake` : `act-${Date.now()}-bid`;
    const eventType = becameRankOne ? 'RANK_1_OVERTAKE' : 'BID_PLACED';

    const insertEvent = db.prepare(`
      INSERT INTO activity_events (
        id, type, hero_id, hero_name, hero_avatar, user_id, username, user_avatar, amount, previous_rank, new_rank, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEvent.run(
      eventId,
      eventType,
      rawHero.id,
      rawHero.name,
      rawHero.avatar_url,
      userId || 'anon-user',
      username || 'fan',
      userAvatar || null,
      amount,
      previousRank,
      newRank,
      now
    );

    const newEvent: ActivityEvent = {
      id: eventId,
      type: eventType,
      heroId: rawHero.id,
      heroName: rawHero.name,
      heroAvatar: rawHero.avatar_url,
      userId: userId || 'anon-user',
      username: username || 'fan',
      userAvatar,
      amount,
      previousRank,
      newRank,
      timestamp: now,
    };

    // Broadcast SSE
    sseEmitter.emit('bid_event', {
      bid: newBid,
      hero: targetHeroAfter,
      event: newEvent,
      heroes: heroesAfter,
    });

    return {
      bid: newBid,
      hero: targetHeroAfter,
      event: newEvent,
      previousRank,
      newRank,
      becameRankOne,
    };
  }

  // --- ACTIVITY FEED ---
  public getActivity(limit = 50): ActivityEvent[] {
    const db = this.getDb();
    const rawEvents = db.prepare(`
      SELECT 
        id,
        type,
        hero_id as heroId,
        hero_name as heroName,
        hero_avatar as heroAvatar,
        user_id as userId,
        username,
        user_avatar as userAvatar,
        amount,
        previous_rank as previousRank,
        new_rank as newRank,
        target_username as targetUsername,
        timestamp
      FROM activity_events
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit) as unknown as ActivityEvent[];

    return rawEvents;
  }

  // --- BIDS HISTORY ---
  public getBids(heroId?: string, limit = 50): Bid[] {
    const db = this.getDb();
    if (heroId) {
      const raw = db.prepare(`
        SELECT 
          id,
          hero_id as heroId,
          hero_name as heroName,
          user_id as userId,
          username,
          user_avatar as userAvatar,
          amount,
          currency,
          note,
          status,
          rank_at_bid_time as rankAtBidTime,
          result_rank as resultRank,
          created_at as createdAt
        FROM bids
        WHERE hero_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `).all(heroId, limit) as unknown as Bid[];
      return raw;
    }

    const raw = db.prepare(`
      SELECT 
        id,
        hero_id as heroId,
        hero_name as heroName,
        user_id as userId,
        username,
        user_avatar as userAvatar,
        amount,
        currency,
        note,
        status,
        rank_at_bid_time as rankAtBidTime,
        result_rank as resultRank,
        created_at as createdAt
      FROM bids
      ORDER BY created_at DESC
      LIMIT ?
    `).all(limit) as unknown as Bid[];

    return raw;
  }

  // --- TOP SUPPORTERS GLOBAL ---
  public getGlobalTopSupporters() {
    const db = this.getDb();
    const rows = db.prepare(`
      SELECT 
        username,
        SUM(amount) as totalAmount,
        COUNT(*) as bidsCount,
        (
          SELECT hero_name 
          FROM bids b2 
          WHERE b2.username = b.username AND b2.status = 'PAID'
          GROUP BY hero_name 
          ORDER BY SUM(amount) DESC 
          LIMIT 1
        ) as topHeroName
      FROM bids b
      WHERE status = 'PAID'
      GROUP BY username
      ORDER BY totalAmount DESC
      LIMIT 50
    `).all() as any[];

    return rows.map((r) => ({
      username: r.username,
      totalAmount: Number(r.totalAmount || 0),
      topHeroName: r.topHeroName || 'Cinema',
      bidsCount: Number(r.bidsCount || 0),
    }));
  }

  // --- HERO REQUESTS ---
  public createRequest(data: {
    name: string;
    region: 'South' | 'North';
    industry: Industry;
    reason?: string;
    requestedBy: string;
  }): HeroRequest {
    const db = this.getDb();
    const id = `req-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO hero_requests (
        id, name, region, industry, reason, requested_by, requested_at, status, votes_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.region,
      data.industry,
      data.reason || null,
      data.requestedBy,
      now,
      'PENDING',
      1
    );

    return {
      id,
      name: data.name,
      region: data.region,
      industry: data.industry,
      reason: data.reason,
      requestedBy: data.requestedBy,
      requestedAt: now,
      status: 'PENDING',
      votesCount: 1,
    };
  }

  public getRequests(): HeroRequest[] {
    const db = this.getDb();
    const rows = db.prepare(`
      SELECT 
        id,
        name,
        region,
        industry,
        reason,
        requested_by as requestedBy,
        requested_at as requestedAt,
        status,
        votes_count as votesCount
      FROM hero_requests
      ORDER BY requested_at DESC
    `).all() as unknown as HeroRequest[];

    return rows;
  }

  public approveRequest(id: string): Hero {
    const db = this.getDb();
    const rawReq = db.prepare('SELECT * FROM hero_requests WHERE id = ?').get(id) as any;
    if (!rawReq) throw new Error('Request not found');

    db.prepare("UPDATE hero_requests SET status = 'APPROVED' WHERE id = ?").run(id);

    const newHeroId = `hero-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO heroes (
        id, name, display_name, avatar_url, cover_url, region, industry, title_tag, latest_blockbuster, bio, active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newHeroId,
      rawReq.name,
      rawReq.name,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200',
      rawReq.region,
      rawReq.industry,
      'Superstar',
      'Upcoming Feature',
      rawReq.reason || 'Indian cinema icon added via community recommendation.',
      1,
      now
    );

    return this.getHeroById(newHeroId)!;
  }

  // --- ADMIN HERO MANAGEMENT ---
  public createHero(heroData: Partial<Hero>): Hero {
    const db = this.getDb();
    const id = `hero-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO heroes (
        id, name, display_name, avatar_url, cover_url, region, industry, title_tag, latest_blockbuster, bio, active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      heroData.name || 'New Hero',
      heroData.displayName || heroData.name || 'New Hero',
      heroData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      heroData.coverUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200',
      heroData.region || 'South',
      heroData.industry || 'Telugu',
      heroData.titleTag || 'Superstar',
      heroData.latestBlockbuster || 'Upcoming Feature',
      heroData.bio || 'Indian cinema icon.',
      heroData.active !== false ? 1 : 0,
      now
    );

    return this.getHeroById(id)!;
  }

  public updateHero(id: string, updates: Partial<Hero>): Hero {
    const db = this.getDb();
    const rawHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id) as any;
    if (!rawHero) throw new Error('Hero not found');

    if (updates.name !== undefined) db.prepare('UPDATE heroes SET name = ? WHERE id = ?').run(updates.name, id);
    if (updates.displayName !== undefined) db.prepare('UPDATE heroes SET display_name = ? WHERE id = ?').run(updates.displayName, id);
    if (updates.avatarUrl !== undefined) db.prepare('UPDATE heroes SET avatar_url = ? WHERE id = ?').run(updates.avatarUrl, id);
    if (updates.coverUrl !== undefined) db.prepare('UPDATE heroes SET cover_url = ? WHERE id = ?').run(updates.coverUrl, id);
    if (updates.titleTag !== undefined) db.prepare('UPDATE heroes SET title_tag = ? WHERE id = ?').run(updates.titleTag, id);
    if (updates.bio !== undefined) db.prepare('UPDATE heroes SET bio = ? WHERE id = ?').run(updates.bio, id);
    if (updates.active !== undefined) db.prepare('UPDATE heroes SET active = ? WHERE id = ?').run(updates.active ? 1 : 0, id);

    return this.getHeroById(id)!;
  }

  // --- PLATFORM STATS ---
  public getStats(): PlatformStats {
    const db = this.getDb();
    const stats = db.prepare(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalVolume,
        COALESCE(SUM(CASE WHEN date(created_at) = date('now') THEN amount ELSE 0 END), 0) as todayVolume,
        COUNT(*) as totalBids,
        COUNT(DISTINCT username) as totalSupporters
      FROM bids
      WHERE status = 'PAID'
    `).get() as {
      totalVolume: number;
      todayVolume: number;
      totalBids: number;
      totalSupporters: number;
    };

    const heroCountRow = db.prepare('SELECT COUNT(*) as count FROM heroes WHERE active = 1').get() as { count: number };

    const heroes = this.getHeroes();
    const southHeroes = heroes.filter((h) => h.region === 'South');
    const northHeroes = heroes.filter((h) => h.region === 'North');

    const topSouth = southHeroes[0] || { name: 'None', totalBidAmount: 0, currentRank: 0 };
    const topNorth = northHeroes[0] || { name: 'None', totalBidAmount: 0, currentRank: 0 };

    return {
      totalVolume: Number(stats?.totalVolume || 0),
      todayVolume: Number(stats?.todayVolume || 0),
      totalBids: Number(stats?.totalBids || 0),
      totalHeroes: Number(heroCountRow?.count || 0),
      totalSupporters: Number(stats?.totalSupporters || 0),
      onlineCount: Math.max(12, Math.floor(Math.random() * 20) + 115),
      topSouthHero: { name: topSouth.name, amount: topSouth.totalBidAmount, rank: topSouth.currentRank },
      topNorthHero: { name: topNorth.name, amount: topNorth.totalBidAmount, rank: topNorth.currentRank },
    };
  }
}

// Global Singleton Database Instance
const globalDb = global as unknown as { __cinebid_db?: DatabaseEngine };
export const db = globalDb.__cinebid_db || new DatabaseEngine();
if (process.env.NODE_ENV !== 'production') {
  globalDb.__cinebid_db = db;
}
