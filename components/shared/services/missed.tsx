"use client";
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "../container";
import { Header } from "../widgets/header";
import "react-calendar-heatmap/dist/styles.css";
import styles from "./missed.module.css";
import { Card } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { Tasks } from "../widgets/tasks";
import { useFetch } from "@/hooks/useFetch";
import { defaultTasks, ITasks } from "../widgets/todo-list";

export default function Missed() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [missedDays, setMissedDays] = useState();
  const [taskData, setTaskData] = useState<ITasks[]>(defaultTasks);
  const { execute } = useFetch("/missed/dates", {
    method: "GET",
    auth: true,
    skip: true,
  });

  const { execute: getSelectedDay } = useFetch("", {
    method: "GET",
    auth: true,
    skip: true,
  });

  useEffect(() => {
    const getMissedDays = async () => {
      const res = await execute();
      const missedDays = res.map((date: Date) => new Date(date));
      setMissedDays(missedDays);
    };

    getMissedDays();
  }, []);

  const handleDayClick = async (day: Date) => {
    if (!day) {
      return null;
    }

    const formattedDate = format(day, "yyyy-MM-dd");
    const res = await getSelectedDay(undefined, `/task/date/${formattedDate}`);
    setTaskData(res);
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
          taskData={taskData}
          title={format(selectedDay, "d MMMM yyyy", { locale: ru })}
          onClose={() => setSelectedDay(undefined)}
        />
      )}
    </Container>
  );
}
