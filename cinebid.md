# Cinebid - Complete Product Flow

> Product reference: Outbid.lol
>
> Cinebid adapts the core **pay-to-rank / outbid** mechanic of Outbid.lol into a cinema fandom product where users put bids behind their favourite Indian heroes.

---

## 1. What Outbid.lol Actually Does

Outbid.lol is a public leaderboard where **rank is determined by how much money has been paid**. It is not a traditional auction where one item is sold to the winner. The payment buys a position on a public ranking. The core site has a simple claim interface, public ranked listings, a live activity feed, and separate time-window boards. citeturn429685view0turn329882view0

Its important mechanics are:

- A user enters a listing and an amount.
- The amount determines the position the listing can occupy.
- Taking #1 requires exceeding the current #1 by the required increment.
- A listing already on the board can raise its amount.
- When raising an existing listing, only the difference is charged.
- Equal amounts are ordered by who placed the amount first.
- The board has an all-time ranking and time-based rankings.
- Completed payments are what actually claim the rank.
- Payments are not refundable.
- Every payment creates a public ranking/activity event. citeturn329882view0

The important product lesson is:

**The competition itself is the product.**

Cinebid should therefore not become a normal "buy credits and vote" application. The visible fight for rank needs to be the central experience.

---

# 2. Cinebid Core Idea

## One-line concept

**Bid on the hero you love. Push them up the leaderboard. Get outbid. Fight back.**

Users do not buy the hero and users do not receive ownership of the hero.

They put money behind a hero. That contribution increases the hero's public ranking and makes the user's support visible.

Example:

```text
User A → ₹100 → Allu Arjun
User B → ₹250 → Allu Arjun
User C → ₹500 → Prabhas
User D → ₹1,000 → Allu Arjun
```

Cinebid then calculates hero rankings based on the defined Cinebid ranking metric.

---

# 3. Important Product Decision

There should be **two related rankings**, not one.

## A. Hero Leaderboard

This answers:

> Which heroes are being backed with the most money?

Example:

```text
#1 Allu Arjun       ₹1,350
#2 Prabhas          ₹1,120
#3 Mahesh Babu        ₹920
#4 Jr NTR             ₹740
#5 Ram Charan         ₹610
```

This is Cinebid's main public leaderboard.

## B. Supporter Leaderboard

This answers:

> Who is putting the most money behind heroes?

Example:

```text
#1 chakresh      ₹5,200   → Allu Arjun
#2 rahul         ₹4,100   → Prabhas
#3 arjun         ₹2,750   → Allu Arjun
```

This keeps the original Outbid-style personal competition alive.

The hero is the public object being ranked.
The user is the person creating the bid.

---

# 4. Hero Data Model

Every hero is a Cinebid-managed entity.

```text
Hero
├── id
├── name
├── displayName
├── profileImage
├── coverImage
├── profession
├── industry
├── bio
├── movies
├── totalBidAmount
├── totalBidCount
├── currentRank
├── supportersCount
├── active
├── createdAt
└── updatedAt
```

## Image ownership

Users **do not choose or upload the hero's primary image**.

Cinebid's admin selects the canonical image when creating a hero.

This keeps the entire platform visually consistent.

A user can suggest a hero, but the final hero profile and image are controlled by Cinebid.

---

# 5. High-Level Application Flow

```text
                         CINEBID
                            │
              ┌─────────────┴─────────────┐
              │                           │
           Discover                     Account
              │                           │
       Browse Heroes                Sign up / Login
              │                           │
              └─────────────┬─────────────┘
                            │
                      Select a Hero
                            │
                     Hero Detail Page
                            │
                       Enter Bid
                            │
                     Confirm Payment
                            │
                     Payment Success
                            │
                 ┌──────────┴──────────┐
                 │                     │
          Hero total increases   User support updates
                 │                     │
                 └──────────┬──────────┘
                            │
                       Recalculate Rank
                            │
                 ┌──────────┴──────────┐
                 │                     │
          Hero leaderboard      Supporter leaderboard
                 │                     │
                 └──────────┬──────────┘
                            │
                     Activity Feed
                            │
                     Share / Return
                            │
                       Outbid Again
```

