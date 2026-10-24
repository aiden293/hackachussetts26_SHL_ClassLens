import Link from "next/link";

const footerLinks = [
  {
    title: "Discover",
    links: [
      { href: "/courses", label: "Browse courses" },
      { href: "/professors", label: "Find professors" },
      { href: "/recommend", label: "AI recommendations" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/reviews", label: "Reviews" },
      { href: "/discussions", label: "Discussions" },
      { href: "/signin", label: "Sign in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <span className="text-lg tracking-tight">ClassLens</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              AI-powered course discovery built for Boston University students.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted">
          <p>
            Built for Hackachusetts 2026 &middot; ClassLens is a student project
            and is not affiliated with Boston University.
          </p>
        </div>
      </div>
    </footer>
  );
}
