"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const SignIn: React.FC<Props> = ({ className }) => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="text-6xl font-bold">Sign In</div>
    </div>
  );
};
