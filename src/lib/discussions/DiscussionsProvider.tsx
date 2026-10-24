"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sampleThreads, type Thread } from "@/lib/data/discussions";

type NewThreadInput = {
  title: string;
  body: string;
  courseCode?: string;
  author?: string;
};

type DiscussionsContextValue = {
  /** Seed threads + any user-created threads, with vote adjustments applied. */
  threads: Thread[];
  createThread: (input: NewThreadInput) => void;
  /** Apply a +1 or -1 vote to a thread (one direction per client). */
  vote: (threadId: string, direction: 1 | -1) => void;
  /** Current client's vote on a thread: 1, -1, or 0. */
  voteFor: (threadId: string) => number;
};

const DiscussionsContext = createContext<DiscussionsContextValue | undefined>(
  undefined
);

const THREADS_KEY = "classlens.discussions.userThreads";
const VOTES_KEY = "classlens.discussions.votes";

type VotesMap = Record<string, 1 | -1>;

/**
 * Client-side discussions store (localStorage). Holds user-created threads and
 * this client's votes, layered on top of the static sample threads. Replace
 * with Supabase tables + auth later.
 */
export function DiscussionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [votes, setVotes] = useState<VotesMap>({});

  // Hydrate from localStorage once on the client.
  useEffect(() => {
    let threads: Thread[] | null = null;
    let v: VotesMap | null = null;
    try {
      const rawThreads = window.localStorage.getItem(THREADS_KEY);
      if (rawThreads) threads = JSON.parse(rawThreads) as Thread[];
      const rawVotes = window.localStorage.getItem(VOTES_KEY);
      if (rawVotes) v = JSON.parse(rawVotes) as VotesMap;
    } catch {
      // ignore
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (threads) setUserThreads(threads);
    if (v) setVotes(v);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persistThreads = useCallback((next: Thread[]) => {
    setUserThreads(next);
    try {
      window.localStorage.setItem(THREADS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const persistVotes = useCallback((next: VotesMap) => {
    setVotes(next);
    try {
      window.localStorage.setItem(VOTES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const createThread = useCallback(
    (input: NewThreadInput) => {
      const thread: Thread = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: input.title.trim(),
        body: input.body.trim(),
        author: input.author?.trim() || "You",
        courseCode: input.courseCode || undefined,
        votes: 1, // author's implicit upvote
        commentCount: 0,
        createdAt: new Date().toISOString(),
      };
      persistThreads([thread, ...userThreads]);
    },
    [userThreads, persistThreads]
  );

  const vote = useCallback(
    (threadId: string, direction: 1 | -1) => {
      const current = votes[threadId] ?? 0;
      const next = { ...votes };
      if (current === direction) {
        // Toggling off.
        delete next[threadId];
      } else {
        next[threadId] = direction;
      }
      persistVotes(next);
    },
    [votes, persistVotes]
  );

  const voteFor = useCallback(
    (threadId: string) => votes[threadId] ?? 0,
    [votes]
  );

  // Merge seed + user threads, applying this client's vote offsets.
  const threads = useMemo<Thread[]>(() => {
    const all = [...userThreads, ...sampleThreads];
    return all.map((t) => ({
      ...t,
      votes: t.votes + (votes[t.id] ?? 0),
    }));
  }, [userThreads, votes]);

  const value = useMemo<DiscussionsContextValue>(
    () => ({ threads, createThread, vote, voteFor }),
    [threads, createThread, vote, voteFor]
  );

  return (
    <DiscussionsContext.Provider value={value}>
      {children}
    </DiscussionsContext.Provider>
  );
}

export function useDiscussions(): DiscussionsContextValue {
  const ctx = useContext(DiscussionsContext);
  if (!ctx) {
    throw new Error("useDiscussions must be used within a DiscussionsProvider");
  }
  return ctx;
}
