'use client';

import { Card } from '@/components/ui/card';
import { Container } from '../container';
import {
  ChartArea,
  ChevronRight,
  CircleUser,
  HelpCircle,
  Bell,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../widgets/theme-toggle';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/profile';

interface Props {
  className?: string;
}

export const Settings: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { deleteLocation } = useProfileStore();

  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSupported,
    loading: notifLoading,
  } = usePushNotifications();

  // Patch endpoint for adding location
  const { execute: sendLocation, loading: geoLoading } = useFetch<
    unknown,
    { latitude: number; longitude: number }
  >('/users/location', {
    method: 'PATCH',
    auth: true,
    skip: true,
  });

  const hasLocation = !!user?.location;
  const isGeoLoading = geoLoading; // Can add local state if needed for deletion loading

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const ok = await subscribe();
      if (!ok) {
        toast.error('Не удалось включить уведомления');
      }
    } else {
      const ok = await unsubscribe();
      if (!ok) {
        toast.error('Не удалось отключить уведомления');
      }
    }
  };

  const handleLocationToggle = async (checked: boolean) => {
    if (checked) {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        toast.error('Геолокация недоступна в вашем браузере');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await sendLocation({ latitude, longitude });
          // Fetch the updated user profile from backend to get the precise location data
          // A page reload or fetching 'me' would sync the state, but `sendLocation` does it on next load
          // We can also just update the store manually if needed, but the easiest is reloading data
          // Assuming user data is refetched on focus or manually via store
          await useProfileStore.getState().updateProfile({}); // Dummy call to trigger user sync if needed, or simply reload
          toast.success('Геолокация сохранена');
          window.location.reload(); // Quick sync
        },
        () => {
          toast.error('Вы запретили доступ к геопозиции');
        },
        { timeout: 10000 }
      );
    } else {
      const ok = await deleteLocation();
      if (ok) {
        toast.success('Геолокация удалена');
      } else {
        toast.error('Ошибка при удалении геолокации');
      }
    }
  };


  const settings = [
    {
      id: 1,
      name: 'Статистика',
      icon: <ChartArea />,
      link: '/settings/stats',
      isLink: true,
    },
    {
      id: 6,
      name: 'Помощь (Telegram)',
      icon: <HelpCircle />,
      link: 'https://t.me/your_telegram_username', // Replace with actual username
      isExternal: true,
    },
    {
      id: 7,
      name: 'Профиль',
      icon: <CircleUser />,
      link: '/settings/account',
      isLink: true,
    },
  ];

  return (
    <Container className="flex flex-col justify-between gap-5 pt-10">
      <div className="flex items-center gap-3">
        <p className="text-3xl font-medium">Настройки</p>
      </div>
      <div className="flex flex-col gap-2">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            className="rounded-full p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-all duration-100"
            onClick={() => {
              if (setting.isExternal) {
                window.open(setting.link, '_blank');
              } else if (setting.isLink) {
                router.push(setting.link);
              }
            }}
          >
            <div className="flex items-center gap-3">
              {setting.icon}
              <p>{setting.name}</p>
            </div>
            {setting.isExternal || setting.isLink ? (
              <ChevronRight className="text-primary cursor-pointer" />
            ) : null}
          </Card>
        ))}

        <ThemeToggle />

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-semibold text-muted-foreground ml-2">Системные</p>

          {/* Notifications Toggle */}
          {isSupported && (
            <Card className="rounded-full p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bell className={isSubscribed ? "text-primary" : "text-muted-foreground"} />
                <p>Уведомления</p>
              </div>
              <Switch
                checked={isSubscribed}
                onCheckedChange={handleNotificationToggle}
                disabled={notifLoading}
              />
            </Card>
          )}

          {/* Location Toggle */}
          <Card className="rounded-full p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MapPin className={hasLocation ? "text-primary" : "text-muted-foreground"} />
              <p>Координаты</p>
            </div>
            <Switch
              checked={hasLocation}
              onCheckedChange={handleLocationToggle}
              disabled={isGeoLoading}
            />
          </Card>
        </div>
      </div>
    </Container>
  );
};
