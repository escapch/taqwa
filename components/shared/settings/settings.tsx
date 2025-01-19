"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Container } from "../container";
import { ChartArea, ChevronRight, CircleUser, HelpCircle } from "lucide-react";

interface Props {
  className?: string;
}
const settings = [
  {
    id: 1,
    name: "Статистика",
    icon: <ChartArea />,
  },
  {
    id: 6,
    name: "Help",
    icon: <HelpCircle />,
  },
  {
    id: 7,
    name: "Профиль",
    icon: <CircleUser />,
  },
];
export const Settings: React.FC<Props> = ({ className }) => {
  return (
    <Container className="flex flex-col  justify-between gap-5">
      <div className="flex items-center gap-3">
        <p className="text-3xl font-medium">Настройки</p>
      </div>
      <div className="flex flex-col gap-2">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-all duration-100"
          >
            <div className="flex items-center gap-3">
              {setting.icon}
              <p>{setting.name}</p>
            </div>
            <ChevronRight className="text-primary cursor-pointer" />
          </Card>
        ))}
      </div>
    </Container>
  );
};
