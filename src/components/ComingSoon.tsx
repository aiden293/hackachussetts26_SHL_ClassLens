import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  /** Short label for the call-to-action button. */
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Placeholder page used while a feature area is still being built.
 * Keeps navigation consistent without throwing 404s.
 */
export default function ComingSoon({
  title,
  description,
  icon,
  ctaLabel = "Back to home",
  ctaHref = "/",
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        {icon ?? (
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
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M22 12h-4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
        )}
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-md text-muted">{description}</p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Coming soon
      </div>
      <Link
        href={ctaHref}
        className="mt-8 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