---

# 6. Landing Page Flow

The homepage should feel extremely close to the **minimal, dense, competitive visual language of Outbid.lol**, but use cinema content instead of product listings.

## Header

```text
CINEBID        Heroes     Leaderboard     Activity     How It Works     [Login]
```

Optional authenticated state:

```text
CINEBID        Heroes     Leaderboard     Activity     [₹ Wallet] [Profile]
```

Do not turn the header into a conventional cinema website navigation bar.
The product is a leaderboard first.

---

# 7. Homepage Hero Section

The opening page should immediately communicate the mechanic.

```text
CINEBID

Back your favourite hero.
Outbid the rest.

The more the fans bid, the higher the hero climbs.

[ Explore Heroes ]   [ How It Works ]
```

Below it:

```text
LIVE CINEBID

#1  Allu Arjun        ₹1,28,500
#2  Prabhas             ₹96,200
#3  Mahesh Babu          ₹84,700
#4  Jr NTR               ₹72,400
#5  Ram Charan           ₹63,100
```

Then a live activity section:

```text
Latest Activity

@rahul backed Allu Arjun with ₹500       8 sec ago
@arjun backed Prabhas with ₹1,000        24 sec ago
@chakresh raised Allu Arjun by ₹250      41 sec ago
```

This mirrors the importance of the live/latest activity component on Outbid.lol. citeturn429685view0

---

# 8. Discover Heroes Flow

User clicks **Heroes**.

```text
Heroes

[ Search heroes... ]

Filters:
[ All ] [ Telugu ] [ Hindi ] [ Tamil ] [ Malayalam ] [ Kannada ]

Trending

┌──────────────┐
│ Hero Image   │
│ Allu Arjun   │
│ ₹1,28,500    │
│ Rank #1      │
│ 842 supporters│
│ [Back Hero]  │
└──────────────┘
```

Each hero card should expose the important competitive information immediately:

- hero image
- name
- current rank
- current total
- number of supporters
- recent change
- back button

Do not overload the cards with unnecessary movie metadata.

Cinema information is secondary to the bidding mechanic.

---

# 9. Hero Detail Page

When a user clicks a hero:

```text
← Back

┌─────────────────────────────────────────────┐
│                                             │
│              HERO COVER IMAGE               │
│                                             │
└─────────────────────────────────────────────┘

#1
Allu Arjun

₹1,28,500 total backed
842 supporters
+₹4,200 today

[ BACK THIS HERO ]
```

Below:

```text
Current Rank
#1

Previous Rank
#2

Highest Bid
₹10,000

Total Bids
1,284
```

Then:

```text
Top Supporters

#1 @chakresh      ₹20,500
#2 @rahul         ₹14,000
#3 @arjun          ₹9,500
#4 @sai             ₹7,200
#5 @kiran           ₹6,800
```

And:

```text
Bid History

@rahul       +₹500       10 sec ago
@arjun       +₹2,000     2 min ago
@chakresh    +₹250       4 min ago
```

---

# 10. User Starts a Bid

User clicks:

```text
[ BACK THIS HERO ]
```

Open bid modal.

```text
Back Allu Arjun

Current total
₹1,28,500

Your total support
₹2,000

Enter amount
₹ __________

You will add: ₹500
New hero total: ₹1,29,000

[ Continue ]
```

The interface must clearly distinguish:

```text
Your contribution
       ↓
₹500
       ↓
Hero's public total
       ↓
₹1,29,000
```

---

# 11. Bid Validation

Before payment, backend validates everything.

```text
Request
  ↓
Authenticated user?
  ↓
Hero exists?
  ↓
Hero currently active?
  ↓
Amount valid?
  ↓
Currency valid?
  ↓
Payment session created?
```

Reject cases such as:

```text
Amount <= 0
Invalid hero ID
Duplicate/invalid payment request
Payment already processed
Hero disabled
```

Never trust the frontend's displayed hero total.

The backend must calculate the authoritative total at transaction time.

---

# 12. Payment Flow

For a real-money version:

