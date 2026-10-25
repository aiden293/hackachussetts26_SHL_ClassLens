# Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root: ClerkProvider + Providers + Navbar/Footer
│   ├── page.tsx                  # Homepage (hero, search, featured CS courses)
│   ├── courses/
│   │   ├── page.tsx              # Browse by college/major + search (server)
│   │   └── [id]/page.tsx         # Course detail (desc, schedule, reviews, save)
│   ├── reviews/page.tsx          # Search by course name → that course's reviews
│   ├── discussions/page.tsx      # Server wrapper (instant=false) → client
│   ├── dashboard/page.tsx        # Student dashboard (saved courses)
│   ├── teacher/page.tsx          # Instructor portal (editor + review analyzer)
│   ├── professors/page.tsx       # Placeholder (no instructor data in catalog)
│   ├── recommend/page.tsx        # AI recommendations placeholder
│   ├── sign-in/[[...sign-in]]/   # Clerk sign-in
│   ├── sign-up/[[...sign-up]]/   # Clerk sign-up
│   ├── signin/page.tsx           # Legacy route → links to Clerk pages
│   └── not-found.tsx
├── components/                   # Navbar, Footer, Providers, CourseFilters,
│                                 # CourseSearch, CourseEditor, CourseReviews,
│                                 # CourseDescription, ReviewAnalyzer,
│                                 # SaveCourseButton, PdfViewerModal,
│                                 # DiscussionsClient, RequireAuth, ComingSoon
├── lib/
│   ├── auth/                     # Clerk-backed AuthProvider + types
│   ├── courses/                  # CourseEditsProvider, SavedCoursesProvider
│   ├── reviews/                  # UserReviewsProvider
│   ├── discussions/              # DiscussionsProvider
│   ├── analyzer/reviewAnalyzer.ts# Offline heuristic review analysis
│   ├── data/                     # courses.ts (real BU CS catalog), reviews.ts
│   └── supabase/                 # client/server/proxy helpers (future backend)
└── proxy.ts                      # Clerk middleware (Next 16 proxy convention)

scripts/                          # One-off BU Course Catalog importer (Python)
                                  # + set_role.mjs (Clerk role helper)
.kiro/                            # Kiro steering (and specs when added)
```

## Data flow

- Course data is static (`src/lib/data/courses.ts`), generated from the BU
  catalog import under `scripts/`. Regenerate via the scripts, never hand-edit
  the big array.
- Auth/role comes from Clerk via `useAuth()` (adapter preserving the app's
  `{ user, isLoading, isTeacher, isStudent }` shape).
- Demo-mutable state (saved courses, user reviews, discussions, teacher edits)
  lives in localStorage providers under `src/lib/` and `src/components/Providers.tsx`.
