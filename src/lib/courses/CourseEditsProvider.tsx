"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** A teacher-uploaded syllabus reference. In production this points at a
 * Supabase Storage object; here we keep the file's metadata only. */
export type SyllabusRef = {
  fileName: string;
  sizeBytes: number;
  uploadedAt: string; // ISO date
};

/** Mutable, teacher-editable fields layered on top of the static course. */
export type CourseEdit = {
  description?: string;
  syllabus?: SyllabusRef;
};

type CourseEditsMap = Record<string, CourseEdit>;

type CourseEditsContextValue = {
  edits: CourseEditsMap;
  getEdit: (courseId: string) => CourseEdit | undefined;
  updateDescription: (courseId: string, description: string) => void;
  setSyllabus: (courseId: string, syllabus: SyllabusRef) => void;
  removeSyllabus: (courseId: string) => void;
};

const CourseEditsContext = createContext<CourseEditsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "classlens.courseEdits";

/**
 * Holds teacher edits to course descriptions and syllabi.
 *
 * Backed by localStorage for the demo. Swap the persistence calls for Supabase
 * table writes (courses table) + Storage uploads when the backend is ready.
 */
export function CourseEditsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [edits, setEdits] = useState<CourseEditsMap>({});

  // Hydrate edits from localStorage once on the client, after the initial
  // render (which matches the server's empty state). This is a deliberate
  // sync-from-external-store, hence the lint suppression.
  useEffect(() => {
    let restored: CourseEditsMap | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as CourseEditsMap;
    } catch {
      // ignore
    }
    if (restored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdits(restored);
    }
  }, []);

  const persist = useCallback((next: CourseEditsMap) => {
    setEdits(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const updateDescription = useCallback(
    (courseId: string, description: string) => {
      persist({
        ...edits,
        [courseId]: { ...edits[courseId], description },
      });
    },
    [edits, persist]
  );

  const setSyllabus = useCallback(
    (courseId: string, syllabus: SyllabusRef) => {
      persist({
        ...edits,
        [courseId]: { ...edits[courseId], syllabus },
      });
    },
    [edits, persist]
  );

  const removeSyllabus = useCallback(
    (courseId: string) => {
      const next = { ...edits };
      if (next[courseId]) {
        next[courseId] = { ...next[courseId], syllabus: undefined };
      }
      persist(next);
    },
    [edits, persist]
  );

  const getEdit = useCallback(
    (courseId: string) => edits[courseId],
    [edits]
  );

  const value = useMemo<CourseEditsContextValue>(
    () => ({
      edits,
      getEdit,
      updateDescription,
      setSyllabus,
      removeSyllabus,
    }),
    [edits, getEdit, updateDescription, setSyllabus, removeSyllabus]
  );

  return (
    <CourseEditsContext.Provider value={value}>
      {children}
    </CourseEditsContext.Provider>
  );
}

export function useCourseEdits(): CourseEditsContextValue {
  const ctx = useContext(CourseEditsContext);
  if (!ctx) {
    throw new Error("useCourseEdits must be used within a CourseEditsProvider");
  }
  return ctx;
}
