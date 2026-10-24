/**
 * Course reviews.
 *
 * No seed/mock reviews — the catalog has no review data, so this starts empty.
 * (A future step can let signed-in students submit reviews, stored in Supabase
 * or a client provider.) The analyzer and review views handle the empty case.
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

/**
 * Seed reviews for CAS CS 111 (Introduction to Computer Science 1).
 *
 * These are ORIGINAL, synthetic reviews written to reflect the kinds of
 * feedback BU CS 111 students commonly give (Python, problem sets, pace,
 * autograder, labs, exams). They are NOT copied from RateMyProfessors, Reddit,
 * or any other source — that content is copyrighted. They exist so the review
 * views and the teacher analyzer have realistic demo data. Replace with real
 * user-submitted reviews once review submission is wired up.
 */
export const sampleReviews: Review[] = [
  // ---------- Fall 2025 ----------
  {
    id: "cs111-f25-1",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 5,
    workloadHours: 9,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Great first CS course. Python is beginner-friendly and the lectures build up concepts slowly. The problem sets take time but they genuinely teach you to think like a programmer. Office hours were a lifesaver.",
    createdAt: "2025-12-16",
  },
  {
    id: "cs111-f25-2",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 4,
    workloadHours: 11,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Solid intro class. The pace picks up around recursion, so don't fall behind on the psets. The autograder can be picky about edge cases but the TAs are helpful if you go to lab.",
    createdAt: "2025-12-12",
  },
  {
    id: "cs111-f25-3",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 3,
    workloadHours: 13,
    difficulty: 4,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Content is good but the workload is heavier than I expected for an intro course. Exams felt harder than the homework. If you have zero coding background, start assignments early and use the labs.",
    createdAt: "2025-12-10",
  },
  {
    id: "cs111-f25-4",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 5,
    workloadHours: 8,
    difficulty: 2,
    wouldTakeAgain: true,
    semester: "Fall 2025",
    body: "Loved it. Well organized, clear grading rubric, and the projects were actually fun to build. Coming in with a little Python helped, but the course really does start from the basics.",
    createdAt: "2025-12-08",
  },
  {
    id: "cs111-f25-5",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 2,
    workloadHours: 15,
    difficulty: 4,
    wouldTakeAgain: false,
    semester: "Fall 2025",
    body: "Struggled with the jump between lecture examples and pset difficulty. Lectures were clear but I wished there were more worked problems. Doable if you commit the hours, but it was a grind for me.",
    createdAt: "2025-12-05",
  },

  // ---------- Spring 2025 ----------
  {
    id: "cs111-s25-1",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 4,
    workloadHours: 10,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Good course to start the CS major. The labs each week keep you on track and the staff clearly care. Expect a steady stream of problem sets rather than big crunches.",
    createdAt: "2025-05-09",
  },
  {
    id: "cs111-s25-2",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 5,
    workloadHours: 9,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "One of the best-run courses I've taken at BU. Clear expectations, responsive Piazza, and the material clicks if you keep up. Recursion and data structures were tough but rewarding.",
    createdAt: "2025-05-06",
  },
  {
    id: "cs111-s25-3",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 3,
    workloadHours: 12,
    difficulty: 4,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Fair but demanding. The autograder taught me to test my own code, which was frustrating at first but useful later. Go to office hours early in the week before they get packed.",
    createdAt: "2025-05-03",
  },
  {
    id: "cs111-s25-4",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 4,
    workloadHours: 8,
    difficulty: 2,
    wouldTakeAgain: true,
    semester: "Spring 2025",
    body: "Approachable intro to programming. If you've coded before, the first half is review; the back half (recursion, basic algorithms) is where it gets interesting. Manageable workload if you don't procrastinate.",
    createdAt: "2025-04-29",
  },

  // ---------- Fall 2024 ----------
  {
    id: "cs111-f24-1",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 5,
    workloadHours: 10,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Challenging in a good way. The professor explains the 'why' behind each concept, not just syntax. Problem sets are time-consuming but you learn a ton. Highly recommend for anyone considering the CS major.",
    createdAt: "2024-12-18",
  },
  {
    id: "cs111-f24-2",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 3,
    workloadHours: 12,
    difficulty: 4,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Decent course but be ready for the workload. The exams are where grades are made or broken, so practice past problems. Labs help but attendance basically feels required to keep up.",
    createdAt: "2024-12-14",
  },
  {
    id: "cs111-f24-3",
    courseId: "cas-cs-111",
    author: "Anonymous",
    rating: 4,
    workloadHours: 9,
    difficulty: 3,
    wouldTakeAgain: true,
    semester: "Fall 2024",
    body: "Enjoyed this more than I expected. Python makes the intro gentle and the staff are supportive. The difficulty ramps near the end with recursion, but by then you've built the habits to handle it.",
    createdAt: "2024-12-11",
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