```text
User clicks Continue
        ↓
Create pending bid
        ↓
Create payment order/session
        ↓
Open payment provider
        ↓
User completes payment
        ↓
Payment provider confirms payment
        ↓
Backend verifies payment
        ↓
Mark bid as PAID
        ↓
Increase hero total
        ↓
Recalculate ranks
        ↓
Create activity event
        ↓
Show success
```

Important:

**Never update the hero leaderboard merely because the frontend says payment succeeded.**

The payment provider/server-side verification must be the source of truth.

---

# 13. Successful Bid Flow

After successful payment:

```text
🎬 BID PLACED

You backed Allu Arjun with ₹500.

Allu Arjun
#1 → #1
₹1,28,500 → ₹1,29,000

Your total support
₹2,500

[ View Hero ]
[ Share ]
```

Then automatically publish an activity event:

```text
@chakresh backed Allu Arjun with ₹500
```

---

# 14. The Outbid Mechanic

This is the heart of Cinebid.

Suppose:

```text
Allu Arjun total = ₹1,29,000
Prabhas total    = ₹1,26,000
```

A Prabhas supporter adds ₹5,000.

Then:

```text
Prabhas = ₹1,31,000
```

The leaderboard immediately becomes:

```text
#1 Prabhas       ₹1,31,000 ↑
#2 Allu Arjun    ₹1,29,000 ↓
```

The event should feel immediate.

A real-time client update can display:

```text
🔥 PRABHAS JUST TOOK #1
```

This is where Cinebid gets its game-like tension.

---

# 15. Individual Supporter Outbid Flow

Within each hero, supporters can also compete for supporter rank.

Example:

```text
Top Supporters for Allu Arjun

#1 @rahul       ₹10,000
#2 @chakresh     ₹9,500
#3 @arjun        ₹7,000
```

@chakresh adds ₹1,000:

```text
@chakresh = ₹10,500
```

New ranking:

```text
#1 @chakresh    ₹10,500 ↑
#2 @rahul       ₹10,000 ↓
#3 @arjun        ₹7,000
```

This gives users their own personal "outbid" battle instead of making them passive voters.

---

# 16. Recommended Outbid Rule for Cinebid

Outbid.lol uses a minimum increment for taking #1 and charges only the difference when an existing listing raises its position. citeturn329882view0

For Cinebid, use a simpler Indian-rupee rule for the MVP:

```text
Minimum bid: ₹10
Minimum increase: ₹10
```

For a hero with:

```text
Current total = ₹10,000
```

a user can contribute:

```text
₹10
₹50
₹500
₹2,000
```

But there should be one crucial distinction:

### A new contribution is money added to the hero.

Unlike a traditional auction, the user is not withdrawing or transferring ownership of a previous bid.

Therefore the safest Cinebid accounting model is:

```text
Bid #1 = ₹100
Bid #2 = ₹500
Bid #3 = ₹250

Hero total = ₹850
```

Every **paid bid** remains part of the hero's accumulated backing.

If you later decide to replicate Outbid's exact "pay only the difference to raise your existing listing" behavior for supporters, treat that as a separate feature and specify exactly what is being topped up.

---

# 17. Leaderboard Calculation

For the main Cinebid leaderboard:

```text
Hero.totalBidAmount = SUM(all PAID bids for hero)
```

Sort descending:

```text
ORDER BY totalBidAmount DESC
```

Tie handling:

```text
1. Higher total first
2. If equal, hero that reached that total earlier ranks first
```

This follows the spirit of Outbid's deterministic equal-amount ordering. citeturn329882view0

---

# 18. Time-Based Boards

Outbid has multiple boards, including all-time, rolling 24-hour, and daily UTC boards. citeturn329882view0

Cinebid can use the same concept:

```text
ALL TIME
TODAY
THIS WEEK
```

## All Time

Total paid backing since hero entered Cinebid.

## Today

Total paid backing during the current calendar day.

## This Week

Total paid backing during the current week.

Example:

```text
Cinebid

[ All Time ] [ Today ] [ This Week ]

#1 Allu Arjun      ₹1,28,500
#2 Prabhas          ₹96,200
#3 Mahesh Babu      ₹84,700
```

