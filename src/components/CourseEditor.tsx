"use client";

import { useRef, useState } from "react";
import type { Course } from "@/lib/data/courses";
import { useCourseEdits } from "@/lib/courses/CourseEditsProvider";

const MAX_SYLLABUS_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = [".pdf", ".doc", ".docx"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Teacher-only editor for a course's description and syllabus.
 * Persists to the CourseEditsProvider (localStorage for the demo).
 */
export default function CourseEditor({ course }: { course: Course }) {
  const { getEdit, updateDescription, setSyllabus, removeSyllabus } =
    useCourseEdits();
  const edit = getEdit(course.id);

  const currentDescription = edit?.description ?? course.description;
  const [draft, setDraft] = useState(currentDescription);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syllabus = edit?.syllabus;
  const dirty = draft.trim() !== currentDescription.trim();

  function handleSave() {
    updateDescription(course.id, draft.trim());
    setSavedAt(new Date().toLocaleTimeString());
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setFileError(`Unsupported file type. Accepted: ${ACCEPTED.join(", ")}`);
      return;
    }
    if (file.size > MAX_SYLLABUS_BYTES) {
      setFileError("File is too large (max 10 MB).");
      return;
    }

    setSyllabus(course.id, {
      fileName: file.name,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Description editor */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Course description</h3>
          {savedAt && (
            <span className="text-xs text-positive">Saved at {savedAt}</span>
          )}
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className="mt-3 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm outline-none transition focus:border-brand"
          placeholder="Describe what students will learn in this course…"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted">{draft.length} characters</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft(currentDescription)}
              disabled={!dirty}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus upload */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Syllabus</h3>
        {syllabus ? (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-ink">
                <FileIcon />
              </span>
              <div>
                <p className="text-sm font-medium">{syllabus.fileName}</p>
                <p className="text-xs text-muted">
                  {formatBytes(syllabus.sizeBytes)} · uploaded{" "}
                  {new Date(syllabus.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSyllabus(course.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-red-400 hover:text-negative"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            No syllabus uploaded yet.
          </p>
        )}

        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand">
            <UploadIcon />
            {syllabus ? "Replace syllabus" : "Upload syllabus"}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              onChange={handleFile}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            PDF, DOC, or DOCX up to 10 MB. Files are stored locally in this demo;
            Supabase Storage will handle real uploads later.
          </p>
          {fileError && (
            <p className="mt-2 text-xs text-negative">{fileError}</p>
          )}
        </div>
      </div>
    </div>
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

function UploadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}
