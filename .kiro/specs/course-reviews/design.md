# Design — Student Course Reviews

## Overview

Reviews are layered: static **seed reviews** (`src/lib/data/reviews.ts`) plus
**user-submitted reviews** held in a client provider. The course detail page
renders the merged list and an inline submission form.

## Architecture

- `UserReviewsProvider` (`src/lib/reviews/UserReviewsProvider.tsx`)
  - React context backed by localStorage (`classlens.userReviews`).
  - API: `userReviews`, `reviewsForCourse(courseId)`, `addReview(input)`.
  - Hydrates from localStorage once on mount (post-hydration, matching the
    established provider pattern).
  - Mounted in `src/components/Providers.tsx` alongside the other providers.

- `CourseReviews` (`src/components/CourseReviews.tsx`) — now a client component
  - Merges `reviewsForCourse(courseId)` (newest first) with
    `getReviewsByCourse(courseId)` seed reviews.
  - Renders the count, a "Write a review" toggle, the inline `ReviewForm`, and
    the review cards.
  - `ReviewForm`: controlled inputs (rating select, semester select, workload
    and difficulty range sliders, would-take-again checkbox, optional author,
    body textarea). Submit disabled until body ≥ 10 chars.

## Data model

Reuses the existing `Review` type. User reviews get an id of
`user-<timestamp>-<rand>` and `createdAt = now`.

## Why client-side

No backend yet; localStorage keeps the demo fully interactive and matches the
saved-courses / discussions providers. A future Supabase `reviews` table
(per authenticated user) replaces the provider without changing `CourseReviews`.

## Trade-offs

- localStorage is per-browser; reviews aren't shared across devices/users yet.
- Aggregate course `rating`/`reviewsCount` on the card remain seed-derived;
  recomputing them live from user reviews is a possible enhancement.
