"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";

interface Props {
  className?: string;
}

export const SignIn: React.FC<Props> = ({ className }) => {
  return (
    <div className="flex flex-col p-2 gap-3">
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" className="flex items-center gap-3">
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
