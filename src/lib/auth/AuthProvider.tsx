"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoAccounts, getAccountById } from "./accounts";
import type { User } from "./types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  /** Sign in as a demo account by id (mock). */
  signIn: (userId: string) => void;
  signOut: () => void;
  isTeacher: boolean;
  isStudent: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "classlens.auth.userId";

/**
 * Mock auth provider backed by localStorage.
 *
 * Replace the body of signIn/signOut and the initial load with Supabase auth
 * (createClient().auth) when the backend is connected — the context shape can
 * stay the same so consumers don't change.
 */
/** Read the persisted session synchronously (client only). */
function loadPersistedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) return null;
    return getAccountById(id) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session after mount. We hydrate with `null` to match the server
  // render, then sync from localStorage once on the client. The post-hydration
  // read is a deliberate sync-from-external-store, which is why the lint rule
  // is suppressed here.
  useEffect(() => {
    const restored = loadPersistedUser();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (restored) setUser(restored);
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const signIn = useCallback((userId: string) => {
    const account = getAccountById(userId);
    if (!account) return;
    setUser(account);
    try {
      window.localStorage.setItem(STORAGE_KEY, account.id);
    } catch {
      // ignore persistence failure
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
      isTeacher: user?.role === "teacher",
      isStudent: user?.role === "student",
    }),
    [user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/** Re-export for convenience in sign-in UI. */
export { demoAccounts };
