import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../container';
import { ClockWidget } from '../widgets/clock';
import { TodoList } from '../widgets/todo-list';
import { Card } from '@/components/ui/card';
import { Veсize } from '../widgets/veсize';
import { ThemeToggle } from '../widgets/theme-toggle';

interface Props {
  className?: string;
}

export const Today: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Container className="flex flex-col items-center justify-between gap-5">
        <Card className="w-full p-2">
          <ClockWidget />
          <ThemeToggle />
        </Card>
        <TodoList />
        <Veсize />
      </Container>
    </div>
  );
};
