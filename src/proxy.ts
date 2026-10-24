import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk middleware (Next.js 16 names this file `proxy.ts`). It makes the user's
 * auth state available throughout the app. Routes are public by default;
 * individual pages/handlers protect themselves with `await auth.protect()` or
 * by checking `auth()` — see the teacher portal and dashboard guards.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
