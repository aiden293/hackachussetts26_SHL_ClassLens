"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getProfessors, type Professor } from "@/lib/data/professors";

export default function ProfessorsPage() {
  const [query, setQuery] = useState("");
  const all = useMemo(() => getProfessors(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => {
      const haystack = `${p.name} ${p.title} ${p.department} ${p.courses
        .map((c) => `${c.code} ${c.title}`)
        .join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [all, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Professors</h1>
        <p className="mt-1 text-muted">
          Find CS professors, the courses they teach, and their ratings.
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or course, e.g. Reyes or CS 330"
          aria-label="Search professors"
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-base outline-none transition focus:border-brand"
        />
      </div>

      <p className="mt-4 text-sm text-muted">
        {results.length} professor{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center text-muted">
          No professors match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {results.map((prof) => (
            <ProfessorCard key={prof.id} professor={prof} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfessorCard({ professor }: { professor: Professor }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
          {professor.avatarInitials}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold leading-tight">{professor.name}</h2>
          <p className="text-sm text-muted">
            {professor.title} · {professor.department}
          </p>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-rating-ink">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-amber-500"
          >
            <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z" />
          </svg>
          {professor.rating.toFixed(1)}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted">{professor.bio}</p>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Teaches
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {professor.courses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs font-medium text-brand-ink transition-colors hover:border-brand"
            >
              {c.code}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        {professor.reviewsCount} review{professor.reviewsCount === 1 ? "" : "s"}{" "}
        across their courses
      </p>
    </div>
  );
}
