'use client';

import { Container } from '../../container';
import { Header } from '../../widgets/header';
import { FC, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { StatsChart } from './stats-chart';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  className?: string;
}

export const Stats: FC<Props> = ({ className }) => {
  const { execute, data } = useFetch('/task/stats', {
    method: 'GET',
    auth: true,
    skip: true,
  });

  console.log('data', data);

  useEffect(() => {
    const getMissedDays = async () => {
      const res = await execute();
      console.log('res', res);
    };

    getMissedDays();
  }, []);

  return (
    <Container className="flex flex-col justify-between gap-5">
      <Header headerTitle="Статистика" />
      {data ? (
        <StatsChart data={data} />
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[375px] w-full rounded-xl" />
          <Skeleton className="h-[90px] w-full rounded-xl" />
        </div>
      )}
    </Container>
  );
};
