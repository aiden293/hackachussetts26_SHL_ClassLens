"use client";

import { useMemo, useState } from "react";
import { useDiscussions } from "@/lib/discussions/DiscussionsProvider";
import { sampleCourses } from "@/lib/data/courses";
import type { Thread } from "@/lib/data/discussions";

type SortKey = "hot" | "new" | "old" | "relevance";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "hot", label: "Hot" },
  { key: "new", label: "Newest" },
  { key: "old", label: "Oldest" },
  { key: "relevance", label: "Relevance" },
];

/** Hotness: votes decayed by age (simple Reddit-style gravity). */
function hotScore(thread: Thread): number {
  const ageHours =
    (Date.now() - new Date(thread.createdAt).getTime()) / 36e5;
  return thread.votes / Math.pow(ageHours + 2, 0.8);
}

/** Relevance score against a query; falls back to votes+recency when empty. */
function relevanceScore(thread: Thread, q: string): number {
  if (!q) return thread.votes + hotScore(thread);
  const haystack =
    `${thread.title} ${thread.body} ${thread.courseCode ?? ""}`.toLowerCase();
  let score = 0;
  if (thread.title.toLowerCase().includes(q)) score += 10;
  if (haystack.includes(q)) score += 5;
  // Light weighting by engagement.
  score += thread.votes * 0.05 + thread.commentCount * 0.1;
  return score;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DiscussionsClient() {
  const { threads, createThread, vote, voteFor } = useDiscussions();
  const [sort, setSort] = useState<SortKey>("hot");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const base = q
      ? threads.filter((t) =>
          `${t.title} ${t.body} ${t.courseCode ?? ""}`
            .toLowerCase()
            .includes(q)
        )
      : [...threads];

    switch (sort) {
      case "new":
        return base.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      case "old":
        return base.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
      case "relevance":
        return base.sort(
          (a, b) => relevanceScore(b, q) - relevanceScore(a, q)
        );
      case "hot":
      default:
        return base.sort((a, b) => hotScore(b) - hotScore(a));
    }
  }, [threads, sort, q]);

  // Top 3 by hotness for the highlight rail.
  const hotThreads = useMemo(
    () => [...threads].sort((a, b) => hotScore(b) - hotScore(a)).slice(0, 3),
    [threads]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
          <p className="mt-1 text-muted">
            Ask questions, share notes, and talk through CS courses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setComposerOpen((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          <PlusIcon />
          Create post
        </button>
      </div>

      {composerOpen && (
        <Composer
          onCancel={() => setComposerOpen(false)}
          onSubmit={(input) => {
            createThread(input);
            setComposerOpen(false);
            setSort("new");
          }}
        />
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Main column */}
        <div>
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    sort === s.key
                      ? "bg-brand text-brand-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search threads…"
                aria-label="Search discussions"
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand"
              />
            </div>
          </div>

          {/* Thread list */}
          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
                No threads match &ldquo;{query}&rdquo;.
              </div>
            ) : (
              filtered.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  myVote={voteFor(thread.id)}
                  onVote={(dir) => vote(thread.id, dir)}
                />
              ))
            )}
          </div>
        </div>

        {/* Hot threads rail */}
        <aside className="order-first lg:order-last">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <FlameIcon />
              Hot threads
            </h2>
            <ol className="mt-3 space-y-3">
              {hotThreads.map((thread, i) => (
                <li key={thread.id} className="flex gap-2">
                  <span className="text-sm font-bold text-muted">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">
                      {thread.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {thread.votes} votes · {thread.commentCount} comments
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ThreadCard({
  thread,
  myVote,
  onVote,
}: {
  thread: Thread;
  myVote: number;
  onVote: (dir: 1 | -1) => void;
}) {
  return (
    <article className="flex gap-3 rounded-xl border border-border bg-card p-4">
      {/* Vote rail */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => onVote(1)}
          aria-label="Upvote"
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            myVote === 1
              ? "bg-brand/10 text-brand-ink"
              : "text-muted hover:text-foreground"
          }`}
        >
          <ChevronUp />
        </button>
        <span className="text-sm font-semibold">{thread.votes}</span>
        <button
          type="button"
          onClick={() => onVote(-1)}
          aria-label="Downvote"
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            myVote === -1
              ? "bg-brand/10 text-brand-ink"
              : "text-muted hover:text-foreground"
          }`}
        >
          <ChevronDown />
        </button>
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>u/{thread.author}</span>
          <span>·</span>
          <span>{timeAgo(thread.createdAt)}</span>
          {thread.courseCode && (
            <span className="rounded-full border border-border px-2 py-0.5 font-mono font-medium text-brand-ink">
              {thread.courseCode}
            </span>
          )}
        </div>
        <h3 className="mt-1 font-semibold leading-snug">{thread.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-muted">{thread.body}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CommentIcon />
            {thread.commentCount} comments
          </span>
        </div>
      </div>
    </article>
  );
}

function Composer({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: {
    title: string;
    body: string;
    courseCode?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ title, body, courseCode: courseCode || undefined });
      }}
      className="mt-6 rounded-xl border border-border bg-card p-5"
    >
      <h2 className="text-sm font-semibold">Create a post</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Post title"
        className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="What's on your mind?"
        aria-label="Post body"
        className="mt-3 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand"
      />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          aria-label="Tag a course (optional)"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand"
        >
          <option value="">No course tag</option>
          {sampleCourses.map((c) => (
            <option key={c.id} value={c.code}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Post
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Posts are saved locally for this demo. Accounts and real posting come
        with Supabase.
      </p>
    </form>
  );
}

/* --------------------------------- Icons --------------------------------- */

function PlusIcon() {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-brand-ink"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CommentIcon() {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
