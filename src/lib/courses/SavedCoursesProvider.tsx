"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SavedCoursesContextValue = {
  /** Set of saved course ids. */
  savedIds: string[];
  isSaved: (courseId: string) => boolean;
  toggleSave: (courseId: string) => void;
};

const SavedCoursesContext = createContext<SavedCoursesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "classlens.savedCourses";

/**
 * Tracks which courses the user has saved. Backed by localStorage for the demo;
 * swap for a Supabase `saved_courses` table (per authenticated user) later.
 */
export function SavedCoursesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Hydrate once on the client, after the initial (empty) render.
  useEffect(() => {
    let restored: string[] | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as string[];
    } catch {
      // ignore
    }
    if (restored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedIds(restored);
    }
  }, []);

  const toggleSave = useCallback((courseId: string) => {
    setSavedIds((current) => {
      const next = current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (courseId: string) => savedIds.includes(courseId),
    [savedIds]
  );

  const value = useMemo<SavedCoursesContextValue>(
    () => ({ savedIds, isSaved, toggleSave }),
    [savedIds, isSaved, toggleSave]
  );

  return (
    <SavedCoursesContext.Provider value={value}>
      {children}
    </SavedCoursesContext.Provider>
  );
}

export function useSavedCourses(): SavedCoursesContextValue {
  const ctx = useContext(SavedCoursesContext);
  if (!ctx) {
    throw new Error(
      "useSavedCourses must be used within a SavedCoursesProvider"
    );
  }
  return ctx;
}
