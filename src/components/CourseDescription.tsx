"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useCourseEdits } from "@/lib/courses/CourseEditsProvider";
import PdfViewerModal from "@/components/PdfViewerModal";

/**
 * Renders a course's description with any teacher edits applied, the uploaded
 * syllabus (if any), and — for the owning teacher — a link into the portal.
 */
export default function CourseDescription({
  courseId,
  ownerId,
  fallbackDescription,
}: {
  courseId: string;
  ownerId?: string;
  fallbackDescription: string;
}) {
  const { user, isTeacher } = useAuth();
  const { getEdit } = useCourseEdits();
  const edit = getEdit(courseId);

  const [viewerOpen, setViewerOpen] = useState(false);

  const description = edit?.description ?? fallbackDescription;
  const syllabus = edit?.syllabus;
  const images = edit?.images ?? [];
  const isOwner = isTeacher && user?.id === ownerId;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course description</h2>
        {isOwner && (
          <Link
            href="/teacher"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand/5"
          >
            <PencilIcon />
            Edit in portal
          </Link>
        )}
      </div>
      <p className="mt-3 leading-relaxed text-muted">{description}</p>

      {syllabus && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-ink">
            <FileIcon />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">Syllabus available</p>
            <p className="text-xs text-muted">{syllabus.fileName}</p>
          </div>
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="rounded-lg border border-brand px-3 py-1.5 text-xs font-medium text-brand-ink transition-colors hover:bg-brand/5"
          >
            View syllabus
          </button>
        </div>
      )}

      {syllabus && (
        <PdfViewerModal
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          src={syllabus.dataUrl}
          fileName={syllabus.fileName}
        />
      )}

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Course images</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <a
                key={img.id}
                href={img.dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg border border-border bg-card"
                title={img.fileName}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.fileName}
                  className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function FileIcon() {
  return (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
