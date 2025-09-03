'use client';

import { Card } from '@/components/ui/card';
import { Container } from '../container';
import { ChartArea, ChevronRight, CircleUser, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../widgets/theme-toggle';

interface Props {
  className?: string;
}
const settings = [
  {
    id: 1,
    name: 'Статистика',
    icon: <ChartArea />,
    link: '/settings/stats',
  },
  {
    id: 6,
    name: 'Help',
    icon: <HelpCircle />,
    link: '/settings/help',
  },

  {
    id: 7,
    name: 'Профиль',
    icon: <CircleUser />,
    link: '/settings/account',
  },
];

export const Settings: React.FC<Props> = ({ className }) => {
  const router = useRouter();

  return (
    <Container className="flex flex-col justify-between gap-5">
      <div className="flex items-center gap-3">
        <p className="text-3xl font-medium">Настройки</p>
      </div>
      <div className="flex flex-col gap-2">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-all duration-100"
            onClick={() => router.push(setting.link)}
          >
            <div className="flex items-center gap-3">
              {setting.icon}
              <p>{setting.name}</p>
            </div>
            <ChevronRight className="text-primary cursor-pointer" />
          </Card>
        ))}
        <ThemeToggle />
      </div>
    </Container>
  );
};
