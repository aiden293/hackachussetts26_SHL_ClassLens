/**
 * Sample course reviews. Stand-in until Supabase is wired up.
 * These feed both the (future) public review feed and the teacher-only
 * review analyzer.
 */

export type Review = {
  id: string;
  courseId: string;
  author: string; // display name; anonymous reviews use "Anonymous"
  rating: number; // 1-5
  /** Self-reported hours of work per week. */
  workloadHours: number;
  /** Self-reported difficulty, 1 (easy) - 5 (hard). */
  difficulty: number;
  wouldTakeAgain: boolean;
  semester: string;
  body: string;
  createdAt: string; // ISO date
};

export const sampleReviews: Review[] = [
  // ---- CAS CS 111 (owned by teacher-reyes) ----
  {
    id: "r-111-1",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 5,
    workloadHours: 8,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Professor Reyes explains concepts really clearly and the labs are well structured. Challenging but fair. I actually understood recursion for the first time.",
    createdAt: "2025-12-18",
  },
  {
    id: "r-111-2",
    courseId: "cas-cs-111",
    author: "Jordan P.",
    rating: 4,
    workloadHours: 10,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Great intro course. The pace is fast and the psets take time, but the lectures are engaging and office hours are helpful. Would recommend to anyone starting CS.",
    createdAt: "2025-12-15",
  },
  {
    id: "r-111-3",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 2,
    workloadHours: 14,
    difficulty: 4,
    wouldTakeAgain: false,
    semester: "Spring 2025",
    body: "The workload was heavy and the exams felt harder than the homework. If you have no programming background it can be overwhelming. Lectures were good though.",
    createdAt: "2025-05-10",
  },
  {
    id: "r-111-4",
    courseId: "cas-cs-111",
    author: "Mei L.",
    rating: 5,
    workloadHours: 7,
    difficulty: 2,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Loved this class. Clear grading, responsive staff, and the projects were genuinely fun. One of the best courses I have taken at BU.",
    createdAt: "2025-05-02",
  },
  {
    id: "r-111-5",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 3,
    workloadHours: 11,
    difficulty: 4,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Solid content but the autograder was strict and sometimes confusing. Difficult at times but I learned a lot. More example problems would help.",
    createdAt: "2024-12-20",
  },
  {
    id: "r-111-6",
    courseId: "cas-cs-111",
    author: "Devin K.",
    rating: 4,
    workloadHours: 9,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Well organized and the professor clearly cares. The exams were fair. Workload is manageable if you don't fall behind on the problem sets.",
    createdAt: "2024-12-11",
  },

  // ---- CAS CS 330 (owned by teacher-reyes) ----
  {
    id: "r-330-1",
    courseId: "cas-cs-330",
    author: "Anonymous",
    rating: 5,
    workloadHours: 12,
    difficulty: 5,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Hard but incredibly rewarding. The dynamic programming unit finally clicked thanks to the clear lectures. Expect to work, but you come out a much stronger programmer.",
    createdAt: "2025-05-08",
  },
  {
    id: "r-330-2",
    courseId: "cas-cs-330",
    author: "Priya S.",
    rating: 4,
    workloadHours: 13,
    difficulty: 5,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Challenging proofs and tough psets. The professor is knowledgeable and fair. Exams are difficult. Start the assignments early, seriously.",
    createdAt: "2025-05-01",
  },
  {
    id: "r-330-3",
    courseId: "cas-cs-330",
    author: "Anonymous",
    rating: 2,
    workloadHours: 16,
    difficulty: 5,
    wouldTakeAgain: false,
    semester: "Spring 2024",
    body: "The workload was brutal and the grading felt harsh. Lectures were clear but the gap between lecture and homework difficulty was huge.",
    createdAt: "2024-05-12",
  },
  {
    id: "r-330-4",
    courseId: "cas-cs-330",
    author: "Sam T.",
    rating: 5,
    workloadHours: 11,
    difficulty: 4,
    wouldTakeAgain: true,
    semester: "Spring 2024",
    body: "Best CS course I have taken. Difficult content delivered really well. The analysis techniques carried over to my internship interviews.",
    createdAt: "2024-05-03",
  },

  // ---- CAS CS 411 (owned by teacher-reyes) ----
  {
    id: "r-411-1",
    courseId: "cas-cs-411",
    author: "Anonymous",
    rating: 5,
    workloadHours: 10,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Loved the team project. Felt like real industry work with version control and testing. Professor gives practical, actionable feedback.",
    createdAt: "2025-12-14",
  },
  {
    id: "r-411-2",
    courseId: "cas-cs-411",
    author: "Alex R.",
    rating: 5,
    workloadHours: 9,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Great course for seeing how software is actually built. Workload is reasonable and well spread out. The guest lectures were a highlight.",
    createdAt: "2025-12-09",
  },
  {
    id: "r-411-3",
    courseId: "cas-cs-411",
    author: "Anonymous",
    rating: 3,
    workloadHours: 12,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Good material but group work can be hit or miss depending on your teammates. The professor is organized and fair with grading.",
    createdAt: "2024-12-16",
  },

];

/** All reviews for a single course, newest first. */
export function getReviewsByCourse(courseId: string): Review[] {
  return sampleReviews
    .filter((r) => r.courseId === courseId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export type SemesterGroup = {
  semester: string;
  reviews: Review[];
  /** Most recent createdAt in the group, used for chronological ordering. */
  latestDate: string;
};

/**
 * Group a course's reviews by semester, ordered newest semester first.
 * Ordering uses the latest `createdAt` within each semester so it stays correct
 * regardless of how the "Season Year" label sorts alphabetically.
 */
export function getReviewsBySemester(courseId: string): SemesterGroup[] {
  const reviews = getReviewsByCourse(courseId);
  const map = new Map<string, Review[]>();

  for (const review of reviews) {
    const existing = map.get(review.semester);
    if (existing) existing.push(review);
    else map.set(review.semester, [review]);
  }

  const groups: SemesterGroup[] = Array.from(map.entries()).map(
    ([semester, groupReviews]) => ({
      semester,
      reviews: groupReviews,
      latestDate: groupReviews.reduce(
        (latest, r) => (r.createdAt > latest ? r.createdAt : latest),
        groupReviews[0].createdAt
      ),
    })
  );

  // Newest semester first.
  groups.sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));
  return groups;
}
