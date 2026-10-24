/**
 * Set a Clerk user's public_metadata.role via the Backend API.
 *
 * Usage:
 *   node scripts/set_role.mjs <userId> <role>
 *
 * Reads CLERK_SECRET_KEY from .env.local (never printed). Server-only secret.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = join(here, "..", ".env.local");

function readSecret() {
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*CLERK_SECRET_KEY\s*=\s*(.+)\s*$/);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("CLERK_SECRET_KEY not found in .env.local");
}

const [, , userId, role] = process.argv;
if (!userId || !role) {
  console.error("Usage: node scripts/set_role.mjs <userId> <role>");
  process.exit(1);
}

const secret = readSecret();

const res = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ public_metadata: { role } }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`Failed (${res.status}):`, body);
  process.exit(1);
}

const user = await res.json();
console.log(`OK — user ${userId}`);
console.log("username:", user.username);
console.log("public_metadata:", JSON.stringify(user.public_metadata));
