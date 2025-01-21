"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import useAuthStore from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

export const AuthProvider: React.FC = () => {
  const { signIn, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      signIn(currentUser);
    });

    return () => unsubscribe();
  }, [user]);

  return null;
};
