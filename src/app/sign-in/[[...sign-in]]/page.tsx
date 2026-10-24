import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Sign in to ClassLens
      </h1>
      <Suspense fallback={<div className="text-muted">Loading…</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}
