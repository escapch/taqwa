"use client";
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "../container";
import { Header } from "../widgets/header";
import "react-calendar-heatmap/dist/styles.css";
import styles from "./missed.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import useAuthStore from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tasks } from "../widgets/tasks";

interface Prayer {
  id: number;
  title: string;
  completed: boolean;
  must: boolean;
}

interface PrayersData {
  [key: string]: Prayer[];
}

const prayersData: PrayersData = {
  "2025-04-12": [
    { id: 1, title: "Фаджр", completed: true, must: true },
    { id: 2, title: "Зухр", completed: true, must: true },
    { id: 3, title: "Аср", completed: true, must: true },
    { id: 4, title: "Магриб", completed: true, must: true },
    { id: 5, title: "Иша", completed: true, must: true },
  ],
  "2025-04-10": [
    { id: 1, title: "Фаджр", completed: false, must: true },
    { id: 2, title: "Зухр", completed: true, must: true },
    { id: 3, title: "Аср", completed: true, must: true },
    { id: 4, title: "Магриб", completed: true, must: true },
    { id: 5, title: "Иша", completed: false, must: true },
  ],
};

export default function Missed() {
  const { user } = useAuthStore();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [tasks, setTasks] = useState<PrayersData>(prayersData);

  const handleToggleTask = (date: string, taskId: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const dayTasks = [...(updatedTasks[date] || [])];
      const taskIndex = dayTasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        dayTasks[taskIndex] = {
          ...dayTasks[taskIndex],
          completed: !dayTasks[taskIndex].completed,
        };
        updatedTasks[date] = dayTasks;
      }

      return updatedTasks;
    });
  };

  // Определяем дни с пропущенными намазами
  const missedDays = Object.entries(tasks)
    .filter(([_, prayers]) =>
      prayers.some((prayer) => !prayer.completed && prayer.must)
    )
    .map(([date]) => new Date(date));

  // Пример данных
  const missedPrayers = [new Date(2025, 4, 15), new Date(2025, 4, 20)]; // Красные точки
  const madeUpPrayers = [new Date(2025, 4, 10), new Date(2025, 4, 25)]; // Зелёные точки

  // Обработчик клика по дню
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  return (
    <Container className="flex flex-col  justify-between gap-5">
      <Header headerTitle="Пропущенные намазы" />
      <Card className="p-6 flex justify-center">
        <DayPicker
          animate
          mode="single"
          locale={ru}
          timeZone="Asia/Bishkek"
          onDayClick={handleDayClick}
          weekStartsOn={1}
          modifiers={{
            missed: missedDays,
          }}
          className={styles.dayPicker}
          modifiersClassNames={{
            missed: "missed-day",
          }}
        />
      </Card>

      {selectedDay && (
        <Tasks
          taskData={tasks[format(selectedDay, "yyyy-MM-dd")]}
          title={format(selectedDay, "d MMMM yyyy", { locale: ru })}
          progress={40}
          onClose={() => setSelectedDay(undefined)}
          onToggleTask={(taskId) =>
            handleToggleTask(format(selectedDay, "yyyy-MM-dd"), taskId)
          }
        />
      )}
    </Container>
  );
}
