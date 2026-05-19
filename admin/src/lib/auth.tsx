"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, getToken, setToken } from "./api";
import type { UserPublic } from "./types";

interface AuthContextValue {
  user: UserPublic | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<UserPublic>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api<UserPublic>("/auth/me")
      .then((u) => setUser(u))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && pathname !== "/login") router.replace("/login");
    if (user && pathname === "/login") router.replace("/");
  }, [user, loading, pathname, router]);

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await api<{ access_token: string; user: UserPublic }>("/auth/login", {
        method: "POST",
        body: { username, password },
        auth: false,
      });
      setToken(data.access_token);
      setUser(data.user);
      router.replace("/");
      return data.user;
    },
    [router],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
