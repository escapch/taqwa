'use client';

import { useTheme } from 'next-themes';
import { ChevronRight, Moon, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Card
      className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-all duration-100 mt-8 rounded-full"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <div className="flex items-center gap-3">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <p>Сменить тему</p>
      </div>
      <ChevronRight className="text-primary cursor-pointer" />
    </Card>
  );
}
