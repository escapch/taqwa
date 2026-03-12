'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFetch } from '@/hooks/useFetch';
import { useProfileStore } from '@/store/profile';
import { NextPrayerTimer } from './next-prayer-timer';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    className?: string;
}

interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    date: string;
}

const prayerNames = [
    { key: 'Fajr', label: 'Фаджр' },
    { key: 'Dhuhr', label: 'Зухр' },
    { key: 'Asr', label: 'Аср' },
    { key: 'Maghrib', label: 'Магриб' },
    { key: 'Isha', label: 'Иша' },
];

export const PrayerTimesDisplay: React.FC<Props> = ({ className }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [browserLocation, setBrowserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [browserTimezone, setBrowserTimezone] = useState<string>('');
    const [isRequestingGeo, setIsRequestingGeo] = useState(false);

    const user = useProfileStore((state) => state.user);

    // Endpoint для авторизованных пользователей с сохраненной локацией
    const { execute: executeAuthLoader, data: authData, loading: authLoading, error: authError } = useFetch<PrayerTimes>('/prayer-times/today', {
        method: 'GET',
        auth: true,
        skip: true,
    });

    // Публичный Endpoint для гостей
    // Подставляем параметры если гео получено из браузера
    const todayDate = new Date().toISOString().split('T')[0];
    const publicUrl = browserLocation
        ? `/prayer-times?lat=${browserLocation.lat}&lng=${browserLocation.lng}&date=${todayDate}&timezone=${browserTimezone}`
        : '';

    const { execute: executePublicLoader, data: publicData, loading: publicLoading, error: publicError } = useFetch<PrayerTimes>(publicUrl, {
        method: 'GET',
        auth: false,
        skip: true,
    });

    useEffect(() => {
        // Detect timezone upfront
        setBrowserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // Если юзер авторизован и у него есть локация - грузим с бека
    useEffect(() => {
        if (user?.location) {
            executeAuthLoader();
        }
    }, [user, executeAuthLoader]);

    // Если юзер нажал "Поделиться геолокацией" и мы получили координаты - грузим публичный апи
    useEffect(() => {
        if (!user?.location && browserLocation && publicUrl) {
            executePublicLoader(undefined, publicUrl);
        }
    }, [user, browserLocation, publicUrl, executePublicLoader]);

    // Синхронизируем полученные данные со стейтом UI
    useEffect(() => {
        if (authData) setPrayerTimes(authData);
        else if (publicData) setPrayerTimes(publicData);
    }, [authData, publicData]);

    useEffect(() => {
        if (authError || publicError) {
            toast.error('Не удалось загрузить время намазов. Проверьте подключение к интернету.');
        }
    }, [authError, publicError]);

    const requestGeolocation = () => {
        if (!navigator.geolocation) {
            toast.error('Ваш браузер не поддерживает определение геолокации.');
            return;
        }

        setIsRequestingGeo(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setBrowserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setIsRequestingGeo(false);
            },
            (error) => {
                setIsRequestingGeo(false);
                if (error.code === error.PERMISSION_DENIED) {
                    toast.error('Вы запретили доступ к геолокации. Разрешите доступ в настройках браузера.');
                } else {
                    toast.error('Не удалось определить местоположение.');
                }
            }
        );
    };

    const currentLoading = authLoading || publicLoading || isRequestingGeo;

    // Экран запроса геопозиции для неавторизованных или юзеров без локации
    if (!user?.location && !browserLocation && !currentLoading) {
        return (
            <Card className={cn("flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto bg-card border-none shadow-sm", className)}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Узнайте время намаза</h3>
                <p className="text-muted-foreground mb-8">
                    Разрешите доступ к местоположению, чтобы мы могли точно рассчитать расписание молитв для вашего региона.
                </p>
                <Button onClick={requestGeolocation} size="lg" className="w-full sm:w-auto font-medium">
                    Определить мое местоположение
                </Button>
            </Card>
        );
    }

    return (
        <div className={cn("flex flex-col gap-8", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold tracking-tight">Время намаза на сегодня</h2>
            </div>

            {currentLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : prayerTimes ? (
                <>
                    <NextPrayerTimer
                        prayerTimes={{
                            Fajr: prayerTimes.Fajr,
                            Dhuhr: prayerTimes.Dhuhr,
                            Asr: prayerTimes.Asr,
                            Maghrib: prayerTimes.Maghrib,
                            Isha: prayerTimes.Isha
                        }}
                        userTimezone={user?.timezone || browserTimezone || 'UTC'}
                    />

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 mt-4">
                        {prayerNames.map((prayer) => (
                            <Card key={prayer.key} className="flex flex-col items-center justify-center p-6 bg-card hover:bg-accent/50 transition-colors border-none shadow-sm shadow-primary/5">
                                <span className="text-sm font-medium text-muted-foreground mb-1">{prayer.label}</span>
                                <span className="text-2xl font-bold">
                                    {prayerTimes[prayer.key as keyof PrayerTimes]}
                                </span>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center text-sm text-muted-foreground mt-2">
                        Дата: {prayerTimes.date}
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <p className="text-muted-foreground">Нет данных о времени намаза.</p>
                </div>
            )}
        </div>
    );
};
