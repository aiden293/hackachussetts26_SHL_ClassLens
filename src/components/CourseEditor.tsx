"use client";

import { useRef, useState } from "react";
import type { Course } from "@/lib/data/courses";
import { useCourseEdits } from "@/lib/courses/CourseEditsProvider";

// Limits are kept modest because the demo persists files in localStorage
// (~5 MB total per origin). Supabase Storage will lift these later.
const MAX_SYLLABUS_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const SYLLABUS_ACCEPT = ".pdf";
const IMAGE_ACCEPT = "image/png,image/jpeg,image/gif,image/webp";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Read a File into a base64 data URL. */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Teacher-only editor for a course's description, syllabus (PDF), and images.
 * Persists to the CourseEditsProvider (localStorage for the demo).
 */
export default function CourseEditor({ course }: { course: Course }) {
  const {
    getEdit,
    updateDescription,
    setSyllabus,
    removeSyllabus,
    addImage,
    removeImage,
  } = useCourseEdits();
  const edit = getEdit(course.id);

  const currentDescription = edit?.description ?? course.description;
  const [draft, setDraft] = useState(currentDescription);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [syllabusError, setSyllabusError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const syllabusInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const syllabus = edit?.syllabus;
  const images = edit?.images ?? [];
  const dirty = draft.trim() !== currentDescription.trim();

  function handleSave() {
    updateDescription(course.id, draft.trim());
    setSavedAt(new Date().toLocaleTimeString());
  }

  async function handleSyllabus(e: React.ChangeEvent<HTMLInputElement>) {
    setSyllabusError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setSyllabusError("Syllabus must be a PDF.");
      return;
    }
    if (file.size > MAX_SYLLABUS_BYTES) {
      setSyllabusError(
        `PDF is too large (max ${formatBytes(MAX_SYLLABUS_BYTES)}).`
      );
      return;
    }

    try {
      setBusy(true);
      const dataUrl = await readAsDataUrl(file);
      setSyllabus(course.id, {
        fileName: file.name,
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        dataUrl,
      });
    } catch {
      setSyllabusError("Could not read the file. It may be too large to store.");
    } finally {
      setBusy(false);
      if (syllabusInputRef.current) syllabusInputRef.current.value = "";
    }
  }

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    try {
      setBusy(true);
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setImageError("Only image files are allowed.");
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setImageError(
            `"${file.name}" is too large (max ${formatBytes(MAX_IMAGE_BYTES)}).`
          );
          continue;
        }
        const dataUrl = await readAsDataUrl(file);
        addImage(course.id, {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl,
        });
      }
    } catch {
      setImageError("Could not store one or more images (storage may be full).");
    } finally {
      setBusy(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
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

      {/* Syllabus upload (PDF) */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Syllabus (PDF)</h3>
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
            <div className="flex gap-2">
              <a
                href={syllabus.dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand"
              >
                View
              </a>
              <button
                type="button"
                onClick={() => removeSyllabus(course.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-red-400 hover:text-negative"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No syllabus uploaded yet.</p>
        )}

        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand aria-disabled:opacity-50">
            <UploadIcon />
            {syllabus ? "Replace PDF" : "Upload PDF"}
            <input
              ref={syllabusInputRef}
              type="file"
              accept={SYLLABUS_ACCEPT}
              onChange={handleSyllabus}
              disabled={busy}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            PDF up to {formatBytes(MAX_SYLLABUS_BYTES)}. Stored locally in this
            demo; Supabase Storage will handle real uploads later.
          </p>
          {syllabusError && (
            <p className="mt-2 text-xs text-negative">{syllabusError}</p>
          )}
        </div>
      </div>

      {/* Course images */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Course images</h3>
          <span className="text-xs text-muted">{images.length} uploaded</span>
        </div>

        {images.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <figure
                key={img.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-background"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.fileName}
                  className="h-28 w-full object-cover"
                />
                <figcaption className="truncate px-2 py-1 text-xs text-muted">
                  {img.fileName}
                </figcaption>
                <button
                  type="button"
                  onClick={() => removeImage(course.id, img.id)}
                  aria-label={`Remove ${img.fileName}`}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
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
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No images uploaded yet.</p>
        )}

        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand">
            <ImageIcon />
            Add images
            <input
              ref={imageInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              onChange={handleImages}
              disabled={busy}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            PNG, JPG, GIF, or WEBP up to {formatBytes(MAX_IMAGE_BYTES)} each. You
            can select multiple.
          </p>
          {imageError && (
            <p className="mt-2 text-xs text-negative">{imageError}</p>
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

function ImageIcon() {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}
