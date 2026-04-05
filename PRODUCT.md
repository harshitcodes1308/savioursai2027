# Saviours AI — Complete Product Description
## Internal Reference Document · April 2026

---

## 1. WHAT IT IS

Saviours AI is a premium AI-powered study platform built exclusively for **ICSE Class 10 students preparing for the 2027 Board Examinations**. It combines AI doubt solving, adaptive testing, smart planning, and deep content tools into a single dark, cinematic product experience.

The product is opinionated: it is not a general study app. Every feature, every copy line, every design decision is scoped to one student archetype — the ICSE Class 10 student who has 10 months to boards and wants an edge.

---

## 2. TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.3 (App Router) |
| Language | TypeScript 5 |
| Runtime | React 19 |
| Styling | Tailwind CSS 4 + inline CSS-in-JS |
| Animation | Motion (Framer Motion) 12 |
| API Layer | tRPC 11 + TanStack Query 5 |
| Database | PostgreSQL via Prisma 5 |
| Cache / Queue | Redis + BullMQ |
| Auth | Custom JWT (jose) + bcryptjs + Google OAuth |
| Payments | Razorpay |
| AI | OpenAI SDK |
| Code Editor | CodeMirror 6 (Java language, One Dark theme) |
| PDF | pdf-parse |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deployment | Node.js server (Next.js standalone) |

---

## 3. COLOUR SYSTEM

The entire product uses a single CSS variable system defined in `src/app/globals.css`. No hardcoded hex values appear anywhere in components — all colours reference these tokens.

### 3.1 Background Layers

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0D0D1A` | Page background, deepest layer |
| `--bg-surface` | `#13131F` | Cards, panels, sidebars |
| `--bg-elevated` | `#1A1A2E` | Hovered/selected card state, popovers |
| `--bg-border` | `#252538` | Standard border on all cards/inputs |
| `--bg-border-light` | `#353552` | Lighter border for dashed/demo elements |

