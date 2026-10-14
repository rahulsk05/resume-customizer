"use client";

import axios from "axios";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/authService";
import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticate: (user: User) => void;
  refreshUser: () => Promise<void>;
  clearAuth: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.me();

      setUser(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticate = useCallback((authenticatedUser: User) => {
    setUser(authenticatedUser);
    setIsLoading(false);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    authenticate,
    refreshUser,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
