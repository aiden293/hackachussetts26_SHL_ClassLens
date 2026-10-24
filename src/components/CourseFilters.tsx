"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getColleges } from "@/lib/data/courses";

/**
 * Sidebar filters for the courses page: free-text search + college → major
 * (department) drill-down. State lives in the URL (?q=&college=&dept=) so it is
 * shareable and survives refresh. Selecting a college resets the department.
 */
export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const colleges = getColleges();

  // The URL is the source of truth for the college/department selects, which
  // update the URL immediately on change. Only the free-text query needs local
  // state (it's edited before submit). Keying the input by the URL value resets
  // it correctly on back/forward navigation without a sync effect.
  const college = searchParams.get("college") ?? "";
  const department = searchParams.get("dept") ?? "";
  const urlQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(urlQuery);

  const selectedCollege = colleges.find((c) => c.code === college);
  const departments = selectedCollege?.departments ?? [];

  const hasActiveFilters = Boolean(query || college || department);

  function pushFilters(next: {
    q?: string;
    college?: string;
    dept?: string;
  }) {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.college) params.set("college", next.college);
    if (next.dept) params.set("dept", next.dept);
    const qs = params.toString();
    router.push(qs ? `/courses?${qs}` : "/courses");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushFilters({ q: query, college, dept: department });
  }

  function handleCollegeChange(code: string) {
    // Changing college resets the major. College/department are URL-driven.
    pushFilters({ q: query, college: code, dept: "" });
  }

  function handleDepartmentChange(code: string) {
    pushFilters({ q: query, college, dept: code });
  }

  function clearAll() {
    setQuery("");
    router.push("/courses");
  }

  return (
    <aside className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          Search
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Code or title…"
            aria-label="Search courses"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand"
          />
        </div>
      </form>

      {/* College */}
      <div>
        <label
          htmlFor="college-select"
          className="text-xs font-semibold uppercase tracking-wide text-muted"
        >
          College
        </label>
        <select
          id="college-select"
          value={college}
          onChange={(e) => handleCollegeChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-brand"
        >
          <option value="">All colleges</option>
          {colleges.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Major / department */}
      <div>
        <label
          htmlFor="dept-select"
          className="text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Major / department
        </label>
        <select
          id="dept-select"
          value={department}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          disabled={!selectedCollege}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {selectedCollege ? "All majors" : "Select a college first"}
          </option>
          {departments.map((d) => (
            <option key={d.code} value={d.code}>
              {d.code} — {d.name}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-brand hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
