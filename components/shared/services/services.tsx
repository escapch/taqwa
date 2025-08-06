'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { CalendarX2, Clock8 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  className?: string;
}
const services = [
  {
    title: 'Пропущенные намазы',
    icon: <CalendarX2 className="text-red-400" />,
    url: '/services/missed',
  },
  {
    title: 'Время намаза',
    icon: <Clock8 className="text-primary" />,
    url: '/services/prayer-time',
  },
];
export const Services: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <p className="text-3xl font-medium">Сервисы</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
        {services.map((service, index) => (
          <Card
            key={index}
            className={cn(
              'flex flex-col items-start justify-between gap-7 p-3 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-all duration-100',
              className,
            )}
            onClick={() => {
              router.push(service.url);
            }}
          >
            {service.icon}
            <p className="text-lg font-medium">{service.title}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
