'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '../../widgets/header';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { PrayerTimesWidget } from '../../widgets/prayer-times-widget';

interface Props {
    className?: string;
}

export const PrayerTimesDisplay: React.FC<Props> = ({ className }) => {
    const { 
        prayerTimes, 
        isLoading, 
        isInitialized,
        user, 
        browserLocation, 
        currentCity, 
        activeTimezone, 
        requestGeolocation 
    } = usePrayerTimes();

    if (isInitialized && !user?.location && !browserLocation && !isLoading) {
        return (
            <div className="flex items-center justify-center p-4 min-h-[400px]">
                <Card className="p-8 text-center bg-zinc-900 border-zinc-800 rounded-3xl max-w-sm w-full">
                    <Navigation className="h-12 w-12 text-primary mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Настройте местоположение</h3>
                    <p className="text-zinc-500 text-sm mb-8">Для точного расчета времени намаза разрешите доступ к геопозиции.</p>
                    <Button onClick={requestGeolocation} className="w-full h-12 rounded-2xl font-bold text-base">Определить город</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("max-w-md mx-auto space-y-6 pt-8 px-4", className)}>
            <Header headerTitle="Время намаза" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Сегодня</h1>
                <div className="flex items-center gap-1 text-zinc-500 font-medium">
                    <span>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-zinc-500 text-sm font-medium">Загружаем расписание...</p>
                </div>
            ) : prayerTimes ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <PrayerTimesWidget
                        prayerTimes={prayerTimes}
                        activeTimezone={activeTimezone}
                        currentCity={currentCity}
                        requestGeolocation={requestGeolocation}
                    />
                </motion.div>
            ) : (
                <div className="flex justify-center items-center py-20 text-zinc-500">Нет данных</div>
            )}
        </div>
    );
};

