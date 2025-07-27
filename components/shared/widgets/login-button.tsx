"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginButton() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleClick = (path: string) => {
    router.push(path);
  };

  useEffect(() => {}, [user]);
  return (
    <>
      {!isAuthenticated && (
        <div className="flex gap-2">
          <Button
            className="w-full"
            variant="link"
            onClick={() => handleClick("/login")}
          >
            Войти
          </Button>
          <Button
            className="w-full dark:bg-white"
            onClick={() => handleClick("/register")}
          >
            Зарегистрироваться
          </Button>
        </div>
      )}
    </>
  );
}
