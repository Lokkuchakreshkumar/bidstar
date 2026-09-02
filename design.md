# Cinebid Design System & Guidelines (Geist + Anthropic Cloud Dark Theme)

## 1. Core Philosophy & Authorship

Cinebid combines **Vercel editorial craftsmanship, information architecture, and Geist typography** with **Anthropic Claude's signature warm cloud-like dark aesthetic**.

- **Calm, restrained, and evidence-led**: No hype, no cheap decoration, no fake 3D depth, no neon glow boxes.
- **Hierarchy through typography and spacing**: Spacing and type weights define hierarchy before surfaces or borders.
- **Visual Consequence for Decisive Hierarchy (#1 Spotlight Principle)**: When an item is the primary subject or holds the #1 spot, the UI/UX must give it unmistakable preference in geometry, scale, contrast, and prestige. Never flatten unequal hierarchy into identical peer boxes. Holding #1 must feel celebrated and worthy of fighting for.
- **Continuous canvas**: The interface is a continuous surface; cards are earned only when real boundary or interaction is required.
- **Monochrome base with purposeful cinema flame & champion gold accents**: Primary surfaces and text are monochrome; cinema flame (`#e95325`) is used for active challenger actions and outbid deltas, while warm gold/amber (`#f59e0b` / `#fbbf24`) is reserved for crowning the #1 champion.

---

## 2. Color Palette & Token System

### Dark Mode: Anthropic Cloud-Like Aesthetic (No Pitch Black `#000000`)

| Token Name | CSS Variable | Hex Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--background` | `#161514` | Deep warm cloud charcoal base canvas |
| **Card / Surface Primary** | `--card-bg` | `#1c1b1a` | Elevated surface for cards, modals, dropdowns |
| **Card Hover** | `--card-hover` | `#252422` | Hover state for interactive rows and buttons |
| **Pill / Secondary Surface** | `--pill-bg` | `#22211f` | Subordinate container, tag backgrounds, input wells |
| **Subtle Border** | `--border-subtle` | `#262421` | Soft dividers between peer rows |
| **Default Border** | `--card-border` | `#2e2c29` | Structural card borders and container outlines |
| **Pill Border** | `--pill-border` | `#33302c` | Interactive tag and control borders |
| **Primary Text** | `--foreground` | `#f4efe9` | Soft warm ivory for high readability and calm contrast |
| **Muted Text** | `--muted-text` | `#9c9489` | Warm stone for secondary metadata, labels, and timestamps |
| **Accent Flame** | `--accent-coral` | `#e95325` | Cinema flame accent for challenger bid actions |
| **Champion Gold** | `--color-champion` | `#f59e0b` | Gold / amber accent reserved exclusively for #1 Throne & Crown |
| **Success / Verified** | `--color-success` | `#10b981` | Verified payments, positive deltas, online status |

### Light Mode: Warm Editorial Canvas

| Token Name | CSS Variable | Hex Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--background` | `#fcfaf7` | Warm editorial parchment canvas |
| **Card / Surface Primary** | `--card-bg` | `#ffffff` | Clean white cards and elevated panels |
| **Card Hover** | `--card-hover` | `#f5f0e8` | Hover state for interactive rows |
| **Pill / Secondary Surface** | `--pill-bg` | `#f1ebe1` | Subordinate container and tag background |
| **Subtle Border** | `--border-subtle` | `#eee8de` | Soft dividers |
| **Default Border** | `--card-border` | `#e8e2d8` | Structural card borders |
| **Pill Border** | `--pill-border` | `#dfd8cc` | Interactive tag borders |
| **Primary Text** | `--foreground` | `#181614` | Deep charcoal for crisp readability |
| **Muted Text** | `--muted-text` | `#726a62` | Warm stone muted text |
| **Accent Flame** | `--accent-coral` | `#e95325` | Cinema flame accent |

---

## 3. Visual Consequence, User Psychology & Tiered Podium Hierarchy

1. **User Psychology & Aspirational Value**:
   - Designing is understanding how a person thinks and perceives value: status, prestige, and authority must be physically felt, not just deciphered from text labels.
   - The user backs their favorite hero to see them crowned as the undisputed #1 king of Indian cinema. Holding #1 must look and feel supreme.

2. **Tiered Podium Hierarchy (#1 on Top, #2 Smaller, #3 Even Smaller)**:
   - **#1 Hero (Champion on the Throne)**:
     - **Position**: Center stage and elevated to the top of the podium.
     - **Scale**: Largest card dimensions, largest avatar portrait (`w-28 h-28 sm:w-32 sm:h-32`), largest typography.
     - **Visual Tone**: Gold champion border (`border-amber-500/50`), floating crown banner (`👑 Reigning #1 Champion`), and `🛡️ Defend Crown` button.
   - **#2 Hero (Primary Challenger)**:
     - **Position**: Flanking step on the left, stepped down from #1.
     - **Scale**: Noticeably smaller card and portrait (`w-20 h-20 sm:w-22 sm:h-22`).
     - **Challenger Incentive**: Floating action pill `claim #1 for ₹X` in flame coral (`#e95325`).
   - **#3 Hero (Secondary Challenger)**:
     - **Position**: Flanking step on the right, stepped down even further below #2.
     - **Scale**: Even smaller card and portrait (`w-16 h-16 sm:w-18 sm:h-18`), compact typography.
     - **Challenger Incentive**: Floating action pill `claim #1 for ₹X`.

3. **Leaderboard & Detail Pages**:
   - **Leaderboard Spotlight**: Row #1 is highlighted with a gold crown badge, champion indicator, and subtle highlight tint.
   - **Hero Profile Spotlight**: If the hero holds #1, a champion crown banner is displayed; if not, an urgent challenger callout showing the exact amount needed to dethrone #1 is rendered.

---

## 4. Typography & Numerical Treatment

- **Primary Font**: `Geist Sans` (`var(--font-sans)` via `next/font/google`).
- **Monospace Font**: `Geist Mono` (`var(--font-mono)` via `next/font/google`).
- **Tabular Numerals**: All rupee amounts, rank badges, counters, percentages, and deltas must apply `tabular-nums` / `font-variant-numeric: tabular-nums;`.
- **Heading Hierarchy**:
  - `Display / Page Hero`: Bold, tight tracking (`tracking-tight`), sentence case.
  - `Section Turns`: 20–24px, font-bold, sentence case.
  - `Subheadings`: 14–16px, font-semibold.
  - `Labels & Meta`: 11–12px, font-medium.

---

## 5. Spacing & Rhythm

- **Relational Spacing**:
  - Heading → its first paragraph: close (`gap-1` or `mt-1`).
  - Paragraph → Paragraph / List: standard body rhythm (`mt-2` to `mt-3`).
  - Between Section Turns: `my-8` to `my-12`.
- **12-Column Evidence Layout**:
  - Tables and major comparisons own the full 12 columns.
  - Prose reads comfortably at 60–68 characters per line.

---

## 6. Prohibited Anti-Patterns

- **NO pitch black (`#000000`) surfaces in dark mode.**
- **NO equalizing decisive findings or #1 champions into identical, undistinguished boxes.**
- **NO all-caps tracked eyebrows, kickers, or decorative numbered headings.**
- **NO em dashes.**
- **NO decorative rainbow gradients, animated glowing borders, or pulsing drop shadows.**
- **NO misaligned table headers above right-aligned numerical values.**
