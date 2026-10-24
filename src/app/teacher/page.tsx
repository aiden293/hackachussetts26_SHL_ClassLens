"use client";

import Link from "next/link";
import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import CourseEditor from "@/components/CourseEditor";
import ReviewAnalyzer from "@/components/ReviewAnalyzer";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getCoursesByOwner } from "@/lib/data/courses";
import { getReviewsByCourse } from "@/lib/data/reviews";

type Tab = "manage" | "analyze";

export default function TeacherPortalPage() {
  return (
    <RequireAuth role="teacher">
      <TeacherPortal />
    </RequireAuth>
  );
}

function TeacherPortal() {
  const { user } = useAuth();
  const courses = user ? getCoursesByOwner(user.id) : [];
  const [selectedId, setSelectedId] = useState<string>(
    courses[0]?.id ?? ""
  );
  const [tab, setTab] = useState<Tab>("manage");

  const selected = courses.find((c) => c.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          Teacher portal
        </span>
        {user?.department && (
          <span className="text-sm text-muted">{user.department}</span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-muted">
        Manage your course pages and analyze student feedback.
      </p>

      {courses.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center text-muted">
          You don&apos;t have any courses assigned yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Course list */}
          <aside className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Your courses ({courses.length})
            </p>
            {courses.map((course) => {
              const active = course.id === selectedId;
              const reviewCount = getReviewsByCourse(course.id).length;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedId(course.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-brand bg-brand/5"
                      : "border-border bg-card hover:border-brand"
                  }`}
                >
                  <div className="font-mono text-xs font-medium text-brand">
                    {course.code}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-sm font-medium">
                    {course.title}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {reviewCount} review{reviewCount === 1 ? "" : "s"}
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Detail panel */}
          <section>
            {selected ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {selected.title}
                    </h2>
                    <Link
                      href={`/courses/${selected.id}`}
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      View public page →
                    </Link>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex gap-1 rounded-xl border border-border bg-card p-1">
                  <TabButton
                    active={tab === "manage"}
                    onClick={() => setTab("manage")}
                  >
                    Manage course
                  </TabButton>
                  <TabButton
                    active={tab === "analyze"}
                    onClick={() => setTab("analyze")}
                  >
                    Review analyzer
                  </TabButton>
                </div>

                <div className="mt-6">
                  {tab === "manage" ? (
                    <CourseEditor course={selected} />
                  ) : (
                    <ReviewAnalyzer courseId={selected.id} />
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted">Select a course to get started.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand text-brand-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
