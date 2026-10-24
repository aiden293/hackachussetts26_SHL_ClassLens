export type UserRole = "student" | "teacher";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Teacher-only: department they teach in. */
  department?: string;
  avatarInitials: string;
};
