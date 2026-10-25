"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Review } from "@/lib/data/reviews";

export type NewReviewInput = {
  courseId: string;
  author?: string;
  rating: number;
  workloadHours: number;
  difficulty: number;
  wouldTakeAgain: boolean;
  semester: string;
  body: string;
};

type UserReviewsContextValue = {
  /** User-submitted reviews (localStorage), newest first. */
  userReviews: Review[];
  reviewsForCourse: (courseId: string) => Review[];
  addReview: (input: NewReviewInput) => void;
};

const UserReviewsContext = createContext<UserReviewsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "classlens.userReviews";

/**
 * Holds student-submitted reviews, layered on top of the seed reviews.
 * Backed by localStorage for the demo; moves to Supabase (per user) later.
 */
export function UserReviewsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    let restored: Review[] | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as Review[];
    } catch {
      // ignore
    }
    if (restored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserReviews(restored);
    }
  }, []);

  const addReview = useCallback((input: NewReviewInput) => {
    const review: Review = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      courseId: input.courseId,
      author: input.author?.trim() || "Anonymous",
      rating: input.rating,
      workloadHours: input.workloadHours,
      difficulty: input.difficulty,
      wouldTakeAgain: input.wouldTakeAgain,
      semester: input.semester,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
    };
    setUserReviews((current) => {
      const next = [review, ...current];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const reviewsForCourse = useCallback(
    (courseId: string) =>
      userReviews
        .filter((r) => r.courseId === courseId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [userReviews]
  );

  const value = useMemo<UserReviewsContextValue>(
    () => ({ userReviews, reviewsForCourse, addReview }),
    [userReviews, reviewsForCourse, addReview]
  );

  return (
    <UserReviewsContext.Provider value={value}>
      {children}
    </UserReviewsContext.Provider>
  );
}

export function useUserReviews(): UserReviewsContextValue {
  const ctx = useContext(UserReviewsContext);
  if (!ctx) {
    throw new Error("useUserReviews must be used within a UserReviewsProvider");
  }
  return ctx;
}
