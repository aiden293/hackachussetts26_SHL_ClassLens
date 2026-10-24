import type { Review } from "@/lib/data/reviews";

/**
 * Offline, heuristic review analyzer.
 *
 * This intentionally uses no external AI model: it computes insights from the
 * review data with simple statistics and keyword matching so it runs locally
 * with zero cost or network. The output shape is designed so a future AI-backed
 * implementation can return the same `ReviewAnalysis` and be a drop-in swap.
 */

export type Sentiment = "positive" | "neutral" | "negative";

export type ThemeInsight = {
  label: string;
  /** How many reviews mention this theme. */
  count: number;
  sentiment: Sentiment;
};

export type ReviewAnalysis = {
  totalReviews: number;
  averageRating: number;
  /** Count of reviews at each star level, index 0 = 1 star ... index 4 = 5 stars. */
  ratingDistribution: [number, number, number, number, number];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  averageWorkloadHours: number;
  averageDifficulty: number;
  wouldTakeAgainPct: number;
  themes: ThemeInsight[];
  /** A few short, auto-generated takeaways for the teacher. */
  highlights: string[];
  /** Representative quotes: one positive, one critical when available. */
  representativeQuotes: { positive?: string; critical?: string };
};

/** Theme keyword dictionary. Each theme maps to trigger words (lowercased). */
const THEME_KEYWORDS: Record<string, string[]> = {
  "Clear lectures": ["lecture", "explains", "explanation", "clear", "clarity"],
  "Heavy workload": ["workload", "psets", "problem set", "time", "heavy", "hours"],
  Difficulty: ["hard", "difficult", "challenging", "tough", "brutal", "overwhelming"],
  "Fair grading": ["grading", "fair", "exam", "exams", "autograder", "harsh", "strict"],
  "Helpful staff": ["office hours", "staff", "responsive", "helpful", "feedback", "cares"],
  "Projects & teamwork": ["project", "projects", "team", "group", "teamwork"],
  Organization: ["organized", "structured", "well organized", "organization"],
};

/** Words that push a review's text toward positive or negative sentiment. */
const POSITIVE_WORDS = [
  "great", "loved", "love", "best", "clear", "helpful", "fair", "fun",
  "rewarding", "engaging", "recommend", "excellent", "amazing", "enjoyed",
];
const NEGATIVE_WORDS = [
  "hard", "difficult", "brutal", "harsh", "strict", "overwhelming",
  "confusing", "heavy", "unfair", "disorganized", "boring", "worst",
];

function classifyRatingSentiment(rating: number): Sentiment {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}

/** Blend star rating and text keywords into a single sentiment label. */
function classifyReviewSentiment(review: Review): Sentiment {
  const text = review.body.toLowerCase();
  let score = 0;
  for (const w of POSITIVE_WORDS) if (text.includes(w)) score += 1;
  for (const w of NEGATIVE_WORDS) if (text.includes(w)) score -= 1;

  // Rating carries the most weight.
  score += (review.rating - 3) * 1.5;

  if (score > 0.5) return "positive";
  if (score < -0.5) return "negative";
  return "neutral";
}

function round(n: number, places = 1): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

export function analyzeReviews(reviews: Review[]): ReviewAnalysis | null {
  if (reviews.length === 0) return null;

  const total = reviews.length;
  const ratingDistribution: [number, number, number, number, number] = [
    0, 0, 0, 0, 0,
  ];
  let ratingSum = 0;
  let workloadSum = 0;
  let difficultySum = 0;
  let takeAgainCount = 0;
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

  for (const r of reviews) {
    const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    ratingDistribution[idx] += 1;
    ratingSum += r.rating;
    workloadSum += r.workloadHours;
    difficultySum += r.difficulty;
    if (r.wouldTakeAgain) takeAgainCount += 1;
    sentimentCounts[classifyReviewSentiment(r)] += 1;
  }

  // Theme detection.
  const themes: ThemeInsight[] = [];
  for (const [label, keywords] of Object.entries(THEME_KEYWORDS)) {
    let count = 0;
    let sentimentScore = 0;
    for (const r of reviews) {
      const text = r.body.toLowerCase();
      if (keywords.some((k) => text.includes(k))) {
        count += 1;
        const s = classifyRatingSentiment(r.rating);
        sentimentScore += s === "positive" ? 1 : s === "negative" ? -1 : 0;
      }
    }
    if (count > 0) {
      const sentiment: Sentiment =
        sentimentScore > 0 ? "positive" : sentimentScore < 0 ? "negative" : "neutral";
      themes.push({ label, count, sentiment });
    }
  }
  themes.sort((a, b) => b.count - a.count);

  const averageRating = round(ratingSum / total);
  const averageWorkloadHours = round(workloadSum / total);
  const averageDifficulty = round(difficultySum / total);
  const wouldTakeAgainPct = Math.round((takeAgainCount / total) * 100);

  // Representative quotes.
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  const bestReview = sorted[0];
  const worstReview = sorted[sorted.length - 1];
  const representativeQuotes = {
    positive: bestReview && bestReview.rating >= 4 ? bestReview.body : undefined,
    critical:
      worstReview && worstReview.rating <= 3 && worstReview.id !== bestReview?.id
        ? worstReview.body
        : undefined,
  };

  // Auto-generated highlights.
  const highlights: string[] = [];
  highlights.push(
    `${wouldTakeAgainPct}% of students would take this course again.`
  );
  if (averageDifficulty >= 4) {
    highlights.push(
      `Students rate this course as difficult (avg ${averageDifficulty}/5) with about ${averageWorkloadHours} hrs/week of work.`
    );
  } else {
    highlights.push(
      `Workload averages ${averageWorkloadHours} hrs/week at a moderate difficulty (${averageDifficulty}/5).`
    );
  }
  const topPositive = themes.find((t) => t.sentiment === "positive");
  if (topPositive) {
    highlights.push(
      `"${topPositive.label}" is the most-praised theme (${topPositive.count} mentions).`
    );
  }
  const topNegative = themes.find((t) => t.sentiment === "negative");
  if (topNegative) {
    highlights.push(
      `"${topNegative.label}" draws the most criticism (${topNegative.count} mentions) — a possible area to address.`
    );
  }

  return {
    totalReviews: total,
    averageRating,
    ratingDistribution,
    sentiment: sentimentCounts,
    averageWorkloadHours,
    averageDifficulty,
    wouldTakeAgainPct,
    themes,
    highlights,
    representativeQuotes,
  };
}