This dramatically increases repeat visits because the leaderboard can change even when the all-time numbers become large.

---

# 19. Live Activity Feed

Every successful bid creates an activity event.

```text
Latest Activity

⚡ @rahul backed Prabhas with ₹1,000
   3 seconds ago

⚡ @chakresh backed Allu Arjun with ₹500
   14 seconds ago

⚡ @arjun backed Jr NTR with ₹250
   32 seconds ago
```

When the bid changes a meaningful rank:

```text
🔥 PRABHAS TOOK #1
```

When someone takes a supporter position:

```text
👑 @chakresh took #1 supporter for Allu Arjun
```

The activity feed should be one of the main reasons to stay on the page.

---

# 20. User Account Flow

## Sign Up

```text
Sign Up

Name
Username
Email
Password

[ Create Account ]
```

For MVP, keep signup simple.

After signup:

```text
Account created
   ↓
Landing page
   ↓
Browse heroes
```

---

# 21. User Profile

```text
@chakresh

Total backed       ₹5,200
Bids                18
Heroes backed        4
Best supporter rank  #1
```

Hero support history:

```text
Allu Arjun       ₹2,500
Prabhas          ₹1,500
Jr NTR             ₹700
Mahesh Babu        ₹500
```

Profile should also show:

```text
Recent activity
Current supporter ranks
Badges
```

Potential badges:

```text
First Bid
Top Supporter
Took #1
Early Fan
Power Bidder
```

Do not allow badges to affect financial ranking.

---

# 22. Share Flow

After a successful bid:

```text
You just backed Allu Arjun with ₹500.

Current rank: #1

[ Share to X ]
[ Copy Link ]
[ Share Image ]
```

Generate a clean share card:

```text
┌────────────────────────────┐
│          CINEBID           │
│                            │
│      ALLU ARJUN            │
│          #1                │
│       ₹1,29,000            │
│                            │
│  Backed by 842 supporters  │
│                            │
└────────────────────────────┘
```

The goal is to turn every interesting ranking event into distribution.

---

# 23. Hero Request Flow

Users should be able to request heroes who are not yet available.

```text
Can't find your hero?

[ Suggest a Hero ]
```

Form:

```text
Hero name
Industry
Optional reason

[ Submit Request ]
```

Then:

```text
User request
     ↓
Admin review
     ↓
Admin selects canonical image
     ↓
Admin creates hero
     ↓
Hero becomes active
     ↓
Users can bid
```

The user never directly publishes a hero.

---

# 24. Admin Dashboard

Cinebid needs an admin system because hero data and images must be curated.

```text
Admin
│
├── Dashboard
├── Heroes
├── Hero Requests
├── Users
├── Bids
├── Payments
├── Activity
├── Reports
└── Settings
```

## Admin Dashboard

```text
Total Users             12,492
Total Heroes                 86
Total Bids              148,932
Total Amount           ₹42,18,430
Today's Bids              4,284
Today's Amount           ₹2,11,500
```

---

# 25. Admin Create Hero Flow

```text
Admin → Heroes → Add Hero
```

Form:

```text
Hero Name
Allu Arjun

Display Name
Allu Arjun

Profile Image
[ Upload ]

Cover Image
[ Upload ]

Industry
Telugu

Short Bio
...

Status
Active

[ Create Hero ]
```

After creation:

```text
Hero created
   ↓
Hero appears in Discover
   ↓
Hero starts with ₹0
   ↓
Users can place bids
```

---

# 26. Admin Hero Moderation

Admin can:

```text
Activate
Deactivate
Edit name
Change image
Edit metadata
Merge duplicate hero
```

Deleting a hero with financial history should **not** silently delete its bid records.

Use a soft-disable/archive state instead.

---

# 27. Payment and Bid State Machine

Every bid should have an explicit state.

```text
CREATED
   ↓
PAYMENT_PENDING
   ↓
PAID
   ↓
APPLIED
```

Failure path:

```text
PAYMENT_PENDING
      ↓
   FAILED
```

Cancellation/expiry path:

