'use client';

import { Container } from '../../container';
import { Header } from '../../widgets/header';
import { FC, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Achievement {
  key: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface AchievementsResponse {
  level: number;
  xp: number;
  xpToNextLevel: number;
  achievements: Achievement[];
  newlyUnlocked: { key: string; title: string; description: string }[];
}

interface Props {
  className?: string;
}

export const Achievements: FC<Props> = ({ className }) => {
  const { execute, data } = useFetch<AchievementsResponse>('/achievements', {
    method: 'GET',
    auth: true,
    skip: true,
  });

  useEffect(() => {
    execute();
  }, []);

  return (
    <Container className={`flex flex-col justify-between gap-5 pt-10 ${className ?? ''}`}>
      <Header headerTitle="Достижения" />

      {!data ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[110px] w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[110px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Card className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Trophy className="w-4 h-4" />
                <span>Уровень</span>
              </div>
              <span className="text-2xl font-bold">{data.level}</span>
            </div>
            <Progress value={(data.xp / data.xpToNextLevel) * 100} className="h-2" />
            <span className="text-sm text-muted-foreground">
              {data.xp} из {data.xpToNextLevel} до следующего уровня
            </span>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {data.achievements.map((a) => (
              <Card
                key={a.key}
                className={`p-4 flex flex-col gap-2 ${a.unlocked ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center justify-between">
                  <Trophy className={a.unlocked ? 'w-5 h-5 text-primary' : 'w-5 h-5 text-muted-foreground'} />
                  {!a.unlocked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <p className="font-medium leading-tight">{a.title}</p>
                <p className="text-xs text-muted-foreground leading-tight">{a.description}</p>
                {a.unlocked && a.unlockedAt && (
                  <p className="text-xs text-primary mt-auto">
                    {format(new Date(a.unlockedAt), 'd MMMM yyyy', { locale: ru })}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};
