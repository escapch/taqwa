'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatsPrayer } from './types';

interface Props {
  byPrayer: StatsPrayer[];
}

export const StatsPrayerBreakdown: FC<Props> = ({ byPrayer }) => {
  const sorted = [...byPrayer].sort((a, b) => a.percent - b.percent);
  const weakest = sorted[0];

  return (
    <Card className="p-4 flex flex-col gap-4">
      <span className="text-sm font-medium text-muted-foreground">По намазам</span>

      <div className="flex flex-col gap-4">
        {sorted.map((prayer) => (
          <div key={prayer.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{prayer.name}</span>
                {weakest && prayer.name === weakest.name && weakest.total > 0 && weakest.percent < 100 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    Чаще всего пропускается
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground">
                {prayer.completed}/{prayer.total} · {prayer.percent}%
              </span>
            </div>
            <Progress value={prayer.percent} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
