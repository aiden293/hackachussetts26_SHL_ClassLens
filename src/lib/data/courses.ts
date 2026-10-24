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
    id: "cas-ma-123",
    college: "CAS",
    department: "MA",
    number: "123",
    code: "CAS MA 123",
    title: "Calculus I",
    credits: 4,
    professor: "Glenn Berman",
    description:
      "Limits, derivatives, techniques of differentiation, and applications to maxima and minima. Introduction to integration.",
    rating: 3.8,
    reviewsCount: 211,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "cas-ma-225",
    college: "CAS",
    department: "MA",
    number: "225",
    code: "CAS MA 225",
    title: "Multivariate Calculus",
    credits: 4,
    professor: "David Campbell",
    description:
      "Vectors, lines, planes, partial derivatives, multiple integrals, and vector calculus including Green's and Stokes' theorems.",
    rating: 3.9,
    reviewsCount: 142,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "cas-ec-101",
    college: "CAS",
    department: "EC",
    number: "101",
    code: "CAS EC 101",
    title: "Introductory Microeconomic Analysis",
    credits: 4,
    professor: "Michael Kiley",
    description:
      "Consumer behavior, theory of the firm, market structures, and resource allocation in a market economy.",
    rating: 4.0,
    reviewsCount: 187,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "cas-bi-108",
    college: "CAS",
    department: "BI",
    number: "108",
    code: "CAS BI 108",
    title: "Lab Investigations in Cell and Molecular Biology",
    credits: 4,
    professor: "Lynne Neuman",
    description:
      "Laboratory component exploring modern techniques in cell and molecular biology, including DNA isolation and PCR.",
    rating: 3.6,
    reviewsCount: 74,
    level: "Undergraduate",
    semester: "Spring",
  },
  {
    id: "eng-ek-125",
    college: "ENG",
    department: "EK",
    number: "125",
    code: "ENG EK 125",
    title: "Introduction to Engineering Computing",
    credits: 4,
    professor: "Christos Zacharia",
    description:
      "Introduction to programming with MATLAB and Python for engineering applications, numerical methods, and data visualization.",
    rating: 4.2,
    reviewsCount: 63,
    level: "Undergraduate",
    semester: "Fall",
  },
  {
    id: "com-cm-101",
    college: "COM",
    department: "CM",
    number: "101",
    code: "COM CM 101",
    title: "The World of Communication",
    credits: 4,
    professor: "James Shanahan",
    description:
      "Survey of mass communication theories, media industries, and the role of communication in society and culture.",
    rating: 4.4,
    reviewsCount: 156,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
  {
    id: "qst-fe-101",
    college: "QST",
    department: "FE",
    number: "101",
    code: "QST FE 101",
    title: "Financial Accounting",
    credits: 4,
    professor: "Gregory Stoller",
    description:
      "Introduction to financial statements, the accounting cycle, and the analysis of corporate financial reports.",
    rating: 3.7,
    reviewsCount: 119,
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
  {
    id: "cas-ps-101",
    college: "CAS",
    department: "PS",
    number: "101",
    code: "CAS PS 101",
    title: "General Psychology",
    credits: 4,
    professor: "Helen Cronin",
    description:
      "Scientific study of human behavior, including learning, memory, perception, development, and social psychology.",
    rating: 4.1,
    reviewsCount: 203,
    level: "Undergraduate",
    semester: "Fall & Spring",
  },
];

/** Search courses by query string against code, title, department, and professor. */
export function searchCourses(query: string): Course[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return sampleCourses.filter((c) => {
    const haystack = `${c.code} ${c.title} ${c.department} ${c.professor} ${c.college}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function getCourseById(id: string): Course | undefined {
  return sampleCourses.find((c) => c.id === id);
}

/** Courses owned (taught) by a given teacher account id. */
export function getCoursesByOwner(ownerId: string): Course[] {
  return sampleCourses.filter((c) => c.ownerId === ownerId);
}
