import { Suspense } from "react";
import DiscussionsClient from "@/components/DiscussionsClient";

// The discussions UI sorts by a time-decayed "hot" score that reads the current
// time during render, which is dynamic. Opt the route out of static
// prerendering (Next.js 16 Cache Components) so it renders per request.
export const instant = false;

export default function DiscussionsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-12 text-muted sm:px-6">
          Loading discussions…
        </div>
      }
    >
      <DiscussionsClient />
    </Suspense>
  );
}
