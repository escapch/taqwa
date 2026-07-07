'use client';

import { FC } from 'react';
import { StatsDaily, StatsPeriod } from './types';
import { StatsDailyBarChart } from './stats-daily-bar-chart';
import { StatsHeatmap } from './stats-heatmap';

interface Props {
  period: StatsPeriod;
  daily: StatsDaily[];
}

export const StatsTrend: FC<Props> = ({ period, daily }) => {
  if (period === 'week' || period === 'month') {
    return <StatsDailyBarChart period={period} daily={daily} />;
  }
  return <StatsHeatmap daily={daily} />;
};
