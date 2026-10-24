import ComingSoon from "@/components/ComingSoon";

export default function ReviewsPage() {
  return (
    <ComingSoon
      title="Reviews"
      description="Read and write honest course reviews — workload, teaching style, and what you'll actually learn. Rate My Professors, reimagined for BU."
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M12 2 9 9l-7 .8 5.2 4.9L5.6 22 12 18.3 18.4 22l-1.6-7.3L22 9.8 15 9z" />
        </svg>
      }
      ctaLabel="Browse courses"
      ctaHref="/courses"
    />
  );
}
