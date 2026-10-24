import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById, sampleCourses } from "@/lib/data/courses";
import CourseDescription from "@/components/CourseDescription";
import CourseReviews from "@/components/CourseReviews";
import SaveCourseButton from "@/components/SaveCourseButton";

type Params = { id: string };

// This page reads dynamic params, so it renders per request (not statically
// prerendered). `instant = false` opts the route into blocking rendering.
export const instant = false;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  const related = sampleCourses
    .filter((c) => c.department === course.department && c.id !== course.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/courses"
        className="text-sm font-medium text-brand-ink hover:underline"
      >
        ← Back to courses
      </Link>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-medium text-brand-ink">
            {course.code}
          </span>
          <span className="rounded-full border border-border px-3 py-0.5 text-xs text-muted">
            {course.level}
          </span>
          <span className="rounded-full border border-border px-3 py-0.5 text-xs text-muted">
            {course.semester}
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h1>
          <SaveCourseButton courseId={course.id} className="mt-1 shrink-0" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          {course.reviewsCount > 0 ? (
            <>
              <div className="text-2xl font-bold text-rating-ink">
                {course.rating.toFixed(1)}
              </div>
              <div className="text-xs text-muted">
                Rating ({course.reviewsCount} reviews)
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-muted">—</div>
              <div className="text-xs text-muted">No reviews yet</div>
            </>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{course.credits}</div>
          <div className="text-xs text-muted">Credits</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{course.college}</div>
          <div className="text-xs text-muted">College</div>
        </div>
      </div>

      <CourseDescription
        courseId={course.id}
        ownerId={course.ownerId}
        fallbackDescription={course.description}
      />

      <CourseReviews courseId={course.id} />

      <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
        <p className="font-medium">Discussions</p>
        <p className="mt-1 text-sm text-muted">
          The discussion thread for this course will live here once Supabase is
          connected.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/discussions"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand"
          >
            Open discussions
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Related in {course.department}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand"
              >
                <div className="font-mono text-sm font-medium text-brand-ink">
                  {c.code}
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-medium">
                  {c.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
