"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.getMe();
      setUser(response);
    } catch (error) {
      localStorage.removeItem("token");
      api.setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.login(email, password);
    const { token, user } = response;

    localStorage.setItem("token", token);
    api.setAuthToken(token);
    setUser(user);

    return response;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.register(name, email, password);
    const { token, user } = response;

    localStorage.setItem("token", token);
    api.setAuthToken(token);
    setUser(user);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.setAuthToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
