"use client";

import { useMemo, useState } from "react";
import { getReviewsByCourse, type Review } from "@/lib/data/reviews";
import { useUserReviews } from "@/lib/reviews/UserReviewsProvider";

/** Student reviews for a course, with an inline "write a review" form. */
export default function CourseReviews({ courseId }: { courseId: string }) {
  const { reviewsForCourse, addReview } = useUserReviews();
  const [open, setOpen] = useState(false);

  const reviews = useMemo(() => {
    const seed = getReviewsByCourse(courseId);
    const mine = reviewsForCourse(courseId);
    return [...mine, ...seed];
  }, [courseId, reviewsForCourse]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Student reviews{" "}
          <span className="text-base font-normal text-muted">
            ({reviews.length})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          {open ? "Cancel" : "Write a review"}
        </button>
      </div>

      {open && (
        <ReviewForm
          onSubmit={(input) => {
            addReview({ ...input, courseId });
            setOpen(false);
          }}
        />
      )}

      {reviews.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No reviews yet. Be the first to review this course.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{review.author}</span>
          <span className="text-xs text-muted">· {review.semester}</span>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-rating-ink">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-amber-500"
          >
            <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z" />
          </svg>
          {review.rating}
        </span>
      </div>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-foreground">
        {review.body}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-border px-2.5 py-1">
          {review.workloadHours} hrs/week
        </span>
        <span className="rounded-full border border-border px-2.5 py-1">
          Difficulty {review.difficulty}/5
        </span>
        <span className="rounded-full border border-border px-2.5 py-1">
          {review.wouldTakeAgain ? "Would take again" : "Would not retake"}
        </span>
      </div>
    </article>
  );
}

type FormInput = {
  author: string;
  rating: number;
  workloadHours: number;
  difficulty: number;
  wouldTakeAgain: boolean;
  semester: string;
  body: string;
};

const SEMESTERS = [
  "Fall 2025",
  "Spring 2025",
  "Fall 2024",
  "Spring 2024",
];

function ReviewForm({ onSubmit }: { onSubmit: (input: FormInput) => void }) {
  const [rating, setRating] = useState(5);
  const [workloadHours, setWorkloadHours] = useState(8);
  const [difficulty, setDifficulty] = useState(3);
  const [wouldTakeAgain, setWouldTakeAgain] = useState(true);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  const canSubmit = body.trim().length >= 10;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          author,
          rating,
          workloadHours,
          difficulty,
          wouldTakeAgain,
          semester,
          body,
        });
      }}
      className="mt-4 rounded-xl border border-border bg-card p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Rating</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Semester taken</span>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">
            Workload (hrs/week): {workloadHours}
          </span>
          <input
            type="range"
            min={1}
            max={25}
            value={workloadHours}
            onChange={(e) => setWorkloadHours(Number(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">
            Difficulty: {difficulty}/5
          </span>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={wouldTakeAgain}
          onChange={(e) => setWouldTakeAgain(e.target.checked)}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        I would take this course again
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium">Display name (optional)</span>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Anonymous"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
        />
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium">Your review</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Share your experience — workload, teaching, exams, what you learned…"
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
        />
      </label>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted">
          {body.trim().length < 10
            ? "At least 10 characters."
            : "Saved locally for this demo."}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Post review
        </button>
      </div>
    </form>
  );
}
