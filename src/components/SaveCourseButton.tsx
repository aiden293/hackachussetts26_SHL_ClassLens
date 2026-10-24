"use client";

import { useSavedCourses } from "@/lib/courses/SavedCoursesProvider";

/** Save / unsave toggle for a course. Persists via SavedCoursesProvider. */
export default function SaveCourseButton({
  courseId,
  className = "",
}: {
  courseId: string;
  className?: string;
}) {
  const { isSaved, toggleSave } = useSavedCourses();
  const saved = isSaved(courseId);

  return (
    <button
      type="button"
      onClick={() => toggleSave(courseId)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        saved
          ? "border-brand bg-brand/10 text-brand-ink"
          : "border-border hover:border-brand"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
