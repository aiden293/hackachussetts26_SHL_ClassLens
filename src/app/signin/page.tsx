"use client";

import { useRouter } from "next/navigation";
import { useAuth, demoAccounts } from "@/lib/auth/AuthProvider";

export default function SignInPage() {
  const router = useRouter();
  const { user, signIn, signOut } = useAuth();

  function handleSignIn(id: string, role: string) {
    signIn(id);
    router.push(role === "teacher" ? "/teacher" : "/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to ClassLens</h1>
        <p className="mt-2 text-muted">
          Choose a demo account to explore the student and teacher experiences.
        </p>
      </div>

      {user && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
              {user.avatarInitials}
            </span>
            <div>
              <p className="text-sm font-medium">
                Signed in as {user.name}
              </p>
              <p className="text-xs text-muted capitalize">{user.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-red-400 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {demoAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => handleSignIn(account.id, account.role)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-brand"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
                {account.avatarInitials}
              </span>
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-muted">
                  {account.email}
                  {account.department ? ` · ${account.department}` : ""}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                account.role === "teacher"
                  ? "bg-brand/10 text-brand"
                  : "bg-background text-muted"
              }`}
            >
              {account.role}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
        This is a mock sign-in for the demo. Real authentication with your BU
        email will be powered by Supabase.
      </p>
    </div>
  );
}
