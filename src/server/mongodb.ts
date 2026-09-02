import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import crypto from 'crypto';
import { Hero, Bid, ActivityEvent, HeroRequest, PaymentRecord, PromoAdjustment } from '@/types';
import { INITIAL_HEROES } from '@/data/initialHeroes';

// MongoDB collection document interfaces
export interface HeroDocument extends Omit<Hero, 'currentRank' | 'previousRank'> {
  _id?: ObjectId;
  currentRank: number;
  previousRank: number;
  createdAt: string;
  updatedAt: string;
}

export interface BidDocument extends Bid {
  _id?: ObjectId;
}

export interface PaymentDocument extends PaymentRecord {
  _id?: ObjectId;
  updatedAt?: string;
}

export interface ActivityDocument extends ActivityEvent {
  _id?: ObjectId;
}

export interface HeroRequestDocument extends HeroRequest {
  _id?: ObjectId;
  updatedAt?: string;
}

export interface WebhookEventDocument {
  _id?: ObjectId;
  webhookId: string;
  eventType: string;
  payload?: string;
  createdAt: string;
}

export interface PromoAdjustmentDocument extends PromoAdjustment {
  _id?: ObjectId;
}

export interface AdminAuthDocument {
  _id?: ObjectId;
  key: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

function resolveMongoUri(): string {
  const rawUri = process.env.MONGO_URI || '';
  const username = process.env.MONGODB_USERNAME || '';
  const password = process.env.MONGODB_PWD || '';

  let resolved = rawUri;

  if (resolved.includes('<db_username>') && username) {
    resolved = resolved.replace('<db_username>', encodeURIComponent(username));
  }
  if (resolved.includes('<db_password>') && password) {
    resolved = resolved.replace('<db_password>', encodeURIComponent(password));
  }

  // If URI doesn't have credentials in it, but username and password are provided
  if (!resolved && username && password) {
    resolved = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.ltf5mr6.mongodb.net/cinebid?retryWrites=true&w=majority&appName=Cluster0`;
  }

  // Ensure default DB name is present in URI if missing before query parameters
  if (resolved.includes('mongodb.net/?') || resolved.endsWith('mongodb.net/')) {
    resolved = resolved.replace('mongodb.net/', 'mongodb.net/cinebid');
  }

  return resolved;
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = resolveMongoUri();
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

if (!uri) {
  console.warn('⚠️ MONGO_URI or MONGODB credentials are not defined in environment variables.');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return await clientPromise;
}

export async function getDatabase(dbName = 'cinebid'): Promise<Db> {
  const cli = await getMongoClient();
  return cli.db(dbName);
}

// Database collection accessors
export async function getHeroesCollection(): Promise<Collection<HeroDocument>> {
  const db = await getDatabase();
  return db.collection<HeroDocument>('heroes');
}

export async function getBidsCollection(): Promise<Collection<BidDocument>> {
  const db = await getDatabase();
  return db.collection<BidDocument>('bids');
}

export async function getPaymentsCollection(): Promise<Collection<PaymentDocument>> {
  const db = await getDatabase();
  return db.collection<PaymentDocument>('payments');
}

export async function getActivityCollection(): Promise<Collection<ActivityDocument>> {
  const db = await getDatabase();
  return db.collection<ActivityDocument>('activity_events');
}

export async function getHeroRequestsCollection(): Promise<Collection<HeroRequestDocument>> {
  const db = await getDatabase();
  return db.collection<HeroRequestDocument>('hero_requests');
}

export async function getWebhookEventsCollection(): Promise<Collection<WebhookEventDocument>> {
  const db = await getDatabase();
  return db.collection<WebhookEventDocument>('webhook_events');
}

export async function getPromoAdjustmentsCollection(): Promise<Collection<PromoAdjustmentDocument>> {
  const db = await getDatabase();
  return db.collection<PromoAdjustmentDocument>('promo_adjustments');
}

export async function getAdminAuthCollection(): Promise<Collection<AdminAuthDocument>> {
  const db = await getDatabase();
  return db.collection<AdminAuthDocument>('admin_auth');
}

export function hashAdminPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export async function verifyAdminPasswordInDb(password: string): Promise<boolean> {
  if (!password) return false;
  const authCol = await getAdminAuthCollection();
  const authDoc = await authCol.findOne({ key: 'admin_master_password' });
  if (!authDoc) {
    if (password === 'Chakresh@1986') {
      const { hash, salt } = hashAdminPassword('Chakresh@1986');
      await authCol.insertOne({
        key: 'admin_master_password',
        passwordHash: hash,
        salt,
        updatedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }
  const { hash } = hashAdminPassword(password, authDoc.salt);
  return hash === authDoc.passwordHash;
}

let indexesInitialized = false;

// Initialize MongoDB indexes and baseline seed data with ₹0
export async function initializeDatabase(): Promise<void> {
  if (indexesInitialized) return;

  try {
    const db = await getDatabase();

    // 1. Heroes collection indexes
    const heroesCol = db.collection<HeroDocument>('heroes');
    await heroesCol.createIndex({ id: 1 }, { unique: true });
    await heroesCol.createIndex({ active: 1, totalBidAmount: -1 });
    await heroesCol.createIndex({ region: 1 });
    await heroesCol.createIndex({ industry: 1 });

    // 2. Bids collection indexes
    const bidsCol = db.collection<BidDocument>('bids');
    await bidsCol.createIndex({ heroId: 1, status: 1 });
    await bidsCol.createIndex({ username: 1 });
    await bidsCol.createIndex({ createdAt: -1 });

    // 3. Payments collection indexes
    const paymentsCol = db.collection<PaymentDocument>('payments');
    await paymentsCol.createIndex({ sessionId: 1 }, { unique: true });
    await paymentsCol.createIndex({ paymentId: 1 });
    await paymentsCol.createIndex({ status: 1 });

    // 4. Activity events collection index
    const actCol = db.collection<ActivityDocument>('activity_events');
    await actCol.createIndex({ timestamp: -1 });

    // 5. Hero requests collection indexes
    const reqCol = db.collection<HeroRequestDocument>('hero_requests');
    await reqCol.createIndex({ requestedAt: -1 });
    await reqCol.createIndex({ status: 1 });

    // 6. Webhook events collection index
    const whCol = db.collection<WebhookEventDocument>('webhook_events');
    await whCol.createIndex({ webhookId: 1 }, { unique: true });

    // 7. Promo adjustments collection index
    const promoCol = db.collection<PromoAdjustmentDocument>('promo_adjustments');
    await promoCol.createIndex({ heroId: 1, createdAt: -1 });

    // 8. Admin Auth seed with Chakresh@1986
    const authCol = db.collection<AdminAuthDocument>('admin_auth');
    const existingAuth = await authCol.findOne({ key: 'admin_master_password' });
    if (!existingAuth) {
      const { hash, salt } = hashAdminPassword('Chakresh@1986');
      await authCol.insertOne({
        key: 'admin_master_password',
        passwordHash: hash,
        salt,
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed initial 15 canonical heroes if empty (strictly at ₹0 baseline)
    const existingHeroCount = await heroesCol.countDocuments();
    if (existingHeroCount === 0) {
      await seedInitialHeroesZeroRs();
    }

    indexesInitialized = true;
  } catch (err) {
    console.error('Failed to initialize MongoDB indexes or initial seed:', err);
    throw err;
  }
}

// Seed or reset all 15 heroes starting strictly at ₹0
export async function seedInitialHeroesZeroRs(): Promise<void> {
  const heroesCol = await getHeroesCollection();
  const now = new Date().toISOString();

  const heroDocs: HeroDocument[] = INITIAL_HEROES.map((h, index) => ({
    id: h.id,
    name: h.name,
    displayName: h.displayName || h.name,
    avatarUrl: h.avatarUrl,
    coverUrl: h.coverUrl,
    region: h.region,
    industry: h.industry,
    titleTag: h.titleTag,
    latestBlockbuster: h.latestBlockbuster || 'Upcoming Feature',
    bio: h.bio || 'Indian cinema icon.',
    totalBidAmount: 0,
    todayBidAmount: 0,
    weekBidAmount: 0,
    totalBidCount: 0,
    supportersCount: 0,
    currentRank: index + 1,
    previousRank: index + 1,
    highestSingleBid: 0,
    lastBidAt: '',
    active: true,
    topSupporters: [],
    createdAt: now,
    updatedAt: now,
  }));

  for (const doc of heroDocs) {
    await heroesCol.updateOne(
      { id: doc.id },
      { $setOnInsert: doc },
      { upsert: true }
    );
  }
}