The background stack reads darkest → lightest: Base → Surface → Elevated. Nothing is pure black (#000) in normal use — `#0D0D1A` is the true base. The dashboard main area overrides `--bg-base` to `transparent` and `--bg-surface` to `rgba(10, 10, 18, 0.65)` so the stars video shows through all page backgrounds.

### 3.2 Text Hierarchy

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#F5F0E8` | Warm white. Headlines, active labels, body copy |
| `--text-secondary` | `#B0AABA` | Supporting text, descriptions, sublabels |
| `--text-muted` | `#6B6B80` | Captions, timestamps, placeholder labels |
| `--text-disabled` | `#3D3D50` | Disabled inputs, inactive elements |

Text primary is warm white (`#F5F0E8`), not pure white. This prevents harshness against the dark blue-grey backgrounds and gives a premium, editorial feel.

### 3.3 Accent — Electric Cyan

The main accent colour is **Electric Cyan**, named `--accent-gold` for historical reasons (it was gold in earlier iterations). Do not rename the token — it is deeply referenced throughout the codebase.

| Token | Value | Usage |
|---|---|---|
| `--accent-gold` | `#00D4FF` | Primary CTA, active nav items, highlights, borders on selected states |
| `--accent-gold-dim` | `#00A3CC` | Gradient endpoint, dimmed version of accent |
| `--accent-gold-glow` | `rgba(0, 212, 255, 0.15)` | Background tint on active states, glows |
| `--accent-gold-border` | `rgba(0, 212, 255, 0.35)` | Hover border colour on cards and inputs |

Razorpay checkout theme colour is also set to `#00D4FF` to match.

### 3.4 Status / Semantic Colours

| Token | Hex | Usage |
|---|---|---|
| `--status-green` | `#3ECF8E` | Success, savings labels, check marks |
| `--status-red` | `#F87171` | Errors, validation failures |
| `--status-blue` | `#60A5FA` | Informational states |
| `--status-orange` | `#FB923C` | Demo buttons, warnings |

---

## 4. TYPOGRAPHY

### 4.1 Font Families

#### ScotchDisplay — Premium Display Font
- **File**: `public/fonts/ScotchDisplay-Regular.woff2` + `.woff`
- **Weight**: 400 (regular), used at large sizes with bold visual weight
- **Token**: `--font-tagline`
- **Usage**: Large editorial headlines (pricing page price numbers, onboarding subheadlines, taglines), italic captions, the vapour text welcome animation, plan name pricing display
- **Fallback**: Georgia, Times New Roman, serif
- This is the personality font. It gives the product a premium, editorial quality.

#### SF Pro Display — System UI Display
- **Token**: `--font-display`
- **Usage**: Main headings, hero text, large UI labels
- **Fallback**: `-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, sans-serif`
- On Apple devices this renders as SF Pro Display natively. On non-Apple, falls back to Inter.

#### SF Pro Text — System UI Body
- **Token**: `--font-body`
- **Usage**: All body copy, nav items, form labels, buttons, captions, meta text
- **Fallback**: `SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, DM Sans, Helvetica Neue, sans-serif`

#### Coolvetica — Onboarding / Card Labels
- **Usage**: Testimonial card author names, pricing card plan labels, "What students are saying" uppercase labels, the continue button in testimonial screen
- **Not loaded via CSS** — expected to be installed on the system or loaded separately
- **Fallback**: sans-serif
- Used only in the new onboarding components (testimonial cards, pricing cards)

#### Helvetica Neue — Testimonial Body
- **Usage**: Testimonial card quote text, pricing card descriptions and feature lists, savings labels
- System font on macOS/iOS, no loading required

#### SF Mono — Code
- **Token**: `--font-mono`
- **Usage**: Code blocks, the Java code editor in AI tools
- **Fallback**: Courier New, Courier, monospace

### 4.2 Type Scale

| Token | Size | Usage |
|---|---|---|
| `--text-xs` | 11px | Labels, caps, nav group headers |
| `--text-sm` | 13px | Secondary body, captions, sublabels |
| `--text-base` | 15px | Primary body text |
| `--text-md` | 17px | Slightly larger body, important UI text |
| `--text-lg` | 20px | Section subheadings |
| `--text-xl` | 24px | Smaller display headings |
| `--text-2xl` | 32px | Medium headings |
| `--text-3xl` | 44px | Page titles (desktop) |
| `--text-4xl` | 60px | Hero section numbers |
| `--text-hero` | 80px | Cinematic splash text |

### 4.3 Typography Rules

- Headlines: `letter-spacing: -0.02em` to tighten at large sizes
- Uppercase labels: `letter-spacing: 0.08–0.14em` to open up at small sizes
- Body copy: `line-height: 1.6`
- Italic taglines always use ScotchDisplay at small sizes (12–16px)
- `font-weight: 700` on display text; `400` on ScotchDisplay (it reads bold optically)

---

## 5. SPACING & RADIUS

### Border Radius
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Small chips, tags, small buttons |
| `--radius-md` | 12px | Standard inputs, buttons, modals |
| `--radius-lg` | 18px | Cards, panels |
| `--radius-xl` | 24px | Large cards, pricing cards |

New onboarding components use `20px` borderRadius directly (between `--radius-lg` and `--radius-xl`). CTA buttons use `100px` (full pill).

### Shadows
| Token | Value |
|---|---|
| `--shadow-card` | `0 4px 24px rgba(0,0,0,0.5)` |
| `--shadow-gold` | `0 0 20px rgba(0, 212, 255, 0.2)` |

---

## 6. TRANSITIONS & EASING

| Token | Value | When to Use |
|---|---|---|
| `--transition-fast` | `150ms ease-out` | Hover states, colour changes |
| `--transition-normal` | `250ms ease-out` | Border/shadow transitions |
| `--transition-slow` | `400ms cubic-bezier(0.16, 1, 0.3, 1)` | Page transitions, card scale |

The easing `cubic-bezier(0.16, 1, 0.3, 1)` is the signature spring curve used throughout — fast start, overshoots slightly, settles cleanly. It appears in onboarding reveals, card hovers, and motion animations.

---

## 7. ONBOARDING FLOW (7 Screens)

The onboarding is a single-file component at `src/components/onboarding/OnboardingFlow.tsx` with step state managed locally. All 7 screens are full-screen fixed overlays.

### Screen 1 — Cinematic Splash
- Stars video background at 1.5× playback speed, greyscale filter
- Diamond SVG logo fades + scales in at 600ms
- "SAVIOURS AI" in SF Pro Display, 0.25em letter-spacing, uppercase
- ScotchDisplay italic tagline: *"Where preparation meets precision."*
- Floating cyan particles (20 dots, randomised position/size/float delay)
- Radial vignette overlay
- Parallax mouse tracking on video
- Auto-advances at 4s. Tap anywhere to skip.
- Fade-out transition (600ms) before Screen 2.

### Screen 2 — Sequential Text Reveal
**Phase 1 — Greetings (one at a time, huge):**
- "Hello." — SF Pro Display, 80px desktop / 52px mobile, warm white
- "नमस्कार।" — same scale, Electric Cyan (`#00D4FF`)
- Each fades+slides in with `translateY(30px) scale(0.96)` → `translateY(0) scale(1)`

**Phase 2 — Contextual Messages:**
- "You just moved to Class 10." — warm white
- "Boards are 10 months away." — text-secondary
- "We have crazy things for you." — Electric Cyan
- Reveal at 48px desktop / 28px mobile, staggered by 900ms gaps

**CTA:** Liquid glass "Begin →" button. Advances to Screen 3.

### Screen 3 — Testimonial Cards (semi-circle fan)
- 5 cards spread on a -70° to +70° arc (radius 280px desktop, 160px mobile)
- Cards overlap, each tilts ~30% of its angle along the arc
- **Hover interaction**: hovered card straightens + scales 1.1×, gets gold border glow (`rgba(0,212,255,0.1)` box-shadow). All others blur (3px), dim (60% brightness), shrink (0.92×)
- Avatar: SVG Instagram-style default pfp (white silhouette on `#DBDBDB` grey)
- Card background: `--bg-surface`, 20px radius, `backdropFilter: blur(14px)`
- Quote text: Helvetica Neue, 15px, italic, `--text-secondary`
- Author: Coolvetica, 13px, `--accent-gold`
- Hint text below: ScotchDisplay italic — *"Hover over the reviews to read them"* fades out when hovering
- CTA: Gold pill button — "Looks good, let's go →"

**Real testimonials** (5 actual students):
1. Sparsh — productivity + task management
2. Abhyang Salve — doubt clearing
3. Sarthak Mehta — History, Geography, Maths
4. Ishika Sagar — boards went well
5. Manntrra Pawar — twisted questions, difficulty

### Screen 4 — Name Input
- "What should we call you?" at 40px
- Single `sa-input` field, centred, 18px text
- Pre-filled with name from Google session if available
- Enter key advances. "Continue →" CTA.

### Screen 5 — Animated Glassy Pricing
- WebGL fragment shader background (always dark — `#0A0A0F` base with subtle flowing cyan tint)
- No Tailwind — all inline styles, Saviours AI variables
- **Free** (₹0 forever): Secondary ghost button
- **Monthly** (₹199/month): Primary gold pill button
- **Yearly** (₹499/year): "Most Popular" badge, gold border glow (`rgba(0,212,255,0.15)` shadow), "Save ₹1,889 vs monthly" in `--status-green`
- Price numbers: ScotchDisplay at 52px
- Plan name: Coolvetica, 13px, uppercase, 0.1em letter-spacing
- Card hover: lifts 4px, deeper shadow
- Free → calls `/api/auth/set-plan` then advances to Screen 6
- Monthly/Yearly → opens Razorpay checkout → on success advances to Screen 6

### Screen 6 — Loading / Setup
- Stars video, 1.5× speed, greyscale, 0.35 opacity
- Spinning diamond SVG (spin360, 4s linear)
- "Hold tight, [Name]" personalised headline
- 4 sequential loading lines with spinner → checkmark progression (800ms each)
- Gold progress bar (`progressFill` animation, 3s)
- ScotchDisplay italic footnote: *"Your academic edge, loading..."*
- Auto-advances to Screen 7 at 3.6s

### Screen 7 — Vapour Text Welcome
- Full black background (`#0A0A0F`)
- Diamond logo fades in (0.3s delay, `fadeInLogo` animation)
- **VapourText animation (3 phases)**:
  1. **Fade in** (1.0s): Particles coalesce left-to-right into "Welcome to Saviours AI"
  2. **Hold** (1.2s): Solid text, fully visible
  3. **Disintegrate** (1.2s): Particles drift away with upward bias (ash effect), fade to zero
- Font: ScotchDisplay, 52px desktop / 32px mobile, warm white `rgb(245, 240, 232)`
- "ICSE Class X · 2027 Boards" tagline fades in at 1.8s delay in Coolvetica uppercase
- `onComplete` callback fires → `doComplete()` → `/api/auth/complete-onboarding` → `window.location.href = '/dashboard'`

---

## 8. DASHBOARD

### Layout
- **Desktop**: Fixed sidebar (240px wide) + main content area with `margin-left: 240px`
- **Mobile**: Slide-in drawer (same 240px) triggered by hamburger, + bottom tab bar (64px height)
- Main content area: stars video fixed background at low opacity, all page backgrounds transparent, cards at `rgba(10, 10, 18, 0.65)`

### Sidebar
- Background: `rgba(10,10,18,0.85)` with `backdropFilter: blur(20px)`
- Border-right: `1px solid rgba(255,255,255,0.06)` (very subtle)
- User badge: initials avatar, name, email, green pulsing online dot
- Active nav item: left 2px cyan border + `--accent-gold-glow` background + cyan text
- Hover: `rgba(255,255,255,0.03)` background, text becomes primary
- Bottom: plan badge (cyan tint if paid), ScotchDisplay italic tagline

### Navigation Groups
- **HOME**: Dashboard
- **STUDY**: AI Doubt Solver, Smart Planner, Focus Mode
- **PRACTICE**: Competency Test, Customise Test, Flip the Question, + 4 hidden
- **FREE TOOLS**: To-do List, ChronoScroll, Date Battle Arena, Notes & Flashcards
- **ACCOUNT**: Profile, Policies

### Mobile Bottom Tabs (5 items)
Home · Study (AI) · Practice (Competency) · Focus · Account (Profile)

---

## 9. FEATURES

### Live (Enabled)

| Feature | Route | Plan Required |
|---|---|---|
| AI Doubt Solver | `/dashboard/ai-assistant` | Free (3/day), Unlimited on paid |
| Smart Planner | `/dashboard/planner` | Monthly, Yearly |
| Competency Test | `/dashboard/precision-practice` | Monthly, Yearly |
| Customise Test | `/dashboard/tests` | Monthly, Yearly |
| Flip the Question | `/dashboard/flip-the-question` | Monthly, Yearly |
| Focus Mode | `/dashboard/focus` | Monthly, Yearly |
| To-do List | `/dashboard/planner?tab=todo` | Free |

### Hidden (Built, Not Exposed)

| Feature | Route | Flag |
|---|---|---|
| Numerical Mastery | `/dashboard/numerical-mastery` | `numericalMastery` |
| Chrono Scroll | `/dashboard/chronoscroll` | `chronoScroll` |
| Guess Papers | `/dashboard/guess-papers` | `guessPapers` |
| Date Battle Arena | `/dashboard/date-battle` | `dateBattleArena` |
| Strategy AI | `/dashboard/strategy` | `strategyAI` |
| Last Night Before | `/dashboard/last-night-before` | `lastNightBefore` |
| Notes & Flashcards | `/dashboard/notes` | `notesFlashcards` |

Enable any by setting its flag to `true` in `src/config/feature-flags.ts`. No redeploy needed if using environment-injected config.

---

## 10. PLANS & PRICING

| Plan | Price | Billing |
|---|---|---|
| Free | ₹0 | Forever |
| Monthly | ₹199 | Per month |
| Yearly | ₹499 | Per year (saves ₹1,889 vs monthly) |

### What Each Plan Gets

**Free**
- To-do List
- AI Doubt Solver (3 queries/day)
- Class schedule view

**Monthly (₹199/mo)**
- Everything in Free
- AI Doubt Solver (unlimited)
- Smart Planner
- Competency Test
- Customise Test
- Flip the Question
- Focus Mode

**Yearly (₹499/yr)**
- Everything in Monthly
- Priority AI responses
- Early access to new features
- Yearly progress report

### Grandfathering
Users created before `2026-01-29T00:00:00+05:30` with a `FREE` plan are treated as `YEARLY` in both the JWT session and Razorpay payment checks. This logic lives in `src/lib/auth.ts` and `src/app/api/auth/google/callback/route.ts`.

---

## 11. AUTH SYSTEM

- **JWT-based** — tokens stored in `auth-token` HttpOnly cookie
- **HS256** signing with `JWT_SECRET` env variable
- **Session shape**: `id, email, name, role, isPaid, planType, subscriptionStatus, onboardingComplete`
- **Cookie lifetime**: 1 day default, 30 days with `rememberMe: true`
- **Providers**: Email+password (bcrypt, salt 12), Google OAuth
- **Auto-create on login**: If email doesn't exist, account is auto-created (name defaults to email prefix)
- **Onboarding guard**: Middleware redirects authenticated users with `onboardingComplete: false` to `/onboarding`
- **Paid guard**: Free users accessing locked routes get redirected to `/dashboard?locked=true`

---

## 12. UI COMPONENT LIBRARY

### Global Components (`src/components/ui/`)

| Component | File | Purpose |
|---|---|---|
| Testimonial Arc | `testimonial-cards.tsx` | Semi-circle fan of 5 hover-reveal student review cards |
| Animated Pricing | `animated-glassy-pricing.tsx` | WebGL shader background + 3 glassmorphic pricing cards |
| Vapour Text | `vapour-text-effect.tsx` | Canvas particle animation: coalesce → hold → disintegrate |
| Liquid Button | `liquid-glass-button.tsx` | SVG glass filter glassmorphic button |
| Shimmer Text | `shimmer-text.tsx` | Framer Motion gradient sweep text |
| Generation Loader | `GenerationLoader.tsx` | Full-screen AI generation progress (0–95%) |
| Upgrade Prompt | `UpgradePrompt.tsx` | Modal shown when free user hits locked feature |
| Razorpay Button | `RazorpayButton.tsx` | Payment trigger component |

### Button Classes (Global CSS)

**`.btn-gold`** — Liquid glass CTA button
- Gradient background: `rgba(0,212,255,0.18) → rgba(0,180,220,0.12) → rgba(0,212,255,0.20)`
- `backdropFilter: blur(16px) saturate(1.4)`
- Shimmer sweep on hover via `::before` pseudo-element
- Inset highlight + glow box shadows
- Lifts `translateY(-1px)` on hover
- Color: white text on glassmorphic cyan tint

**`.btn-ghost`** — Subtle secondary
- Near-transparent background: `rgba(255,255,255,0.03)`
- Becomes cyan-tinted on hover

**`.sa-input`** — Form input
- Full autofill override (kills browser white flash)
- Cyan border + glow ring on focus
- Background forced to `--bg-base` with `!important`

**`.sa-card`** — Standard card
- `--bg-surface` background, `--radius-lg` border radius
- Cyan border glow on hover

**`.skeleton`** — Loading shimmer
- Gradient sweep animation 1.6s infinite

---

## 13. ANIMATIONS (Named Keyframes)

| Name | Effect |
|---|---|
| `fadeIn` | `opacity 0→1, translateY 14px→0` |
| `fadeInWord` | `opacity 0→1, translateY 28px→0` |
| `fadeInScale` | `opacity 0→1, scale 0.8→1` |
| `scaleIn` | `opacity 0→1, scale 0.94→1` |
| `slideInUp` | `opacity 0→1, translateY 16px→0` |
| `progressFill` | `width 0%→100%` |
| `float` | `translateY 0→-6px→0` (infinite) |
| `spin360` | Full rotation (infinite) |
| `goldGlow` | Box shadow pulse 16px→32px (infinite) |
| `pulse` | Opacity + scale pulse (infinite) |
| `pulseDot` | Dot opacity + scale (infinite) |
| `checkBounce` | `scale 0→1.2→1` |
| `taskCollapse` | max-height + opacity collapse |
| `pageEnter` | `opacity 0→1, translateY 12px→0` (350ms, used on page mounts) |
| `fadeInLogo` | `opacity 0→1, translateY 8px→0` (onboarding screen 7) |
| `shimmer` | Background position sweep (skeleton loader) |

---

## 14. VIDEO ASSET

Single Cloudinary-hosted stars/space video used throughout:
```
https://res.cloudinary.com/dv0w2nfnw/video/upload/v1774898701/videoplayback_tgdakw.mp4
```

Usage contexts:
- **Onboarding Screen 1**: greyscale, full opacity, 1.5× speed
- **Onboarding Screen 2**: greyscale + brightness(0.3), opacity 0.5
- **Onboarding Screen 3**: no filter, opacity 0.05 (barely visible)
- **Onboarding Screen 6**: greyscale, opacity 0.35, 1.5× speed
- **Login/Signup**: greyscale + brightness(0.35) in the left panel
- **Login warp overlay**: full colour, brightness(0.5), opacity 0.7
- **Dashboard**: fixed position background, greyscale + brightness(0.15), opacity 0.25

---

## 15. DEMO / TESTING

A dev-only demo route at `/api/auth/demo` (only visible in development) adds two buttons to the login and signup pages:

**Signup page** — "Demo Sign Up → Test Onboarding"
- Resets `onboardingComplete: false` on the demo account
- Redirects to `/onboarding`
- Use this to replay the entire onboarding flow without creating a new account each time

**Login page** — "Demo Sign In → Straight to Dashboard"
- Sets `onboardingComplete: true` on the demo account
- Redirects to `/dashboard` via the warp transition
- Use this to test dashboard features without going through onboarding

Demo account: `demo@saviours.test`, plan `YEARLY`, auto-created on first use. Buttons are hidden in production (`process.env.NODE_ENV !== "production"`).

---

## 16. KEY FILE LOCATIONS

```
src/
├── app/
│   ├── globals.css                    ← Full design system (colours, fonts, animations)
│   ├── layout.tsx                     ← Root layout
│   ├── onboarding/page.tsx            ← Onboarding entry point
│   ├── login/page.tsx                 ← Login + warp transition
│   ├── signup/page.tsx                ← Signup form
│   ├── pricing/page.tsx               ← Standalone pricing page
│   ├── dashboard/
│   │   ├── layout.tsx                 ← Dashboard shell (session, sidebar, video bg)
│   │   ├── page.tsx                   ← Dashboard home
│   │   ├── ai-assistant/              ← AI Doubt Solver
│   │   ├── planner/                   ← Smart Planner + To-do
│   │   ├── precision-practice/        ← Competency Test
│   │   ├── tests/                     ← Customise Test
│   │   ├── flip-the-question/         ← Flip the Question
│   │   ├── focus/                     ← Focus Mode
│   │   └── profile/                   ← Profile + plan management
│   └── api/
│       ├── auth/
│       │   ├── demo/route.ts          ← Dev-only demo login
│       │   ├── complete-onboarding/   ← Mark onboarding done, refresh JWT
│       │   ├── set-plan/              ← Update plan type, refresh JWT
│       │   └── google/callback/       ← Google OAuth callback
│       └── create-order/              ← Razorpay order creation
├── components/
│   ├── onboarding/
│   │   └── OnboardingFlow.tsx         ← All 7 onboarding screens
│   ├── layout/
│   │   └── dashboard-sidebar.tsx      ← Sidebar + mobile drawer + bottom tabs
│   ├── ui/
│   │   ├── testimonial-cards.tsx      ← Arc fan testimonials (Screen 3)
│   │   ├── animated-glassy-pricing.tsx ← WebGL pricing cards (Screen 5)
│   │   ├── vapour-text-effect.tsx     ← Particle text (Screen 7)
│   │   ├── liquid-glass-button.tsx    ← Glassmorphic button component
│   │   ├── shimmer-text.tsx           ← Gradient shimmer text
│   │   ├── GenerationLoader.tsx       ← AI generation progress overlay
│   │   └── UpgradePrompt.tsx          ← Upgrade modal for locked features
│   └── RazorpayButton.tsx             ← Payment button
├── lib/
│   ├── auth.ts                        ← JWT, session, createUser, grandfathering
│   ├── planAccess.ts                  ← Plan feature mapping
│   ├── featureFlags.ts                ← Runtime feature flag helper
│   └── tier-config.ts                 ← Locked routes config
├── config/
│   └── feature-flags.ts               ← Master feature flag object (flip to enable)
├── server/
│   └── routers/
│       └── auth.ts                    ← tRPC auth router (signup, login, session)
├── middleware.ts                       ← Route protection, onboarding guard
├── hooks/
│   └── useResponsive.ts               ← isMobile, isTablet, isDesktop
└── prisma/
    └── schema.prisma                  ← DB schema
```

---

## 17. BRAND IDENTITY

**Name**: Saviours AI

**Tagline**: *"Where preparation meets precision."* (ScotchDisplay italic)

**Logo**: Diamond / rhombus SVG
- Outer path: `M24 4L44 18L24 44L4 18L24 4Z` — full diamond, `stroke: --accent-gold`, `strokeWidth: 1.5`
- Inner path: `M24 4L44 18L24 32L4 18L24 4Z` — upper half, `fill: rgba(0,212,255,0.08)`
- Middle line: `M4 18L24 32L44 18` — horizontal crease, `stroke: --accent-gold`, `opacity: 0.6`
- Animated with `goldGlow` keyframe on splash

**Voice**: Direct, slightly competitive, warm. Not corporate. Copy like "10 months. Every day counts." or "We have crazy things for you." — confident, student-peer energy.

**Edition label**: "Class X · ICSE · 2027 Boards" — appears in sidebars, onboarding, emails. ScotchDisplay italic or small caps uppercase.

---

*This document reflects the product as of April 2026. Update when features are toggled live or design tokens change.*

---

## 18. FEATURE DEEP DIVES

### 18.1 Dashboard Home (`/dashboard`)

The landing page after login. Shows:
- **Time-based greeting** — "Good morning / afternoon / evening" with the user's first name
- **Rotating motivational taglines** — randomised on each load from a set of board-exam-themed lines
- **Ring stat cards** — circular SVG progress rings showing study stats fetched from `trpc.dashboard.getStudyStats`
- **Feature cards grid** — only shows cards for features with their feature flag enabled. Each card has: icon, label, one-line description, tagline in ScotchDisplay italic, and a "→" arrow that animates right on hover. Hover lifts the card 3px and applies cyan border glow.
- **Logout** via `trpc.auth.logout` mutation

The video background is fixed-position behind all content. Pages use `transparent` backgrounds so the video shows through consistently.

---

### 18.2 AI Doubt Solver (`/dashboard/ai-assistant`)

**Plan**: Free (3/day) · Monthly · Yearly

A full AI tutor chat interface for ICSE subjects.

**Two modes:**

**Chat mode** (default)
- Conversational multi-turn chat with OpenAI
- Subject selector dropdown to scope answers
- File upload: supports images (base64) and PDFs — file content is sent to the AI as context
- Responses rendered in Markdown via `react-markdown` with custom styled components (tables, code blocks, headings)
- YouTube video suggestions embedded inline when relevant — shows thumbnail, title, channel, and link
- Free users hit a 3/day limit (`AI_DOUBT_FREE_LIMIT = 3`), tracked via daily counter; prompt to upgrade shown when limit reached
- Full-screen `GenerationLoader` overlay while AI is thinking (0–95% progress animation, cycling status text)

**Flashcard mode** (toggle in UI)
- User types a topic/chapter name
- `trpc.ai.generateFlashcards` generates MCQ flashcards for that topic
- One card at a time: question → 4 options → select → instant correct/wrong feedback with colour
- Score tracked (only counts first attempt per card)
- Summary screen at end with score percentage

---

### 18.3 Smart Planner (`/dashboard/planner`)

**Plan**: Monthly · Yearly

AI-generated study schedule based on user inputs.

**Inputs:**
- Subject + chapter multi-select (fetched from DB via `trpc.content.getSubjects` + `trpc.content.getChaptersBySubject`)
- Start date, target date
- Daily study hours (slider)

**How it works:**
- User selects chapters across multiple subjects
- On submit, calls `trpc.planner.generateSmartPlan` once per subject with the selected chapters, date range, and hours
- AI returns a structured day-by-day plan with topic breakdowns
- Plans stored in DB, fetched on load via `trpc.planner.getMyPlans`
- Each plan item has a checkbox — `trpc.planner.togglePlanComplete` marks it done
- Plans can be fully cleared via `trpc.planner.clearAllPlans`
- Each plan item has a shortcut button linking to AI Doubt Solver pre-loaded with that topic

**Also contains**: To-do List tab at `?tab=todo`

---

### 18.4 Competency Test (`/dashboard/precision-practice`)

**Plan**: Monthly · Yearly

Chapter-level MCQ test with timed exam conditions and detailed post-test analytics.

**5 phases: subject → chapter → countdown → test → analytics**

**Subjects covered:**
- **Physics** — 9 chapters (Force/Work/Power/Energy, Light, Sound, Electricity & Magnetism, Heat & Calorimetry, Modern Physics, Machines & Levers, Electromagnetism, Household Circuits)
- **Mathematics** — 18+ chapters (GST, Banking, Shares, Quadratics, Matrices, AP/GP, Coordinate Geometry, Similarity, Circles, Trigonometry, Mensuration, and more)
- **Chemistry** — 15 chapters (Periodic Table, Chemical Bonding, Acids/Bases/Salts, Analytical Chemistry, Mole Concept, Electrolysis, Metallurgy, Study of Compounds × 4, Organic Chemistry × 2, Alloys, Practical Chemistry)
- **Biology** — 11 chapters (Cell Division, Genetics, Absorption, Transpiration, Photosynthesis, Endocrine System, Reproductive System, Population, Pollution, Human Evolution)
- **Computer Applications** — 18 chapters (OOP Concepts, Objects & Classes, Data Types, Operators, Input in Java, Math Methods, Conditionals, Loops, Nested For Loops, Classes, Methods, Constructors, Wrapper Classes, Encapsulation, Arrays, String Handling, Sorting & Searching, Method Overloading, Exception Handling)

**Test experience:**
- 5-second animated countdown before test starts
- Per-question timer (each question's time recorded)
- Total test timer with warning states (critical → red border)
- Mark for review functionality
- Submit early or let timer run out

**Analytics screen:**
- Overall score, accuracy %, time taken
- Per-question breakdown: correct/incorrect, time taken, which option chosen
- Insight text generated from performance patterns (e.g. "Accuracy drops after question N")
- Subject-coloured radial gradient orbs in background

---

### 18.5 Customise Test (`/dashboard/tests`)

**Plan**: Monthly · Yearly

User-configured MCQ test from the full ICSE question bank.

**3-step flow: subject → chapters → configure → test → results**

**Inputs:**
- Subject (from `ICSE_SUBJECTS` list)
- One or more chapters (from `ICSE_CHAPTERS[subject]`)
- Number of questions (configurable)
- Duration (minutes, configurable)

**Test engine:**
- Creates a test attempt via `trpc.test.createTest`
- Answers saved per-question in real-time via `trpc.test.saveAnswer`
- Mark for review: `trpc.test.markForReview`
- Submit: `trpc.test.submitTest`
- Results show score, correct answers, review of each question

---

### 18.6 Flip the Question (`/dashboard/flip-the-question`)

**Plan**: Monthly · Yearly

A Java programming challenge tool where the AI generates a question and the student writes code to solve it.

**How it works:**
1. Student clicks "Start Challenge" → `trpc.flip.generateChallenge` generates a Java programming problem
2. Challenge shown with topic label, problem statement, expected output format
3. Student writes Java code in a **CodeMirror 6** editor (One Dark theme, Java syntax highlighting)
4. Hint system: `trpc.flip.getHint` provides hints with a score penalty
5. Give up option: `trpc.flip.giveUp` reveals the solution
6. Submit: `trpc.flip.evaluateSubmission` — AI evaluates the code against 4 rubric dimensions:
   - **Output Correctness** (40 marks)
   - **Code Structure** (20 marks)
   - **Logic** (20 marks)
   - **Code Quality** (20 marks)
   - **Bonus** marks available
   - **Hint Penalty** deducted

**Score display:** Custom `ScoreCard` components per rubric dimension with colour-coded percentage bars. Verdict text based on total score:
- 90%+ → "Board exam ready. Examiner would give full marks."
- 75%+ → "Strong attempt. Minor fixes needed."
- 50%+ → "Core logic works but structure needs improvement."
- Below 50 → needs significant work

**Streak system:** `streak` and `bestStreak` tracked via `trpc.flip.getStats` and displayed in the header. Streak increments on successful submissions.

---

### 18.7 Focus Mode (`/dashboard/focus`)

**Plan**: Monthly · Yearly

Structured study session timer with Pomodoro and deep focus options.

**Setup inputs:**
- Subject (free text)
- Task type: Learn New Topic · Revision · Practice Problems
- Total duration in minutes
- Focus style:
  - **Pomodoro Mode** — 25 min focus + 5 min break
  - **Deep Focus 45** — 45 min focus + 10 min break
  - **Deep Focus 60** — 60 min focus + 15 min break
  - **Custom** — user-defined focus/break minutes

**Session flow:**
- `generatePlan()` splits the total duration into alternating focus/break blocks
- Timer counts down per block
- Pause/resume available
- Visual indicator of current block type (focus vs. break)
- Session logged via `trpc.focus.logSession` on completion with subject, task type, duration, productivity rating (1–5), and optional notes

---

### 18.8 Last Night Before (`/dashboard/last-night-before`) — HIDDEN

**Plan**: Paid (Yearly/Monthly) for Physics; separate `lnbChemistryUnlocked` flag for Chemistry

Emergency revision tool for the night before an exam. Presents the highest-yield content in a compact flash format.

**Subjects**: Physics · Chemistry

**Three tabs per session set:**
- **Numericals** — key solved numericals with steps
- **Formulas** — formula sheet with derivation hints
- **Definitions** — important definitions in concise form

**Flow:**
1. Select subject (Physics or Chemistry)
2. A random `LNBSet` is picked from the data (`LNB_SETS` for Physics, `LNB_CHEMISTRY_SETS` for Chemistry)
3. Items revealed one at a time with a "reveal answer" toggle
4. Check off items as done — progress tracked in `sessionStorage`
5. "Reroll" button picks a different random set
6. Progress bar shows % of set completed with motivational text at milestones

**Access logic:**
- Free users → Physics locked (upgrade prompt)
- Chemistry locked separately — requires `lnbChemistryUnlocked: true` on the user record (separate one-time purchase via Razorpay `type: "LNB_CHEMISTRY"`)

---

### 18.9 Guess Papers (`/dashboard/guess-papers`) — HIDDEN

**Plan**: Free for Physics only; paid for all others

ICSE 2026 specimen paper practice in real exam conditions.

**9 subjects:**

| Subject | Duration | Papers |
|---|---|---|
| Mathematics | 3 hours | 2 |
| Physics | 2h 30m | 2 |
| Chemistry | 2h 30m | 2 |
| Biology | 2h 30m | 2 |
| English Language | 2h 30m | 2 |
| English Literature | 2h 30m | 2 |
| History & Civics | 2h 30m | 2 |
| Geography | 2h 30m | 2 |
| Computer Applications | 2h 30m | 2 |

**Exam flow:**
1. Select subject
2. **Reading time**: 15 minutes (configured via `READING_TIME_MINUTES`) — read questions, no writing
3. **Exam mode**: Full timed session matching real ICSE duration
4. On completion: Answer key revealed for self-marking

Physics is available to free users as a preview. All other subjects are paid-only. Free users see a lock overlay with upgrade prompt on non-Physics subjects.

---

### 18.10 Strategy AI (`/dashboard/strategy`) — HIDDEN

**Plan**: Paid

AI-generated personalised board exam strategy based on the student's self-assessed strengths/weaknesses.

**3-step wizard:**

1. **Subjects** — select which subjects you're appearing for
2. **Categorise** — for each subject, mark it as:
   - Strong (confident)
   - Average (needs work)
   - Weak (struggling)
3. **Mode** — choose strategy intensity:
   - **Survival Mode** — focus only on passing, minimum viable effort
   - **Balanced Mode** — realistic improvement across all subjects
   - **Topper Mode** — maximise marks, high effort, high reward

`trpc.strategy.generate` sends all inputs to OpenAI and returns a structured strategy plan rendered as Markdown.

---

### 18.11 Numerical Mastery (`/dashboard/numerical-mastery`) — HIDDEN

**Plan**: Unknown (no plan gate in current code — likely all users)

A structured numerical problem practice tool for Physics, covering chapter-by-chapter solved problems with PYQ (previous year question) integration.

**3-phase flow: chapters → topics → numerical**

**Chapters covered (Physics):**
- Force, Work, Power & Energy (topics: Moment of Force/Torque, Work Done, Potential Energy, Kinetic Energy, Power, Mechanical Advantage, Efficiency of Machines)
- Light (Refractive Index, Critical Angle & Total Internal Reflection, Lens Formula, Power of a Lens)
- Sound (Echo, Frequency/Wavelength/Velocity)
- Electricity & Magnetism (and more)

**Per numerical:**
- Formula recap panel (toggleable)
- Solved steps with working shown
- PYQ toggle — reveals whether/when this numerical appeared in past papers
- "Mastered" checkbox — tracks which topics the student has completed (stored in `localStorage`)
- Chapter progress bar showing % of topics mastered
- Navigate topic-by-topic within a chapter with Previous/Next

---

### 18.12 ChronoScroll (`/dashboard/chronoscroll`) — HIDDEN

A vertically-scrolling timeline of ICSE History content designed for passive revision while scrolling (social-media-style consumption).

**Format:**
- Vertical feed of historical events/entries
- Each card has: title, content, era/period
- "Recall" quiz — tapping triggers a quick MCQ question on the current entry
- Correct/wrong feedback with shake animation on wrong answer
- Active card tracked by scroll position via `UIEvent` on the scroll container

---

### 18.13 Notes & Flashcards (`/dashboard/notes`) — HIDDEN

**Plan**: Unknown (no plan gate — likely all users)

AI-powered note creation with automatic flashcard generation.

**Note creation:**
- Title, subject, raw content (paste or type)
- On save: `trpc.content.createNote` — AI formats and refines the raw notes, then auto-generates flashcards from the content
- Notes stored in DB, listed in a grid

**Flashcard study mode:**
- Flip-card interface: front shows question, back shows answer
- Navigate card-by-card through the auto-generated deck
- `isFlipped` state toggles with a CSS transform animation

**Management:**
- View note in full
- Study flashcards from any note
- Delete note (with confirmation)

---

## 19. DATABASE SCHEMA (KEY MODELS)

### User
```
id                    String   (cuid)
email                 String   (unique)
password              String?  (null for Google users)
name                  String
role                  UserRole (STUDENT | TEACHER)
isPaid                Boolean  (legacy grandfathering flag)
planType              PlanType (FREE | MONTHLY | YEARLY)
subscriptionStatus    SubscriptionStatus (ACTIVE | EXPIRED | CANCELLED)
subscriptionExpiry    DateTime?
razorpaySubscriptionId String? (unique)
onboardingComplete    Boolean  (default: false)
authProvider          String   (credentials | google)
lnbChemistryUnlocked  Boolean  (default: false)
flipStreak            Int      (default: 0)
flipBestStreak        Int      (default: 0)
phone                 String?  (unique)
createdAt             DateTime
```

### StudentProfile
Connected 1:1 to User. Stores `grade` (default 10) and academic metadata.

### FocusSession
Stores completed focus sessions: `userId`, `subject`, `taskType`, `mode`, `durationMinutes`, `productivityRating`, `notes`, `completedAt`.

### TestAttempt + TestAnswer
Stores customise test sessions and individual question answers with timestamps.

### StudyPlan
AI-generated daily study plan items: `userId`, `subjectId`, `chapterId`, `topicName`, `scheduledDate`, `isComplete`.

### Note + Flashcard
`Note`: title, subject, raw content, AI-formatted content, userId, createdAt.
`Flashcard`: question, answer, linked to Note by `noteId`.

### FlipChallenge (implied)
Stores flip the question attempts, scores, streak data.

---

## 20. API ROUTES

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/auth/demo` | POST | No | Dev-only demo login (signup or signin mode) |
| `/api/auth/complete-onboarding` | POST | Yes | Mark onboarding done, refresh JWT |
| `/api/auth/set-plan` | POST | Yes | Update planType on user record, refresh JWT |
| `/api/auth/google/callback` | GET | No | Google OAuth callback — find/create user, set JWT |
| `/api/create-order` | POST | Yes | Create Razorpay order |
| `/api/verify-payment` | Server Action | Yes | Verify Razorpay payment signature, update user isPaid |
| `/api/trpc/[trpc]` | GET/POST | Mixed | tRPC handler — all app data operations |

### Key tRPC Routers

| Router | Procedures |
|---|---|
| `auth` | `signup`, `login`, `logout`, `getSession`, `getProfile` |
| `dashboard` | `getProfile`, `getStudyStats` |
| `ai` | `chat`, `generateFlashcards` |
| `planner` | `generateSmartPlan`, `getMyPlans`, `togglePlanComplete`, `clearAllPlans` |
| `test` | `createTest`, `saveAnswer`, `markForReview`, `submitTest` |
| `flip` | `generateChallenge`, `evaluateSubmission`, `getHint`, `giveUp`, `getStats` |
| `focus` | `logSession` |
| `strategy` | `generate` |
| `content` | `getSubjects`, `getChaptersBySubject`, `getNotes`, `createNote`, `deleteNote` |

---

## 21. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=

# Auth
JWT_SECRET=

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# OpenAI
OPENAI_API_KEY=

# Redis (for BullMQ queues)
REDIS_URL=

# App
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

---

## 22. RESPONSIVE BEHAVIOUR

Three breakpoints managed via `useResponsive` hook (`src/hooks/useResponsive.ts`):

| Device | Breakpoint | Default |
|---|---|---|
| Mobile | ≤ 768px | — |
| Tablet | 769px – 1024px | — |
| Desktop | ≥ 1025px | ✓ (SSR default) |

**Key mobile differences:**
- Sidebar hidden; replaced by hamburger drawer + bottom tab bar (64px)
- Font sizes reduced (e.g. hero text 52px → 80px desktop)
- Grid layouts collapse to single column
- Padding reduced (24px instead of 40–52px)
- Input font size forced to 16px to prevent iOS zoom
- Testimonial arc: radius 160px (vs 280px desktop), cards 240×340px (vs 300×400px)
- Vapour text: 32px font (vs 52px desktop)
- Bottom tab bar accounts for safe area inset (`env(safe-area-inset-bottom)`)

---

*This document reflects the product as of April 2026. Update when features are toggled live or design tokens change.*
