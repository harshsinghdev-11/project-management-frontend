"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, AuthResponseData } from "@/types/api";
import { api, setStoredToken, getStoredToken, ApiError } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<User>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  changePassword: (payload: { oldPassword: string; newPassword: string }) => Promise<void>;
  refreshCurrentUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const inFlightUserPromise = React.useRef<Promise<User | null> | null>(null);

  // Fetch current user details via POST /auth/current-user
  const refreshCurrentUser = useCallback(async (): Promise<User | null> => {
    if (inFlightUserPromise.current) {
      return inFlightUserPromise.current;
    }

    const promise = (async () => {
      try {
        // Per API Contract: POST /auth/current-user (not GET)
        const data = await api.post<User>("/auth/current-user");
        setUser(data);
        return data;
      } catch {
        setUser(null);
        return null;
      } finally {
        inFlightUserPromise.current = null;
      }
    })();

    inFlightUserPromise.current = promise;
    return promise;
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const token = getStoredToken();
        // Even without localStorage token, HTTP cookies might be present
        const current = await refreshCurrentUser();
        if (!current && token) {
          // Token in localStorage was invalid
          setStoredToken(null);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [refreshCurrentUser]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<User> => {
      const data = await api.post<AuthResponseData>("/auth/login", { email, password });
      if (data?.accessToken) {
        setStoredToken(data.accessToken);
      }
      setUser(data.user);
      return data.user;
    },
    []
  );

  const register = useCallback(
    async ({
      username,
      email,
      password,
      fullName,
    }: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
    }): Promise<User> => {
      // 1. Register user
      await api.post<{ user: User }>("/auth/register", {
        username: username.toLowerCase().trim(),
        email: email.trim(),
        password,
        fullName: fullName?.trim() || undefined,
      });

      // 2. Immediately log in since email verification is not required
      return await login({ email, password });
    },
    [login]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  const changePassword = useCallback(
    async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }): Promise<void> => {
      await api.post("/auth/change-password", { oldPassword, newPassword });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        changePassword,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
