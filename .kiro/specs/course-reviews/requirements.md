# Requirements — Student Course Reviews

## Introduction

Let students read and submit reviews on a course's detail page so prospective
students can judge workload, difficulty, and teaching quality, and so the
instructor review analyzer has real data.

## Requirements

### Requirement 1 — Read reviews

**User story:** As a student, I want to see existing reviews on a course page,
so that I can decide whether to take it.

#### Acceptance Criteria
1. WHEN a user opens a course detail page THEN the system SHALL list that
   course's reviews (seed + user-submitted), newest first.
2. WHEN a course has no reviews THEN the system SHALL show an empty state
   inviting the user to be the first to review.
3. WHEN reviews exist THEN each review SHALL show author, semester, star
   rating, body, workload hours, difficulty, and would-take-again.

### Requirement 2 — Write a review

**User story:** As a student, I want to submit my own review, so that I can
share my experience.

#### Acceptance Criteria
1. WHEN a user clicks "Write a review" THEN the system SHALL show an inline
   form with rating, semester, workload, difficulty, would-take-again, an
   optional display name, and a body.
2. IF the body is shorter than 10 characters THEN the system SHALL disable
   submission.
3. WHEN a valid review is submitted THEN the system SHALL add it to the top of
   the list immediately and persist it (localStorage for the demo).
4. IF no display name is given THEN the review SHALL be attributed to
   "Anonymous".

### Requirement 3 — Analyzer integration

**User story:** As an instructor, I want submitted reviews to feed the
analyzer, so that insights reflect real feedback.

#### Acceptance Criteria
1. WHEN reviews exist for a course THEN the teacher analyzer SHALL include them
   in per-semester and overall analysis.
