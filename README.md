# ClassLens

AI-powered university course discovery platform built for Hackachusetts 2026.

ClassLens combines Rate My Professors-style reviews, Reddit-style discussions,
and official professor perspectives — with AI course recommendations on the
way. We're starting with Boston University, scoped to **CAS Computer Science**
courses for the initial launch and expanding to the full catalog soon.

## Tech Stack

- **Next.js 16** (App Router) with **TypeScript**
- **Tailwind CSS v4**
- **Supabase** for database and authentication (`@supabase/supabase-js` + `@supabase/ssr`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup (optional for now)

The app runs without Supabase configured — the homepage and course browsing
use local sample data. To enable auth and a real database:

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.local.example` to `.env.local`.
3. Fill in your project URL and anon key (Project Settings → API).

## Roles & Portals

ClassLens has two signed-in roles plus anonymous readers:

- **General / anonymous** — can browse courses and read reviews.
- **Student** — reader access plus a personal dashboard (`/dashboard`) for
  saved courses and activity.
- **Teacher** — reader access plus a teacher portal (`/teacher`) where they can:
  - Edit the description of courses they own
  - Upload a syllabus **PDF** (viewable/downloadable) and **course images**
    (PNG/JPG/GIF/WEBP, multiple)
  - Run the **review analyzer** on their courses

  Uploaded files are stored inline as base64 data URLs in localStorage for the
  demo (so they actually persist and render), with modest size limits
  (4 MB syllabus, 2 MB per image). Supabase Storage replaces this later. The
  syllabus and image gallery also appear on the public course detail page.

Auth is currently a **mock provider** (React context + localStorage) so the
full flow is demoable without a backend. Sign in from `/signin` and pick a demo
account:

| Account | Role | Owns |
| --- | --- | --- |
| Dr. Sofia Reyes (`sreyes@bu.edu`) | teacher | CS 111, CS 330, CS 411 |
| Jordan Park (`jpark@bu.edu`) | student | — |

The context shape is designed so Supabase auth + a `profiles` table (for roles)
can be swapped in without changing consumers.

### Review analyzer

The analyzer (`src/lib/analyzer/reviewAnalyzer.ts`) is an **offline heuristic**:
it computes rating distribution, sentiment split, workload/difficulty signals,
common themes, and auto-generated takeaways from review data — no external AI
model, so it runs locally at zero cost. Its `ReviewAnalysis` output shape is
designed so an AI-backed version can be dropped in later.

In the teacher portal the analyzer offers two views:

- **Overall** — all reviews for the course combined (the summed-up analysis).
- **Per semester** — select any semester (Fall 2025, Spring 2025, …) to analyze
  just that term's reviews.

When a course has 2+ semesters of reviews, a **semester-over-semester trends**
table also shows how average rating, would-retake %, workload, and difficulty
moved from the earliest shown semester to the most recent. Reviews are grouped
by semester via `getReviewsBySemester` in `src/lib/data/reviews.ts`, ordered by
each term's most recent review date.

## Project Structure

```
src/
├── app/                      # App Router pages
│   ├── layout.tsx            # Root layout (Providers + Navbar + Footer)
│   ├── page.tsx              # Homepage (hero + course search)
│   ├── courses/
│   │   ├── page.tsx          # Course listing: browse by college/major + search
│   │   └── [id]/page.tsx     # Course detail (desc, reviews, syllabus)
│   ├── teacher/page.tsx      # Teacher portal (edit + review analyzer)
│   ├── dashboard/page.tsx    # Student dashboard
│   ├── signin/page.tsx       # Mock demo-account sign-in
│   ├── professors/           # Placeholder
│   ├── reviews/              # Placeholder
│   ├── discussions/          # Placeholder
│   ├── recommend/            # AI recommendations placeholder
│   └── not-found.tsx         # Custom 404
├── components/               # Reusable UI components
│   ├── Navbar.tsx            # Role-aware sticky nav + account menu
│   ├── Footer.tsx
│   ├── Providers.tsx         # Client context providers wrapper
│   ├── CourseSearch.tsx      # Live search with dropdown
│   ├── CourseFilters.tsx     # Sidebar: college → major drill-down + search
│   ├── CourseDescription.tsx # Edited description + syllabus + owner edit link
│   ├── CourseReviews.tsx     # Public review list
│   ├── CourseEditor.tsx      # Teacher: edit description + upload syllabus
│   ├── ReviewAnalyzer.tsx    # Teacher: offline review analysis UI
│   ├── RequireAuth.tsx       # Client-side role guard
│   └── ComingSoon.tsx        # Placeholder page wrapper
├── lib/
│   ├── analyzer/reviewAnalyzer.ts  # Offline heuristic review analysis
│   ├── auth/                 # Mock auth: types, demo accounts, provider
│   ├── courses/CourseEditsProvider.tsx  # Teacher edits store (localStorage)
│   ├── data/
│   │   ├── courses.ts        # Sample BU courses (+ ownership) and search
│   │   └── reviews.ts        # Sample reviews per course
│   └── supabase/             # Browser/server/proxy Supabase clients
└── proxy.ts                  # Next.js proxy (formerly middleware)
```

## Roadmap

This repo is the foundation. Next steps:

- [ ] Replace mock auth with Supabase auth (BU email) + `profiles` role table
- [ ] Move courses, reviews, and edits into Supabase tables
- [ ] Syllabus uploads via Supabase Storage
- [ ] Upgrade the review analyzer to an AI-backed implementation
- [ ] Reddit-style discussion threads
- [ ] Professor profile pages
- [ ] AI-powered personalized course recommendations

## Notes

- ClassLens is a student hackathon project and is not affiliated with
  Boston University.
- Course data in `src/lib/data/courses.ts` is sample data for development.
