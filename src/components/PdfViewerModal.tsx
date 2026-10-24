"use client";

import { useEffect } from "react";

/**
 * In-page PDF viewer modal. Renders the PDF inline via an <iframe> (browsers
 * have a built-in PDF renderer) so it works offline with base64 data URLs and
 * needs no external library. Includes a Download button.
 */
export default function PdfViewerModal({
  open,
  onClose,
  src,
  fileName,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  fileName: string;
}) {
  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Syllabus: ${fileName}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/70 p-2 sm:p-6"
      onMouseDown={(e) => {
        // Close when clicking the backdrop (but not the panel).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-ink">
              <FileIcon />
            </span>
            <p className="truncate text-sm font-medium">{fileName}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={src}
              download={fileName}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              <DownloadIcon />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* PDF body */}
        <div className="min-h-0 flex-1 bg-neutral-200 dark:bg-neutral-800">
          <iframe
            src={src}
            title={`Syllabus: ${fileName}`}
            className="h-full w-full"
          />
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

function DownloadIcon() {
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
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
