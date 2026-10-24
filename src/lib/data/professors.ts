import { sampleCourses, type Course } from "./courses";

/**
 * Sample professor profile metadata, keyed by the professor name used in
 * `sampleCourses`. Courses taught and average rating are derived from the
 * course data so they stay in sync. This is a stand-in until Supabase.
 */
type ProfessorProfile = {
  name: string;
  title: string;
  department: string;
  email?: string;
  bio: string;
};

const professorProfiles: ProfessorProfile[] = [
  {
    name: "Dr. Sofia Reyes",
    title: "Associate Professor",
    department: "Computer Science",
    email: "sreyes@bu.edu",
    bio: "Researches algorithms and software engineering education. Teaches the intro sequence and upper-level theory courses.",
  },
  {
    name: "Aaron Bloomberg",
    title: "Senior Lecturer",
    department: "Computer Science",
    email: "abloom@bu.edu",
    bio: "Focuses on object-oriented design and data structures. Known for hands-on, project-driven lectures.",
  },
];

export type Professor = {
  id: string;
  name: string;
  title: string;
  department: string;
  email?: string;
  bio: string;
  courses: Course[];
  /** Average rating across the courses they teach. */
  rating: number;
  /** Total reviews across their courses. */
  reviewsCount: number;
  avatarInitials: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function initials(name: string): string {
  const parts = name.replace(/^(dr|prof|professor|mr|ms|mrs)\.?\s+/i, "").split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Build the professor list from course data + profile metadata. */
export function getProfessors(): Professor[] {
  const names = Array.from(new Set(sampleCourses.map((c) => c.professor)));

  return names
    .map((name) => {
      const courses = sampleCourses.filter((c) => c.professor === name);
      const profile = professorProfiles.find((p) => p.name === name);
      const reviewsCount = courses.reduce((sum, c) => sum + c.reviewsCount, 0);
      const rating =
        courses.length > 0
          ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
          : 0;

      return {
        id: slugify(name),
        name,
        title: profile?.title ?? "Instructor",
        department: profile?.department ?? "Computer Science",
        email: profile?.email,
        bio:
          profile?.bio ??
          `Teaches ${courses.length} course${courses.length === 1 ? "" : "s"} in Computer Science at Boston University.`,
        courses,
        rating: Math.round(rating * 10) / 10,
        reviewsCount,
        avatarInitials: initials(name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Filter professors by a free-text query against name, title, and courses. */
export function searchProfessors(query: string): Professor[] {
  const q = query.trim().toLowerCase();
  const all = getProfessors();
  if (!q) return all;
  return all.filter((p) => {
    const haystack = `${p.name} ${p.title} ${p.department} ${p.courses
      .map((c) => `${c.code} ${c.title}`)
      .join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function getProfessorById(id: string): Professor | undefined {
  return getProfessors().find((p) => p.id === id);
}
