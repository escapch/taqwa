"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Container } from "../../container";
import { useRouter } from "next/navigation";
import { Header } from "../../widgets/header";
import { AuthComponent } from "../../auth-component";

interface Props {
  className?: string;
}

export const Account: React.FC<Props> = ({ className }) => {
  const [user, setUser] = useState({ username: "test" });
  const router = useRouter();

  return (
    <Container className="flex flex-col  justify-between gap-5">
      <Header headerTitle="Профиль" />
      {user && <AuthComponent />}
    </Container>
  );
};
