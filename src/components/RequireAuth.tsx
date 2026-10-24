"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { UserRole } from "@/lib/auth/types";

/**
 * Client-side guard for portal pages. Shows a friendly gate instead of the
 * content when the user isn't signed in or lacks the required role.
 *
 * Note: this is UX-level protection for the mock. Real enforcement belongs on
 * the server (Supabase RLS + a server check) once the backend is connected.
 */
export default function RequireAuth({
  role,
  children,
}: {
  role?: UserRole;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center text-muted sm:px-6">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <Gate
        title="Sign in required"
        message="You need to sign in to view this page."
      />
    );
  }

  if (role && user.role !== role) {
    return (
      <Gate
        title="Teachers only"
        message={`This area is for ${role} accounts. You're signed in as a ${user.role}.`}
      />
    );
  }

  return <>{children}</>;
}

function Gate({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand-ink">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted">{message}</p>
      <Link
        href="/signin"
        className="mt-6 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
      >
        Go to sign in
      </Link>
    </div>
  );
}
