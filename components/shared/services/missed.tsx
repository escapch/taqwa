'use client';
import { use, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../container';
import { Header } from '../widgets/header';
import 'react-calendar-heatmap/dist/styles.css';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import useAuthStore from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const prayersData = {
  '2025-01-20': [
    { id: 1, title: 'Фаджр', completed: true, must: true },
    { id: 2, title: 'Зухр', completed: true, must: true },
    { id: 3, title: 'Аср', completed: true, must: true },
    { id: 4, title: 'Магриб', completed: true, must: true },
    { id: 5, title: 'Иша', completed: true, must: true },
  ],
  '2025-01-21': [
    { id: 1, title: 'Фаджр', completed: false, must: true },
    { id: 2, title: 'Зухр', completed: true, must: true },
    { id: 3, title: 'Аср', completed: true, must: true },
    { id: 4, title: 'Магриб', completed: true, must: true },
    { id: 5, title: 'Иша', completed: false, must: true },
  ],
};

export default function Missed() {
  const { user } = useAuthStore();

  const [tasks, setTasks] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Пример данных
  const missedPrayers = [new Date(2025, 4, 15), new Date(2025, 4, 20)]; // Красные точки
  const madeUpPrayers = [new Date(2025, 4, 10), new Date(2025, 4, 25)]; // Зелёные точки

  // Обработчик клика по дню
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
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
        />
      </Card>
      <Card className="p-6 flex justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">Инфо</p>
          <div className="flex gap-2"></div>
        </div>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? format(selectedDay, 'd MMMM yyyy', { locale: ru }) : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDay && (
              <p>
                {missedPrayers.some((d) => d.getTime() === selectedDay.getTime())
                  ? '❗ Пропущенные намазы: 2'
                  : madeUpPrayers.some((d) => d.getTime() === selectedDay.getTime())
                  ? '✅ Восполненные намазы: 2'
                  : 'Нет данных о намазах'}
              </p>
            )}
          </div>
          <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