```text
PAYMENT_PENDING
      ↓
   EXPIRED
```

Only `PAID` and successfully applied transactions affect the leaderboard.

---

# 28. Database Relationship

```text
User
  │
  └──────────────┐
                 │
                Bid
                 │
        ┌────────┴────────┐
        │                 │
      User              Hero
                          │
                          ├── profileImage
                          ├── totalBidAmount
                          └── totalBidCount
```

Suggested collections/tables:

```text
users
heroes
bids
payments
hero_requests
activity_events
```

Optional later:

```text
hero_rank_snapshots
supporter_rank_snapshots
notifications
reports
```

---

# 29. Bid Transaction Logic

The backend should treat a successful payment as an atomic financial event.

Conceptually:

```text
BEGIN TRANSACTION

1. Verify payment
2. Create PAID bid
3. Increment hero.totalBidAmount
4. Increment hero.totalBidCount
5. Recalculate affected rankings
6. Create activity event
7. Create notification if required

COMMIT
```

If any required step fails, do not leave the system in a state where the user paid but the bid disappeared.

For real money, reconciliation and idempotency are mandatory.

---

# 30. Idempotency

A payment provider can retry callbacks.

Therefore this must never happen:

```text
₹500 payment
     ↓
Webhook #1 → +₹500
Webhook #2 → +₹500
```

Correct:

```text
Payment ID = pay_123

Webhook #1 → apply
Webhook #2 → already processed → ignore
```

Every payment needs a unique provider transaction/order ID.

---

# 31. Real-Time Updates

Cinebid should ideally update rankings without requiring the user to refresh.

```text
User A places bid
       ↓
Backend verifies payment
       ↓
Database updates
       ↓
Event emitted
       ↓
WebSocket / SSE
       ↓
All connected clients receive update
```

UI example:

```text
#2 Prabhas   ₹96,200
       ↓
new bid
       ↓
#1 Prabhas  ₹1,30,000 🔥
```

For an MVP, polling every few seconds is acceptable.
For the polished version, use WebSockets or Server-Sent Events.

---

# 32. Notification Flow

When a user has an active supporter position, Cinebid can notify them when another user passes them.

Example:

```text
🔔 You got outbid!

You were #1 supporter of Allu Arjun.
@rahul just passed you.

Your support: ₹10,000
Their support: ₹10,500

[ Fight Back ]
```

This is one of the strongest retention loops in the entire product.

However, do not make notifications manipulative or misleading.
Show the exact numbers and the exact action required.

---

# 33. Complete Returning User Flow

```text
Open Cinebid
     ↓
See latest leaderboard
     ↓
See that favourite hero dropped from #1 to #2
     ↓
Click hero
     ↓
View who overtook them
     ↓
Click Back This Hero
     ↓
Choose amount
     ↓
Payment
     ↓
Success
     ↓
Hero climbs
     ↓
User sees updated rank
     ↓
Share
```

This loop should be extremely fast.

---

# 34. The Main Growth Loop

The product's intended loop should be:

```text
FAN
 ↓
SEES FAVOURITE HERO
 ↓
BIDS
 ↓
HERO RANK CHANGES
 ↓
FRIENDS/FANS NOTICE
 ↓
SHARE
 ↓
NEW USERS ARRIVE
 ↓
THEY SUPPORT THEIR HERO
 ↓
HERO GETS OUTBID
 ↓
ORIGINAL FAN RETURNS
```

That is the product.

Everything else should support this loop.

---

# 35. What Should NOT Exist in the MVP

Avoid these initially:

```text
❌ Complex social feed
❌ Messaging
❌ Movie reviews
❌ Streaming links
❌ Fan clubs
❌ Huge profile customization system
❌ NFT system
❌ Crypto wallet requirement
❌ Complicated reward economy
❌ Dozens of currencies
```

They dilute the core idea.

The MVP should basically be:

```text
Heroes
+
Money-backed ranking
+
Outbidding
+
Live activity
+
Profiles
+
Payments
+
Admin curation
```

---

# 36. MVP Screen Map

