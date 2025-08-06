'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  className?: string;
}

export const ClockWidget: React.FC<Props> = ({ className }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      setDate(now.toLocaleDateString('ru-RU', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ">
      {date && time ? (
        <>
          <div className="text-md opacity-70">{date}</div>
          <div className="text-6xl font-bold">{time}</div>
        </>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[100px] w-[250px] rounded-xl" />
        </div>
      )}
    </div>
  );
};
