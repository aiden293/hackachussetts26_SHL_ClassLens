import type { User } from "./types";

/**
 * Demo accounts for the mock auth provider.
 *
 * In production these come from Supabase auth + a `profiles` table that stores
 * the role. The teacher id here matches `ownerId` on courses in
 * src/lib/data/courses.ts so a teacher only manages their own courses.
 */
export const demoAccounts: User[] = [
  {
    id: "teacher-reyes",
    name: "Dr. Sofia Reyes",
    email: "sreyes@bu.edu",
    role: "teacher",
    department: "Computer Science",
    avatarInitials: "SR",
  },
  {
    id: "student-jordan",
    name: "Jordan Park",
    email: "jpark@bu.edu",
    role: "student",
    avatarInitials: "JP",
  },
];

export function getAccountById(id: string): User | undefined {
  return demoAccounts.find((a) => a.id === id);
}
