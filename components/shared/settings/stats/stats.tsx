'use client';

import { Container } from '../../container';
import { Header } from '../../widgets/header';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsSummaryCards } from './stats-summary-cards';
import { StatsTrend } from './stats-trend';
import { StatsPrayerBreakdown } from './stats-prayer-breakdown';
import { StatsPeriod, StatsResponse } from './types';

interface Props {
  className?: string;
}

const PERIOD_LABELS: { value: StatsPeriod; label: string }[] = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' },
  { value: 'all', label: 'Всё время' },
];

export const Stats: FC<Props> = ({ className }) => {
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { execute, data, loading } = useFetch<StatsResponse>('/task/stats', {
    method: 'GET',
    auth: true,
    skip: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?next=%2Fsettings%2Fstats');
      return;
    }
    execute(undefined, `/task/stats?period=${period}`);
  }, [period, isAuthenticated, router]);

  const isInitialLoading = loading && !data;

  return (
    <Container className={`flex flex-col justify-between gap-5 pt-10 ${className ?? ''}`}>
      <Header headerTitle="Статистика" />

      <Tabs value={period} onValueChange={(value) => setPeriod(value as StatsPeriod)}>
        <TabsList className="w-full grid grid-cols-4">
          {PERIOD_LABELS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isInitialLoading || !data ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[110px] w-full rounded-2xl" />
            <Skeleton className="h-[110px] w-full rounded-2xl" />
            <Skeleton className="h-[110px] w-full rounded-2xl" />
            <Skeleton className="h-[110px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <Skeleton className="h-[260px] w-full rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <StatsSummaryCards summary={data.summary} />
          <StatsTrend period={data.period} daily={data.daily} />
          <StatsPrayerBreakdown byPrayer={data.byPrayer} />
        </div>
      )}
    </Container>
  );
};
