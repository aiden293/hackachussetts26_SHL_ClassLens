"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { searchCourses, type Course } from "@/lib/data/courses";

export default function CourseSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter results as the user types (debounced via useEffect).
  useEffect(() => {
    const id = setTimeout(() => {
      setResults(query.trim() ? searchCourses(query).slice(0, 6) : []);
    }, 120);
    return () => clearTimeout(id);
  }, [query]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/courses?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={submit} role="search" className="flex w-full gap-2">
        <div className="relative flex-1">
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
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search by course code or title, e.g. CS 111"
            aria-label="Search courses"
            className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-base text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:opacity-90"
        >
          Search
        </button>
      </form>

      {/* Live results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-xl border border-border bg-card p-2 shadow-lg scroll-thin">
          {results.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-background"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium text-brand">
                  {course.code}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Star /> {course.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm text-foreground">
                {course.title}
              </p>
              <p className="truncate text-xs text-muted">{course.professor}</p>
            </Link>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card p-4 text-sm text-muted shadow-lg">
          No courses match &ldquo;{query}&rdquo;. Try a course code like{" "}
          <span className="font-mono">CS 111</span>.
        </div>
      )}
    </div>
  );
}

function Star() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 text-amber-400"
    >
      <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z" />
    </svg>
  );
}
