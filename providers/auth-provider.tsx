"use client";

import { useAuth } from "@/hooks/useAuth";

export const AuthProvider: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  return null;
};
