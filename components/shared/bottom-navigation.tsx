'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { Container } from './container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Clock7, LayoutGrid, Cog } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
interface Props {
  className?: string;
}

const navItems = [
  { path: '/', label: 'Сегодня', icon: Clock7 },
  { path: '/services', label: 'Сервисы', icon: LayoutGrid },
  { path: '/settings', label: 'Настройки', icon: Cog },
];

export const BottomNavigation: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className={cn('fixed bottom-0 left-0 w-full dark:bg-[#09090b] bg-white', className)}>
      <Container className="flex items-center justify-between my-0">
        <div className="flex justify-around py-2 px-5 w-full">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className="flex flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all duration-100"
              >
                <Icon
                  className={`text-lg ${
                    isActive ? 'text-primary' : 'text-secondary-foreground'
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-secondary-foreground'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </nav>
  );
};
