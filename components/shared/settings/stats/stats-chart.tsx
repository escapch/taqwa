'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { FC } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, LabelList } from 'recharts';

interface StatsData {
  bestStreak: number;
  completedFards: number;
  currentStreak: number;
  percentCompleted: number;
  totalFards: number;
}

interface StatsProps {
  data: StatsData;
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#00c963',
  },
} satisfies ChartConfig;

export const StatsChart: FC<StatsProps> = ({ data }) => {
  const chartData = [
    { name: 'Выполнено', value: data.completedFards },
    { name: 'Всего', value: data.totalFards },
    { name: 'Тек. серия', value: data.currentStreak },
    { name: 'Лучшая серия', value: data.bestStreak },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Card className="pt-4">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" fill="var(--color-desktop)" radius={8}>
                <LabelList dataKey="value" position="top" fontSize={14} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="p-4 flex flex-col gap-2">
        <div className="flex gap-2 items-center leading-none font-medium">
          <p className="text-2xl font-bold">{data.percentCompleted}% выполнено</p>
          <TrendingUp />
        </div>
        <div className="text-muted-foreground leading-none">
          {data.completedFards} из {data.totalFards}
        </div>
      </Card>
    </div>
  );
};
