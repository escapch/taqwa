'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../container';
import { ClockWidget } from '../widgets/clock';
import { TodoList } from '../widgets/todo-list';
import { Card } from '@/components/ui/card';
import { Veсize } from '../widgets/veсize';
import { ThemeToggle } from '../widgets/theme-toggle';
import { LoginButton } from '../widgets/login-button';
import { BetaBtn } from '../widgets/beta-btn';
import { useProfileStore } from '@/store/profile';

interface Props {
  className?: string;
}

export const Today: React.FC<Props> = ({ className }) => {
  const { user, token, updateLocation } = useProfileStore();

  // Auto-update geolocation on every visit
  useEffect(() => {
    if (!token || !user) return;
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(latitude, longitude);
      },
      (error) => {
        console.debug('Auto-geolocation skipped:', error.message);
      },
      { timeout: 10000 }
    );
  }, [token, user]);

  return (
    <div className={cn(className)}>
      <Container className="flex flex-col items-center justify-between gap-5">
        <Card className="w-full p-2 pb-4 ">
          <div className="flex justify-between mb-4">
            <BetaBtn />
            <LoginButton />
          </div>
          <ClockWidget />
        </Card>
        <TodoList />
        <Veсize />
      </Container>
    </div>
  );
};

