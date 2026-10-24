import Link from "next/link";

/**
 * Legacy /signin route. Auth is handled by Clerk at /sign-in and /sign-up;
 * this page points users there so existing links keep working.
 */
export default function LegacySignInPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Sign in to ClassLens</h1>
      <p className="mt-2 text-muted">
        Access your dashboard, write reviews, and join discussions.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <Link
          href="/sign-in"
          className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-brand"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
