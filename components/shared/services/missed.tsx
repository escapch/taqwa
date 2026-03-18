"use client";
import { FC, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface IUserExtended {
  id: string;
  name: string;
  email: string;
  registeredAt?: string;
  avatar?: string;
}

export const Missed: FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [missedDays, setMissedDays] = useState<Date[]>([]);
  const [completedDays, setCompletedDays] = useState<Date[]>([]);
  const [partialDays, setPartialDays] = useState<Date[]>([]);
  const [taskData, setTaskData] = useState<ITasks[]>(defaultTasks);

  const { execute: fetchOverview, loading } = useFetch("/missed/overview", {
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
    const fetchData = async () => {
      const res = await fetchOverview();

      if (res && Array.isArray(res)) {
        const missed: Date[] = [];
        const completed: Date[] = [];
        const partial: Date[] = [];

        res.forEach((item: { date: string; status: string }) => {
          const date = new Date(item.date);
          if (item.status === "missed") missed.push(date);
          else if (item.status === "completed") completed.push(date);
          else if (item.status === "partial") partial.push(date);
        });

        setMissedDays(missed);
        setCompletedDays(completed);
        setPartialDays(partial);
      }
    };

    fetchData();
  }, []);

  const registeredDate = (user as unknown as IUserExtended)?.registeredAt
    ? new Date((user as unknown as IUserExtended).registeredAt!)
    : undefined;

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
    <Container className="flex flex-col  justify-between gap-5 pt-10">
      <Header headerTitle="Пропущенные намазы" />
      <Card className="p-6 flex flex-col items-center">
        {!loading ? (
          <>
            <DayPicker
              animate
              mode="single"
              locale={ru}
              timeZone="Asia/Bishkek"
              onDayClick={handleDayClick}
              weekStartsOn={1}
              modifiers={{
                missed: missedDays,
                completed: completedDays,
                partial: partialDays,
                registered: registeredDate ? [registeredDate] : [],
              }}
              className={styles.dayPicker}
              modifiersClassNames={{
                missed: "missed-day",
                completed: "completed-day",
                partial: "partial-day",
                registered: "registered-day",
              }}
            />
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 pt-6 border-t text-sm font-medium text-muted-foreground w-full">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142,76%,36%)]" />
                <span>Все прочитано</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(48,96%,53%)]" />
                <span>Частично</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,84%,60%)]" />
                <span>Есть пропуски</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center border border-dashed border-primary rounded-md" />
                <span>День регистрации</span>
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        )}
      </Card>

      <Dialog
        open={!!selectedDay}
        onOpenChange={() => setSelectedDay(undefined)}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
          {selectedDay && (
            <Tasks
              taskData={taskData}
              title={format(selectedDay, "d MMMM yyyy", { locale: ru })}
              onClose={() => setSelectedDay(undefined)}
              onUpdate={fetchOverview}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};
