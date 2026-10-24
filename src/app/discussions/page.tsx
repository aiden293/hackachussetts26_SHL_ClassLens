import ComingSoon from "@/components/ComingSoon";

export default function DiscussionsPage() {
  return (
    <ComingSoon
      title="Discussions"
      description="Reddit-style threads for every course. Ask questions, share notes, and work through tough material with your classmates."
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
      ctaLabel="Browse courses"
      ctaHref="/courses"
    />
  );
}
