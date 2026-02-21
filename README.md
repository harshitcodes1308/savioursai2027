# 🎓 ICSE Saviours — AI Student OS

> **Your AI-powered academic operating system for ICSE Class 10 exam success.**

A full-stack, production-ready education platform that combines intelligent study planning, adaptive testing, AI-powered doubt solving, and personalized content generation — all designed specifically for the ICSE board exam syllabus.

---

## 🚀 Live Features

| #   | Feature                       | Description                                                                                            |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| 📊  | **Smart Dashboard**           | Central hub with real-time progress tracking, study streaks, upcoming tasks, and performance analytics |
| 📚  | **Subjects**                  | Full ICSE syllabus coverage across 9 subjects with chapter-wise organization                           |
| 📅  | **AI Study Planner**          | AI-generated personalized daily study schedules based on exam dates and study capacity                 |
| 🤖  | **AI Assistant**              | 24/7 ICSE-specific doubt solving powered by GPT-4o-mini with conversation history                      |
| 📝  | **Custom Tests**              | On-demand test generation by subject, chapter, and difficulty with instant grading                     |
| 🎯  | **Custom Strategy**           | AI-powered study strategy recommendations tailored to individual learning patterns                     |
| 🧘  | **Focus Mode**                | Pomodoro/Deep Focus/Light Focus timer with session tracking and analytics                              |
| 🚀  | **10-Day Sprint**             | Intensive adaptive exam prep: diagnostic test → daily assignments → performance-based adjustments      |
| 📄  | **TYQ (Test Your Knowledge)** | Subject-wise question banks with past paper questions across all 9 ICSE subjects                       |
| 📖  | **Smart Notes**               | AI-generated chapter-wise revision notes aligned with ICSE exam patterns                               |
| 👤  | **Profile**                   | Account management, subject preferences, study goals, and subscription status                          |
| 📜  | **Policies**                  | Terms of Service, Privacy Policy, Refund Policy, and Data Protection                                   |

