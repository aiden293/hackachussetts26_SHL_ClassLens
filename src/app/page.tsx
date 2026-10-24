import Link from "next/link";
import CourseSearch from "@/components/CourseSearch";
import { sampleCourses } from "@/lib/data/courses";

const stats = [
  { label: "Courses", value: "12+" },
  { label: "Professors", value: "12+" },
  { label: "Reviews", value: "1.4k+" },
  { label: "Avg. rating", value: "4.0" },
];

const features = [
  {
    title: "Honest reviews",
    description:
      "Real student reviews on workload, teaching style, and what you'll actually learn.",
    icon: (
      <path d="M12 2 9 9l-7 .8 5.2 4.9L5.6 22 12 18.3 18.4 22l-1.6-7.3L22 9.8 15 9z" />
    ),
  },
  {
    title: "Open discussions",
    description:
      "Reddit-style threads to ask questions, share notes, and talk through tough classes.",
    icon: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </>
    ),
  },
  {
    title: "AI recommendations",
    description:
      "Tell ClassLens your goals and get a personalized course plan that fits your schedule.",
    icon: (
      <>
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M22 12h-4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </>
    ),
  },
];

const featured = sampleCourses.slice(0, 4);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_0%,var(--brand)_0%,transparent_60%)] opacity-[0.08]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Now in beta at Boston University
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Find courses that{" "}
              <span className="text-brand">actually deserve your time</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              ClassLens blends student reviews, professor perspectives, and
              AI recommendations so you can pick the right class before
              registration week hits.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <CourseSearch />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
                <span>Try:</span>
                {["CS 111", "Calculus", "Software Engineering"].map((term) => (
                  <Link
                    key={term}
                    href={`/courses?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border px-3 py-1 transition-colors hover:text-foreground"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-brand">{stat.value}</div>
              <div className="mt-1 text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Popular this semester
            </h2>
            <p className="mt-1 text-muted">
              The courses BU students are talking about most.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden text-sm font-medium text-brand hover:underline sm:block"
          >
            Browse all courses →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              <div className="font-mono text-sm font-medium text-brand">
                {course.code}
              </div>
              <h3 className="mt-2 line-clamp-2 font-semibold leading-snug">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{course.professor}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-amber-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z" />
                  </svg>
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-muted">
                  {course.reviewsCount} reviews
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Everything in one lens
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">
            ClassLens pulls together the pieces you currently scatter across
            five browser tabs.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
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
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-brand px-6 py-12 text-center text-brand-foreground sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get your personalized course plan
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-foreground/80">
            Tell ClassLens your major, interests, and goals — get a tailored
            schedule in seconds.
          </p>
          <Link
            href="/recommend"
            className="mt-6 inline-block rounded-lg bg-brand-foreground px-6 py-3 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
          >
            Try AI recommendations
          </Link>
        </div>
      </section>
    </>
  );
}
