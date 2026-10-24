"use client";

import { createContext, useContext, useMemo } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { User, UserRole } from "./types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  /** Sign the current user out (delegates to Clerk). */
  signOut: () => void;
  isTeacher: boolean;
  isStudent: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Derive 2-letter initials from a display name. */
function initials(name: string): string {
  const parts = name
    .replace(/^(dr|prof|professor|mr|ms|mrs)\.?\s+/i, "")
    .trim()
    .split(/\s+/);
  const letters = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return letters || "U";
}

/**
 * Auth provider backed by Clerk.
 *
 * Exposes the same shape the app has always consumed ({ user, isLoading,
 * isTeacher, isStudent, signOut }) so existing components don't need to change.
 * The user's role lives in Clerk `publicMetadata.role` and defaults to
 * "student" when unset. Promote a user to teacher by setting
 * publicMetadata.role = "teacher" in the Clerk dashboard.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const clerk = useClerk();

  const value = useMemo<AuthContextValue>(() => {
    const isLoading = !isLoaded;

    let user: User | null = null;
    if (isSignedIn && clerkUser) {
      const name =
        clerkUser.fullName ||
        clerkUser.username ||
        clerkUser.primaryEmailAddress?.emailAddress ||
        "User";
      const email = clerkUser.primaryEmailAddress?.emailAddress ?? "";
      const roleMeta = clerkUser.publicMetadata?.role;
      const role: UserRole = roleMeta === "teacher" ? "teacher" : "student";
      const department =
        typeof clerkUser.publicMetadata?.department === "string"
          ? (clerkUser.publicMetadata.department as string)
          : undefined;

      user = {
        id: clerkUser.id,
        name,
        email,
        role,
        department,
        avatarInitials: initials(name),
      };
    }

    return {
      user,
      isLoading,
      signOut: () => {
        void clerk.signOut();
      },
      isTeacher: user?.role === "teacher",
      isStudent: user?.role === "student",
    };
  }, [isLoaded, isSignedIn, clerkUser, clerk]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
