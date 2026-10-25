"use client";

import { AuthProvider } from "@/lib/auth/AuthProvider";
import { CourseEditsProvider } from "@/lib/courses/CourseEditsProvider";
import { SavedCoursesProvider } from "@/lib/courses/SavedCoursesProvider";
import { DiscussionsProvider } from "@/lib/discussions/DiscussionsProvider";
import { UserReviewsProvider } from "@/lib/reviews/UserReviewsProvider";

/**
 * Client-side context providers that wrap the whole app.
 * Kept separate so the root layout can remain a Server Component.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CourseEditsProvider>
        <SavedCoursesProvider>
          <UserReviewsProvider>
            <DiscussionsProvider>{children}</DiscussionsProvider>
          </UserReviewsProvider>
        </SavedCoursesProvider>
      </CourseEditsProvider>
    </AuthProvider>
  );
}
