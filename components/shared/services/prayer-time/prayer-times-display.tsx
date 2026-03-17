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
                <Card className="p-8 text-center bg-card border-border rounded-3xl max-w-md w-full shadow-lg">
                    <Navigation className="h-12 w-12 text-primary mx-auto mb-6 opacity-30" />
                    <h3 className="text-xl font-bold mb-2">Настройте местоположение</h3>
                    <p className="text-muted-foreground text-sm mb-8">Для точного расчета времени намаза разрешите доступ к геопозиции.</p>
                    <Button onClick={requestGeolocation} className="w-full h-12 rounded-2xl font-bold text-base">Определить город</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("mx-auto space-y-6 pt-8 px-4 w-full", className)}>
            <Header headerTitle="Время намаза" />

            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">Сегодня</h1>
                <p className="text-muted-foreground font-medium">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm font-medium">Загружаем расписание...</p>
                </div>
            ) : prayerTimes ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <Card className="p-6 bg-card sm:p-8 rounded-[2rem] border-none shadow-xl shadow-primary/5 max-w-2xl w-full mx-auto overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                         <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-3xl" />
                         
                         <div className="relative z-10">
                            <PrayerTimesWidget
                                prayerTimes={prayerTimes}
                                activeTimezone={activeTimezone}
                                currentCity={currentCity}
                                requestGeolocation={requestGeolocation}
                            />
                        </div>
                    </Card>
                </motion.div>
            ) : (
                <div className="flex justify-center items-center py-20 text-muted-foreground">Нет данных</div>
            )}
        </div>
    );
};

