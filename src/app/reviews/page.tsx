"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sampleCourses, type Course } from "@/lib/data/courses";
import { getReviewsByCourse } from "@/lib/data/reviews";
import CourseReviews from "@/components/CourseReviews";

export default function ReviewsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Course suggestions based on the course-name search.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sampleCourses;
    return sampleCourses.filter((c) =>
      `${c.code} ${c.title}`.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = selectedId
    ? sampleCourses.find((c) => c.id === selectedId) ?? null
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-muted">
          Search for a course to read what students say about it.
        </p>
      </div>

      {/* Course search */}
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
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedId(null);
          }}
          placeholder="Search by course name or code, e.g. Algorithms or CS 330"
          aria-label="Search courses by name"
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-base outline-none transition focus:border-brand"
        />
      </div>

      {/* Course picker */}
      {!selected && (
        <div className="mt-6">
          <p className="text-sm text-muted">
            {matches.length} course{matches.length === 1 ? "" : "s"} — pick one
            to see its reviews
          </p>
          {matches.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center text-muted">
              No courses match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {matches.map((course) => (
                <CoursePick
                  key={course.id}
                  course={course}
                  onSelect={() => setSelectedId(course.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected course reviews */}
      {selected && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-sm font-medium text-brand-ink hover:underline"
          >
            ← Back to course list
          </button>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <span className="font-mono text-sm font-medium text-brand-ink">
                {selected.code}
              </span>
              <h2 className="font-semibold">{selected.title}</h2>
              <p className="text-sm text-muted">{selected.professor}</p>
            </div>
            <Link
              href={`/courses/${selected.id}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand"
            >
              Course page
            </Link>
          </div>

          <CourseReviews courseId={selected.id} />
        </div>
      )}
    </div>
  );
}

function CoursePick({
  course,
  onSelect,
}: {
  course: Course;
  onSelect: () => void;
}) {
  const reviewCount = getReviewsByCourse(course.id).length;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-brand"
    >
      <div className="min-w-0">
        <span className="font-mono text-sm font-medium text-brand-ink">
          {course.code}
        </span>
        <p className="truncate font-medium">{course.title}</p>
      </div>
      <span className="ml-3 shrink-0 rounded-full bg-background px-2.5 py-1 text-xs text-muted">
        {reviewCount} review{reviewCount === 1 ? "" : "s"}
      </span>
    </button>
  );
}
