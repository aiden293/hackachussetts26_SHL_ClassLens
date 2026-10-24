/**
 * Sample Boston University course data.
 * This is a stand-in until the Supabase database is wired up.
 * Course codes at BU follow the pattern: <College> <Department> <Number>.
 */

export type Course = {
  id: string;
  college: string;
  department: string;
  number: string;
  code: string; // e.g. "CAS CS 111"
  title: string;
  credits: number;
  professor: string;
  /**
   * Id of the teacher account that owns (teaches) this course.
   * Only the owner can edit the description or upload a syllabus.
   * Links to a user id in src/lib/auth/accounts.ts.
   */
  ownerId?: string;
  description: string;
  rating: number; // out of 5
  reviewsCount: number;
  level: string;
  semester: string;
};

export const sampleCourses: Course[] = [
  {
    id: "cas-cs-111",
    college: "CAS",
    department: "CS",
    number: "111",
    code: "CAS CS 111",
    title: "Introduction to Computer Science I",
    credits: 4,
    professor: "Dr. Sofia Reyes",
    ownerId: "teacher-reyes",
    description:
      "The first course for computer science majors. Programming in Python, problem solving, algorithms, and an introduction to data structures.",
    rating: 4.3,
    reviewsCount: 128,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "cas-cs-112",
    college: "CAS",
    department: "CS",
    number: "112",
    code: "CAS CS 112",
    title: "Introduction to Computer Science II",
    credits: 4,
    professor: "Aaron Bloomberg",
    description:
      "Continuation of CS 111. Object-oriented programming in Java, inheritance, polymorphism, and an in-depth look at data structures and complexity.",
    rating: 4.1,
    reviewsCount: 96,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "cas-cs-330",
    college: "CAS",
    department: "CS",
    number: "330",
    code: "CAS CS 330",
    title: "Introduction to Algorithms",
    credits: 4,
    professor: "Dr. Sofia Reyes",
    ownerId: "teacher-reyes",
    description:
      "Design and analysis of algorithms: divide and conquer, dynamic programming, greedy methods, graph algorithms, and NP-completeness.",
    rating: 4.5,
    reviewsCount: 88,
    level: "Undergraduate",
    semester: "Spring",
  },
  {
    id: "cas-cs-411",
    college: "CAS",
    department: "CS",
    number: "411",
    code: "CAS CS 411",
    title: "Software Engineering",
    credits: 4,
    professor: "Dr. Sofia Reyes",
    ownerId: "teacher-reyes",
    description:
      "Principles of software engineering: requirements, design, testing, version control, and team-based development of a real project.",
    rating: 4.6,
    reviewsCount: 52,
    level: "Undergraduate",
    semester: "Fall",
  },
];

/* -------------------------------------------------------------------------- */
/* College & department (major) taxonomy                                      */
/* -------------------------------------------------------------------------- */

export type Department = {
  /** Short code used in course codes, e.g. "CS". */
  code: string;
  name: string;
};

export type College = {
  /** Short code, e.g. "CAS". */
  code: string;
  name: string;
  departments: Department[];
};

/**
 * BU colleges and their departments/majors.
 *
 * Intentionally scoped to CAS → Computer Science for the initial launch. The
 * filter UI and `College`/`Department` structure are kept general so this list
 * can be expanded to the full catalog (CDS, ENG, COM, QST, …) soon — just add
 * more entries here. Departments present in `sampleCourses` are also guaranteed
 * to appear via `getColleges()` below, even if not hardcoded.
 */
export const colleges: College[] = [
  {
    code: "CAS",
    name: "College of Arts & Sciences",
    departments: [{ code: "CS", name: "Computer Science" }],
  },
];

/**
 * Colleges augmented with any department codes that appear in course data but
 * aren't hardcoded above, so the filters never hide real courses. Department
 * display names fall back to the code when unknown.
 */
export function getColleges(): College[] {
  const byCode = new Map<string, College>(
    colleges.map((c) => [c.code, { ...c, departments: [...c.departments] }])
  );

  for (const course of sampleCourses) {
    let college = byCode.get(course.college);
    if (!college) {
      college = { code: course.college, name: course.college, departments: [] };
      byCode.set(course.college, college);
    }
    if (!college.departments.some((d) => d.code === course.department)) {
      college.departments.push({
        code: course.department,
        name: course.department,
      });
    }
  }

  return Array.from(byCode.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  );
}

export function getCollegeByCode(code: string): College | undefined {
  return getColleges().find((c) => c.code === code);
}

/* -------------------------------------------------------------------------- */
/* Search & filtering                                                         */
/* -------------------------------------------------------------------------- */

export type CourseFilters = {
  query?: string;
  college?: string;
  department?: string;
};

/**
 * Combined filter: applies college, department, and free-text query together.
 * Any field left empty is ignored. Returns all courses when no filters are set.
 */
export function filterCourses(filters: CourseFilters): Course[] {
  const q = filters.query?.trim().toLowerCase() ?? "";

  return sampleCourses.filter((c) => {
    if (filters.college && c.college !== filters.college) return false;
    if (filters.department && c.department !== filters.department) return false;
    if (q) {
      const haystack =
        `${c.code} ${c.title} ${c.department} ${c.professor} ${c.college}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Search courses by query string against code, title, department, and professor. */
export function searchCourses(query: string): Course[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return filterCourses({ query: q });
}

export function getCourseById(id: string): Course | undefined {
  return sampleCourses.find((c) => c.id === id);
}

/** Courses owned (taught) by a given teacher account id. */
export function getCoursesByOwner(ownerId: string): Course[] {
  return sampleCourses.filter((c) => c.ownerId === ownerId);
}