---

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** throughout
- **TailwindCSS 4** with custom dark theme (Purple #8B5CF6 × Deep Black #030303)
- **tRPC** for end-to-end type-safe API calls
- **Recharts** for analytics visualizations
- **Lucide React** for icons
- **Manrope** + **DM Sans** typography system

### Backend

- **tRPC** API layer with 10 routers (`auth`, `dashboard`, `planner`, `content`, `ai`, `test`, `profile`, `strategy`, `focus`, `sprint15`)
- **Prisma ORM** with 20+ models
- **PostgreSQL** (Neon Serverless)
- **BullMQ** + **Redis** for background jobs
- **Jose** (JWT) for authentication
- **bcryptjs** for password hashing

### AI & Integrations

- **OpenAI GPT-4o-mini** — study plans, test generation, doubt solving, notes, strategy
- **YouTube Data API v3** — curated educational video recommendations
- **Razorpay** — payment processing (₹99 one-time access)
- **Vercel Analytics** — usage tracking

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # 14 dashboard sub-pages
│   │   ├── page.tsx        # Main dashboard
│   │   ├── ai-assistant/   # AI chat interface
│   │   ├── content/        # Content viewer
│   │   ├── focus/          # Focus timer
│   │   ├── notes/          # Smart notes
│   │   ├── planner/        # Study planner
│   │   ├── policies/       # Legal pages
│   │   ├── profile/        # User profile
│   │   ├── sprint/         # 10-day sprint (with dynamic [id] routes)
│   │   ├── strategy/       # Study strategy
│   │   ├── subjects/       # Subject browser
│   │   ├── tests/          # Custom test generator
│   │   └── tyq/            # Test Your Knowledge
│   ├── login/              # Auth — Login
│   ├── signup/             # Auth — Signup
│   ├── pricing/            # Payment page
│   └── api/                # API routes (tRPC, webhooks)
├── components/             # Shared UI components
│   ├── layout/             # Sidebar navigation
│   ├── providers/          # tRPC + React Query providers
│   └── ui/                 # Reusable UI (LazyCard, etc.)
├── data/                   # TYQ question bank data (9 subjects)
├── hooks/                  # Custom hooks (useIsMobile)
├── lib/                    # Utilities & AI logic
│   ├── ai.ts               # Core AI functions (OpenAI)
│   ├── auth.ts             # Authentication helpers
│   ├── notes-ai.ts         # Notes generation
│   ├── sprint-ai.ts        # Sprint plan generation
│   ├── strategy-ai.ts      # Strategy generation
│   ├── test-generator.ts   # Test question generation
│   ├── rate-limit.ts       # Rate limiting
│   ├── youtube.ts          # YouTube API integration
│   ├── smart-planner.ts    # Study plan algorithms
│   └── trpc/               # tRPC client setup
├── server/                 # Backend
│   ├── trpc.ts             # tRPC initialization
│   └── routers/            # 10 tRPC routers
│       ├── auth.ts         # Signup, login, sessions
│       ├── dashboard.ts    # Dashboard data aggregation
│       ├── planner.ts      # Study plan CRUD
│       ├── content.ts      # Content management
│       ├── ai.ts           # AI endpoints
│       ├── test.ts         # Test generation & grading
│       ├── profile.ts      # User profile management
│       ├── strategy.ts     # Strategy generation
│       ├── focus.ts        # Focus session tracking
│       └── sprint15.ts     # 10-day sprint system
├── middleware.ts           # Auth + payment gate middleware
└── types/                  # TypeScript type definitions

prisma/
├── schema.prisma           # Full database schema (716 lines, 20+ models)
├── seed.ts                 # Database seed data
└── migrations/             # Migration history
```

---

## 🗄️ Database Models

The Prisma schema includes 20+ models organized into:

| Category           | Models                                                                           |
| ------------------ | -------------------------------------------------------------------------------- |
| **Auth & Users**   | `User`, `Session`, `StudentProfile`, `TeacherProfile`, `AuditLog`                |
| **Curriculum**     | `Subject`, `Chapter`, `Topic`, `Content`, `RevisionChecklist`                    |
| **Study Planning** | `StudyPlan`, `DailyPlan`, `PlanAdjustment`                                       |
| **Notes & Cards**  | `Note`, `FlashCard`, `RevisionSheet`                                             |
| **Testing**        | `QuestionBank`, `Test`, `TestAttempt`, `TestResult`, `TestPerformance`           |
| **Revision**       | `RevisionSchedule`, `RevisionPlan`                                               |
| **Focus**          | `FocusSession` (Pomodoro/Deep/Light modes)                                       |
| **Sprint System**  | `Sprint15Day`, `Sprint15TestSubmission`, `DailyTestResult`, `ChapterPerformance` |
| **AI Tracking**    | `AiUsageLog`, `DoubtConversation`                                                |

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon serverless)
- OpenAI API key
- YouTube Data API key
- Razorpay API keys (for payments)

### Setup

```bash
# Clone the repository
git clone https://github.com/harshitcodes1308/icse-saviours.git
cd icse-saviours

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Run database migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

### Environment Variables

```env
DATABASE_URL=             # PostgreSQL connection string
JWT_SECRET=               # Secret for JWT token signing
OPENAI_API_KEY=           # OpenAI API key
YOUTUBE_API_KEY=          # YouTube Data API v3 key
RAZORPAY_KEY_ID=          # Razorpay key ID
RAZORPAY_KEY_SECRET=      # Razorpay key secret
```

---

## 🔐 Auth & Payment Flow

1. **Signup** → Email/password registration with role selection (Student/Teacher)
2. **Login** → JWT-based authentication (7-day expiry, HTTP-only cookies)
3. **Payment Gate** → Unpaid users redirected to pricing page (₹99 via Razorpay)
4. **Dashboard Access** → Full platform access after payment
5. **Legacy Users** → Users created before Jan 29, 2026 bypass payment gate

---

## 🎨 Design System

- **Theme**: Futuristic Purple × Deep Black
- **Primary**: `#8B5CF6` (Purple)
- **Background**: `#030303` (Deep Black)
- **Card Background**: `#0E0E10` (Soft Graphite)
- **Fonts**: Manrope (headings) + DM Sans (body)
- **Interactions**: Glassmorphism, hover micro-animations, glow effects

---

## 📊 TYQ Subject Coverage

Pre-loaded question bank data across **9 ICSE subjects**:

- Physics · Chemistry · Biology · Mathematics
- English Language · English Literature
- History & Civics · Geography · Computer Applications

---

## 👨‍💻 Author

**Harshit Singh**

---

## 📄 License

Private — All rights reserved © 2026 ICSE Saviours
