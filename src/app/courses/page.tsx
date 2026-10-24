import Link from "next/link";
import { Suspense } from "react";
import {
  filterCourses,
  getCollegeByCode,
  type Course,
} from "@/lib/data/courses";
import CourseFilters from "@/components/CourseFilters";

type SearchParams = {
  q?: string | string[];
  college?: string | string[];
  dept?: string | string[];
};

// This page reads searchParams, so it renders per request (not statically
// prerendered). `instant = false` opts the route into blocking rendering.
export const instant = false;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = first(params.q);
  const college = first(params.college);
  const department = first(params.dept);

  const courses = filterCourses({ query, college, department });

  const collegeInfo = college ? getCollegeByCode(college) : undefined;
  const deptInfo = collegeInfo?.departments.find((d) => d.code === department);

  // Human-readable summary of the active filters.
  const activeBits: string[] = [];
  if (collegeInfo) activeBits.push(collegeInfo.code);
  if (deptInfo) activeBits.push(deptInfo.code);
  if (query) activeBits.push(`"${query}"`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="mt-1 text-muted">
          Browse Boston University courses by college, major, or search.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <Suspense
          fallback={
            <div className="text-sm text-muted">Loading filters…</div>
          }
        >
          {/* Key by the active filter values so the client component remounts
              with fresh URL-derived state after navigation (incl. back/forward). */}
          <CourseFilters key={`${college}|${department}|${query}`} />
        </Suspense>

        {/* Results */}
        <section>
          <p className="text-sm text-muted">
            {courses.length} course{courses.length === 1 ? "" : "s"}
            {activeBits.length > 0 ? (
              <>
                {" "}·{" "}
                <span className="font-medium text-foreground">
                  {activeBits.join(" · ")}
                </span>
              </>
            ) : null}
          </p>

          {courses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-muted">
                No courses match these filters. Try widening your search or
                clearing a filter.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-brand-ink">
          {course.code}
        </span>
        {course.reviewsCount > 0 && (
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
        )}
      </div>
      <h2 className="mt-2 font-semibold leading-snug">{course.title}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-muted">
        {course.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm text-muted">
        <span>{course.semester}</span>
        <span>{course.credits} credits</span>
      </div>
    </Link>
  );
}
