"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { Container } from "../container";
import { ClockWidget } from "../widgets/clock";
import { TodoList } from "../widgets/todo-list";
import { Card } from "@/components/ui/card";
import { LoginButton } from "../widgets/login-button";
import { BetaBtn } from "../widgets/beta-btn";

interface Props {
  className?: string;
}

export const Today: FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Container className="flex flex-col items-center justify-between gap-5">
        <Card className="w-full p-2 pb-4 ">
          <div className="flex justify-between mb-4">
            <BetaBtn />
            <LoginButton />
          </div>
          <ClockWidget />
        </Card>
        <TodoList />
      </Container>
    </div>
  );
};
