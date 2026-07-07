'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy, CheckCircle2, Percent } from 'lucide-react';
import { StatsSummary } from './types';

interface Props {
  summary: StatsSummary;
}

export const StatsSummaryCards: FC<Props> = ({ summary }) => {
  const { percentCompleted, completedFards, totalFards, currentStreak, bestStreak } = summary;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4 flex flex-col gap-2 col-span-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Percent className="w-4 h-4" />
            <span>Выполнено за период</span>
          </div>
          <span className="text-2xl font-bold">{percentCompleted}%</span>
        </div>
        <Progress value={percentCompleted} className="h-2" />
        <span className="text-sm text-muted-foreground">
          {completedFards} из {totalFards} намазов
        </span>
      </Card>

      <Card className="p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Серия</span>
        </div>
        <span className="text-2xl font-bold">{currentStreak}</span>
        <span className="text-xs text-muted-foreground">дней подряд · за всё время</span>
      </Card>

      <Card className="p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Рекорд</span>
        </div>
        <span className="text-2xl font-bold">{bestStreak}</span>
        <span className="text-xs text-muted-foreground">лучшая серия · за всё время</span>
      </Card>

      <Card className="p-4 flex flex-col gap-1 col-span-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Выполнено намазов</span>
        </div>
        <span className="text-2xl font-bold">
          {completedFards} <span className="text-base font-normal text-muted-foreground">из {totalFards}</span>
        </span>
      </Card>
    </div>
  );
};
