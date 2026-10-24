import Link from "next/link";
import { sampleCourses, searchCourses } from "@/lib/data/courses";

type SearchParams = { q?: string | string[] };

// This page reads searchParams, so it renders per request (not statically
// prerendered). `instant = false` opts the route into blocking rendering.
export const instant = false;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  const courses = query
    ? searchCourses(query)
    : sampleCourses;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="mt-1 text-muted">
            Browse Boston University courses, filtered by your search.
          </p>
        </div>
      </div>

      {/* Server-side search form (progressive enhancement, no client JS) */}
      <form action="/courses" method="GET" className="mt-6 flex gap-2">
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
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search by course code or title, e.g. CS 111"
            aria-label="Search courses"
            className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-base outline-none transition focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
        >
          Search
        </button>
      </form>

      <p className="mt-4 text-sm text-muted">
        {courses.length} course{courses.length === 1 ? "" : "s"}
        {query ? (
          <>
            {" "}matching <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
          </>
        ) : null}
      </p>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">
            No courses found. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-brand-ink">
                  {course.code}
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-rating-ink">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-amber-500"
                  >
                    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z" />
                  </svg>
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <h2 className="mt-2 font-semibold leading-snug">
                {course.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {course.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm text-muted">
                <span>{course.professor}</span>
                <span>{course.credits} credits</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
