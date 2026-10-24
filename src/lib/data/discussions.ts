/**
 * Sample discussion threads (Reddit-style). Stand-in until Supabase.
 * User-created threads are layered on top of these via the client-side
 * DiscussionsProvider (localStorage), since auth/backend are not wired yet.
 */

export type Thread = {
  id: string;
  title: string;
  body: string;
  author: string;
  /** Optional course code tag, e.g. "CAS CS 111". */
  courseCode?: string;
  votes: number;
  commentCount: number;
  createdAt: string; // ISO date-time
};

export const sampleThreads: Thread[] = [
  {
    id: "t-1",
    title: "Tips for surviving CS 330 problem sets?",
    body: "The dynamic programming unit is kicking my butt. How did you all approach the harder psets? Any resources that helped it click?",
    author: "algo_struggler",
    courseCode: "CAS CS 330",
    votes: 142,
    commentCount: 37,
    createdAt: "2026-10-20T14:30:00Z",
  },
  {
    id: "t-2",
    title: "CS 111 in Python vs CS 112 in Java — big jump?",
    body: "Just finished 111 and heard 112 switches to Java. How rough is the transition if you've only done Python?",
    author: "first_year_cs",
    courseCode: "CAS CS 112",
    votes: 98,
    commentCount: 24,
    createdAt: "2026-10-22T09:12:00Z",
  },
  {
    id: "t-3",
    title: "Best semester to take Software Engineering (CS 411)?",
    body: "Is the fall or spring offering better? Wondering about workload overlap with other CS courses.",
    author: "planning_ahead",
    courseCode: "CAS CS 411",
    votes: 54,
    commentCount: 11,
    createdAt: "2026-10-23T18:45:00Z",
  },
  {
    id: "t-4",
    title: "Study group forming for CS 330 final",
    body: "A few of us are meeting at Mugar twice a week. Drop a comment if you want in. Covering graph algorithms first.",
    author: "mugar_dweller",
    courseCode: "CAS CS 330",
    votes: 31,
    commentCount: 8,
    createdAt: "2026-10-24T11:05:00Z",
  },
  {
    id: "t-5",
    title: "How much does prior programming experience matter for CS 111?",
    body: "Incoming student with zero coding background. Will I be behind, or does the course really start from scratch?",
    author: "nervous_newbie",
    courseCode: "CAS CS 111",
    votes: 67,
    commentCount: 19,
    createdAt: "2026-10-18T16:20:00Z",
  },
  {
    id: "t-6",
    title: "General: favorite CS elective you've taken at BU?",
    body: "Looking to fill a slot next semester. What elective genuinely surprised you in a good way?",
    author: "elective_hunter",
    votes: 45,
    commentCount: 14,
    createdAt: "2026-10-15T13:00:00Z",
  },
];
