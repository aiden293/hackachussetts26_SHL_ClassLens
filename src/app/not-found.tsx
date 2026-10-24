import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="font-mono text-sm font-medium text-brand-ink">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        This page isn&apos;t on the syllabus
      </h1>
      <p className="mt-3 text-muted">
        The course or page you&apos;re looking for doesn&apos;t exist. Let&apos;s
        get you back to something useful.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/courses"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand"
        >
          Browse courses
        </Link>
      </div>
    </div>
  );
}
