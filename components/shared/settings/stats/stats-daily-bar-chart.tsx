'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { StatsDaily, StatsPeriod } from './types';

const STATUS_COLOR = {
  completed: 'hsl(142, 76%, 36%)',
  partial: 'hsl(48, 96%, 53%)',
  missed: 'hsl(0, 84%, 60%)',
  empty: 'hsl(var(--muted))',
} as const;

type Status = keyof typeof STATUS_COLOR;

function getStatus(day: StatsDaily, isToday: boolean): Status {
  if (day.total === 0) return isToday ? 'empty' : 'missed';
  if (day.completed === day.total) return 'completed';
  if (day.completed > 0) return 'partial';
  return 'missed';
}

const chartConfig = {
  percent: { label: '% выполнено' },
} satisfies ChartConfig;

interface Props {
  period: Extract<StatsPeriod, 'week' | 'month'>;
  daily: StatsDaily[];
}

export const StatsDailyBarChart: FC<Props> = ({ period, daily }) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const chartData = daily.map((d) => {
    const percent = d.total ? Math.round((d.completed / d.total) * 100) : 0;
    const status = getStatus(d, d.date === todayStr);
    return {
      ...d,
      label: format(new Date(d.date), period === 'week' ? 'EEEEEE' : 'd.MM', { locale: ru }),
      percent,
      // a fully missed day is 0% complete, which is otherwise an invisible
      // 0-height bar and indistinguishable from a day with no data at all
      displayPercent: status === 'missed' && percent === 0 ? 6 : percent,
      status,
    };
  });

  const tickInterval = period === 'week' ? 0 : Math.max(0, Math.floor(chartData.length / 6));

  return (
    <Card className="p-4">
      <ChartContainer key={period} config={chartConfig} className="aspect-auto h-[220px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={tickInterval}
            fontSize={12}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(_value, _name, item) => (
                  <span className="font-medium text-foreground">
                    {item.payload.completed}/{item.payload.total} намазов
                  </span>
                )}
              />
            }
          />
          <Bar dataKey="displayPercent" radius={6}>
            {chartData.map((entry) => (
              <Cell key={entry.date} fill={STATUS_COLOR[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 border-t text-sm font-medium text-muted-foreground">
        <LegendDot color={STATUS_COLOR.completed} label="Все прочитано" />
        <LegendDot color={STATUS_COLOR.partial} label="Частично" />
        <LegendDot color={STATUS_COLOR.missed} label="Есть пропуски" />
      </div>
    </Card>
  );
};

const LegendDot: FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    <span>{label}</span>
  </div>
);
