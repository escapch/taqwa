"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import useAuthStore from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";

interface Props {
  className?: string;
}

export const SignIn: React.FC<Props> = ({ className }) => {
  const { signIn } = useAuthStore();
  const { closeModal } = useModal();
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);
      signIn(result.user);
      closeModal();
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };

  return (
    <div className="flex flex-col p-2 gap-3">
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-3"
          onClick={handleGoogleSignUp}
        >
          <Chrome />
          <p className="">Войти через Google</p>
        </Button>
        <Button variant="outline" className="flex items-center gap-3">
          <Github />
          <p className="">Войти через GitHub</p>
        </Button>
      </div>
    </div>
  );
};