```text
PUBLIC
│
├── /
│   └── Landing + Live Leaderboard
│
├── /heroes
│   └── Discover Heroes
│
├── /heroes/:id
│   └── Hero Detail + Bid
│
├── /leaderboard
│   └── Global Rankings
│
├── /activity
│   └── Live Activity
│
├── /how-it-works
│
├── /rules
│
└── /login

AUTHENTICATED
│
├── /profile
├── /my-bids
├── /notifications
└── /settings

ADMIN
│
├── /admin
├── /admin/heroes
├── /admin/heroes/new
├── /admin/requests
├── /admin/users
├── /admin/bids
├── /admin/payments
└── /admin/activity
```

---

# 37. Recommended Homepage Layout

The visual hierarchy should borrow the **minimal, information-dense leaderboard structure** of Outbid rather than copying cinema portals.

```text
┌─────────────────────────────────────────────────────────────┐
│ CINEBID    Heroes   Leaderboard   Activity   How It Works  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              BACK YOUR FAVOURITE HERO                      │
│              OUTBID THE REST.                              │
│                                                             │
│              [ Explore Heroes ]                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ LIVE LEADERBOARD                                            │
│                                                             │
│ #1  HERO                 TOTAL BACKING       SUPPORTERS     │
│ #2  HERO                 TOTAL BACKING       SUPPORTERS     │
│ #3  HERO                 TOTAL BACKING       SUPPORTERS     │
│ #4  HERO                 TOTAL BACKING       SUPPORTERS     │
│ #5  HERO                 TOTAL BACKING       SUPPORTERS     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ LATEST ACTIVITY                                             │
│                                                             │
│ @user backed Hero with ₹500                                 │
│ @user backed Hero with ₹1,000                               │
│ @user took #1 supporter with ₹250                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Outbid's current page similarly puts the claim mechanism and public ranked listings directly in the main experience, followed by a top-ranking section and latest activity. citeturn429685view0

---

# 38. Rules Page for Cinebid

Cinebid should have an explicit rules page before accepting real money.

Suggested rules:

```text
1. Cinebid is a public ranking platform.
2. Users back heroes by placing paid bids.
3. Paid bids increase the hero's total backing.
4. Hero rank is determined by the configured ranking metric.
5. Supporter rank is determined by a user's total support for that hero.
6. Only successfully verified payments count.
7. Failed or pending payments do not affect rankings.
8. Duplicate payment notifications do not create duplicate bids.
9. Bids are publicly reflected in ranking/activity data according to privacy settings.
10. Payments and refund rules must be clearly displayed before checkout.
11. Cinebid may suspend heroes or accounts that violate platform rules.
12. Hero images and metadata are managed by Cinebid.
```

For real-money deployment, the legal/payment rules must be reviewed for the target Indian jurisdictions and payment provider requirements before launch. This document is product architecture, not legal advice.

---

# 39. Critical Product Question Before Coding

There is one decision that should be frozen before implementing the backend:

## What exactly does a bid mean?

### Recommended model

A bid is a **non-refundable contribution to a hero's cumulative backing total**.

Example:

```text
User A → Allu Arjun → ₹100
User B → Allu Arjun → ₹500
User A → Allu Arjun → ₹200

Allu Arjun total = ₹800
User A total      = ₹300
```

This is simple, easy to understand, and natural for fandom.

The Outbid-style competition then happens at two levels:

```text
LEVEL 1
Hero vs Hero

LEVEL 2
Supporter vs Supporter
```

This is the recommended Cinebid model.

---

# 40. Final Product Loop

The entire Cinebid product can be reduced to this:

```text
              ┌─────────────────┐
              │  DISCOVER HERO   │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │   BACK HERO     │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │   PAY ₹₹₹       │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ HERO TOTAL ↑    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │  RANK CHANGES   │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ SOMEONE OUTBIDS │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ NOTIFICATION    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │  FIGHT BACK 🔥  │
              └────────┬────────┘
                       │
                       └──────────────→ back to PAY
```

**Cinebid should feel less like a movie database and more like a live financial leaderboard for fandom.**

That is the part worth preserving from Outbid.lol.
