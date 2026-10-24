"use client";

import { AuthProvider } from "@/lib/auth/AuthProvider";
import { CourseEditsProvider } from "@/lib/courses/CourseEditsProvider";

/**
 * Client-side context providers that wrap the whole app.
 * Kept separate so the root layout can remain a Server Component.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CourseEditsProvider>{children}</CourseEditsProvider>
    </AuthProvider>
  );
}
