# CampusIQ — Master Prompt
> Paste this at the start of any new chat to skip all explanation.

---

## Who I am
I am a college student (still learning MERN stack) building a real startup product — not a college project.

---

## Product: CampusIQ
**Tagline:** "The only app that knows your entire college life — not just your tasks."
**Stack:** MongoDB + Express + React + Node.js (MERN), Zustand, JWT Auth, OpenAI API
**Target users:** All Indian college students (Engineering, Medical, Arts, MBA)
**Monetization:** Free core app → Paid "Placement Mode" Pro tier at ₹149/month via Razorpay

---

## 3 Core Pillars
1. **Survive College** — Deadlines, exams, attendance, expenses. Daily panic — solved.
2. **Feel Your Campus** — Anonymous mess food + professor + hostel ratings. Hyper-local, viral.
3. **Win Placement** — DSA tracker, interview journal, offer comparison. Career in one place.

---

## What makes CampusIQ the 1% product
- **Burnout Score** — combines sleep + pending tasks + exam proximity → daily pressure index. No app does this.
- **Campus Social Ratings** — anonymous mess/professor/hostel ratings per college. Spreads virally in WhatsApp groups.
- **Placement Readiness Score** — AI judges if you're ready for placements based on your actual data.
- **Connected Intelligence** — sleep + study + money + career in one AI brain. No single app does all four for Indian students.

---

## 4 Build Phases

### Phase 1 — Week 1–5 · "The Foundation"
**Goal:** Ship something real. 10 classmates using it daily.
**Learn here:** Core MERN (React, Express, MongoDB, JWT, Axios)
- User register + login (JWT auth)
- Add tasks with deadline + priority
- Today's task dashboard
- Exam timetable entry
- Attendance % tracker per subject ← daily use, every student
- Basic profile (name, college, branch, semester)

### Phase 2 — Week 6–10 · "The Viral Layer"
**Goal:** 50 users. Mess rating spreads in college WhatsApp in 48 hours.
**Learn here:** Zustand, React Router v6, MongoDB aggregations, Recharts
- Expense tracker (daily spend log)
- Monthly budget summary
- Sleep log (bedtime + wake time + quality rating)
- CGPA + marks calculator
- ★ Mess food rating (anonymous, college-specific) ← growth engine
- ★ Professor rating (anonymous)
- ★ Hostel + canteen rating

### Phase 3 — Week 11–15 · "The Brain"
**Goal:** AI using real data. 100+ users. The "wow" moment.
**Learn here:** OpenAI API, Bull MQ, Redis, node-cron, Sentry
- Auto daily study plan (based on deadlines + sleep + workload)
- Smart expense insights ("you overspent on food this week")
- Weekly productivity report
- ★ Burnout Score (sleep + tasks + exam proximity) ← real moat
- ★ "Today's Pressure Index" — daily AI-generated score
- AI study suggestions via OpenAI API

### Phase 4 — Week 16+ · "Placement Mode (Pro)"
**Goal:** Charge ₹149/month. Students pay without thinking.
**Learn here:** Razorpay, subscription logic, feature gating, performance optimization
- DSA problem streak tracker
- Company-wise prep roadmap
- Interview experience journal
- Resume version tracker
- Offer comparison tool
- ★ Placement Readiness Score (AI-based on real user data)

---

## 90-Day Milestones
| Milestone | Target |
|-----------|--------|
| Week 1–2  | MERN boilerplate set up, auth working, app deployed live |
| Week 5    | Phase 1 live, 10 real daily users, collect feedback |
| Week 10   | Mess ratings live, 50 users, viral in college group |
| Week 15   | AI layer live, 100+ users, launch Pro tier |

---

## Success Metrics (track weekly)
- 10 daily active users before Phase 2
- 50 users before building Phase 3 AI
- Users open app 3+ days/week
- 100 users before charging money

---

## MongoDB Collections (core)
`users` `tasks` `exams` `expenses` `sleep_logs` `study_plans` `ratings` `subtasks`

## Key API Routes
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/tasks
POST   /api/tasks
GET    /api/study-plan/today
POST   /api/expenses
GET    /api/expenses/summary
POST   /api/ratings
GET    /api/ratings/:collegeId
GET    /api/ai/insights
```

---

## Folder Structure
```
/client
  /src
    /components
    /features         ← one folder per domain
      /tasks
      /expenses
      /ratings
      /planner
    /hooks
    /pages
    /store            ← Zustand root store

/server
  /src
    /modules          ← mirrors feature split
      /tasks
      /expenses
      /ratings
      /ai
    /middlewares
    /jobs             ← Bull MQ workers
    /config
    app.js
    server.js
```

---

## Deployment
- **Frontend:** Vercel (free, auto-deploy on push)
- **Backend:** Render or Railway (free tier)
- **Database:** MongoDB Atlas (free M0 cluster)
- **Payments:** Razorpay (Phase 4)

---

## 5 Iron Rules (never break these)
1. Never build Phase N+1 until Phase N has real daily users
2. Deploy on Day 1 — even a blank login page
3. Talk to 3 real students every week — watch them use it
4. Post mess ratings yourself in your college WhatsApp — that's your launch
5. You are your own first user — use CampusIQ for your own college life daily

---

## What to ask in new chats
You can ask me to help with any of these:
- "Help me build Phase 1 step by step"
- "Write the MongoDB schema for [collection]"
- "Write the API route for [feature]"
- "Help me set up MERN boilerplate"
- "Write the React component for [screen]"
- "Explain [concept] in simple words"
- "Review my code for [feature]"
- "Help me deploy to Vercel / Render"

---
*CampusIQ — Built by a student, for students. India's first complete college life OS.*
