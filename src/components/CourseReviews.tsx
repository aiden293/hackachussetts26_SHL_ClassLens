import { getReviewsByCourse } from "@/lib/data/reviews";

/** Public list of student reviews for a course (read-only). */
export default function CourseReviews({ courseId }: { courseId: string }) {
  const reviews = getReviewsByCourse(courseId);

  if (reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Student reviews</h2>
        <div className="mt-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No reviews yet. Be the first to review this course.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">
        Student reviews{" "}
        <span className="text-base font-normal text-muted">
          ({reviews.length})
        </span>
      </h2>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-border bg-card p-5"
          >
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
        ))}
      </div>
    </div>
  );
}
