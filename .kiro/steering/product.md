# ClassLens — Product Overview

ClassLens is an AI-powered university course discovery platform for Boston
University, built for Hackachusetts 2026. It combines Rate My Professors-style
reviews, Reddit-style discussions, and official instructor perspectives, with
AI course recommendations planned.

## Scope

- Initial launch is scoped to **CAS Computer Science** courses, with the
  filter/taxonomy structured to expand to the full catalog later.
- Course data is imported from the **official BU Course Catalog database**
  (subject `CASCS`), covering current offerings (Fall 2026 + Spring 2027).

## Roles

- **General / anonymous** — browse courses and read reviews.
- **Student** — reader access plus a personal dashboard (saved courses).
- **Instructor (teacher)** — reader access plus a teacher portal to edit a
  course's description, upload a syllabus (PDF) and images, and run a
  review analyzer. Role is stored in Clerk `publicMetadata.role`.

## Core features

- Browse courses by college → major, plus free-text search.
- Course detail pages with description, schedule data, and student reviews.
- Save / unsave courses to a personal dashboard.
- Reddit-style discussions (sort, vote, create post).
- Teacher review analyzer: per-semester + overall sentiment, themes, trends.
- Clerk authentication (sign in / sign up, student vs instructor).

## Honest limitations (current)

- The BU catalog has **no instructor data**, so `professor` is "Staff" unless
  provided elsewhere; the professors page is a placeholder.
- Reviews, saves, discussions, and teacher edits are stored client-side
  (localStorage) for the demo until a backend (Supabase) is wired up.
- The review analyzer is an offline heuristic, not an external AI model.
