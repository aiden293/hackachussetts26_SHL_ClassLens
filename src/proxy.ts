import { updateSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly "middleware" in Next.js < 16) runs before every matched
 * request. Here it keeps the Supabase auth session fresh.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
