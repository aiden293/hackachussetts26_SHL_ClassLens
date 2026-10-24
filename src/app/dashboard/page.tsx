"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getCourseById } from "@/lib/data/courses";
import { useSavedCourses } from "@/lib/courses/SavedCoursesProvider";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { savedIds } = useSavedCourses();

  const savedCourses = savedIds
    .map((id) => getCourseById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Student
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-muted">
        Your course discovery home. Save courses, track reviews, and get
        recommendations.
      </p>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ActionCard
          href="/courses"
          title="Browse courses"
          description="Explore the full BU catalog with ratings and reviews."
        />
        <ActionCard
          href="/recommend"
          title="Get recommendations"
          description="Tell us your goals and get a personalized plan."
        />
        <ActionCard
          href="/reviews"
          title="Write a review"
          description="Share your experience to help other students."
        />
      </div>

      {/* Saved courses */}
      <div className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">Saved courses</h2>
          <Link
            href="/courses"
            className="text-sm font-medium text-brand-ink hover:underline"
          >
            Browse all →
          </Link>
        </div>
        {savedCourses.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center text-muted">
            You haven&apos;t saved any courses yet. Browse the catalog and hit{" "}
            <span className="font-medium text-foreground">Save</span> on a
            course to pin it here.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {savedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
              >
                <div className="font-mono text-sm font-medium text-brand-ink">
                  {course.code}
                </div>
                <h3 className="mt-2 line-clamp-2 font-semibold leading-snug">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-muted">{course.semester}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Activity placeholder */}
      <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center text-muted">
        Your reviews and discussion activity will appear here once those
        features are connected.
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
    >
      <h3 className="font-semibold group-hover:text-brand-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </Link>
  );
}
