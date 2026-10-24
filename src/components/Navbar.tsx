"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/professors", label: "Professors" },
  { href: "/reviews", label: "Reviews" },
  { href: "/discussions", label: "Discussions" },
  { href: "/recommend", label: "Recommend" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isTeacher, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close account menu on outside click.
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, []);

  const portalHref = isTeacher ? "/teacher" : "/dashboard";
  const portalLabel = isTeacher ? "Teacher portal" : "My dashboard";

  return (
    <header className="sticky top-0 z-50 border-t-[3px] border-t-brand border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
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
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "rounded-none text-foreground shadow-[inset_0_-2px_0_var(--brand)]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
            Boston University
          </span>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 transition-colors hover:border-brand"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                  {user.avatarInitials}
                </span>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                {isTeacher && (
                  <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-ink">
                    Teacher
                  </span>
                )}
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <div className="my-1 border-t border-border" />
                  <Link
                    href={portalHref}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-background"
                  >
                    {portalLabel}
                  </Link>
                  {isTeacher && (
                    <Link
                      href="/teacher"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-background"
                    >
                      Review analyzer
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-negative hover:bg-background"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
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
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-background hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
            {user ? (
              <>
                <Link
                  href={portalHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-background hover:text-foreground"
                >
                  {portalLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-negative hover:bg-background"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-brand px-3 py-2 text-center text-sm font-medium text-brand-foreground"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
