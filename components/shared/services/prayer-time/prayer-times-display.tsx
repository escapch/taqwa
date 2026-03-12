'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFetch } from '@/hooks/useFetch';
import { useProfileStore } from '@/store/profile';
import { Loader2, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { NextPrayerTimer } from './next-prayer-timer';
import { Header } from '../../widgets/header';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
    className?: string;
}

interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    date: string;
}

const STORAGE_KEY = 'taqwa_guest_location';

const ensure24hFormat = (time: string) => {
    if (!time) return '';
    return time.replace(/\s*(AM|PM|\(AM\)|\(PM\))\s*/gi, '').trim();
};

const getCurrentPrayerKey = (times: PrayerTimes, tz: string): string => {
    const ordered: [string, string][] = [
        ['Fajr', times.Fajr],
        ['Dhuhr', times.Dhuhr],
        ['Asr', times.Asr],
        ['Maghrib', times.Maghrib],
        ['Isha', times.Isha],
    ];
    const now = dayjs().tz(tz);
    const todayStr = now.format('YYYY-MM-DD');
    let current = 'Isha';
    for (const [key, timeStr] of ordered) {
        if (!timeStr) continue;
        const prayerTime = dayjs.tz(`${todayStr} ${ensure24hFormat(timeStr)}`, 'YYYY-MM-DD HH:mm', tz);
        if (now.isAfter(prayerTime) || now.isSame(prayerTime)) {
            current = key;
        }
    }
    return current;
};

export const PrayerTimesDisplay: React.FC<Props> = ({ className }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [browserLocation, setBrowserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [browserTimezone, setBrowserTimezone] = useState<string>('');
    const [isRequestingGeo, setIsRequestingGeo] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentCity, setCurrentCity] = useState<string>('');

    const user = useProfileStore((state) => state.user);

    useEffect(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setBrowserTimezone(tz);
        if (tz.includes('/')) {
            setCurrentCity(tz.split('/')[1].replace('_', ' '));
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { setBrowserLocation(JSON.parse(saved)); }
            catch (e) { console.error('Failed to parse saved location'); }
        }
        setIsInitialized(true);
    }, []);

    const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    const publicUrl = useMemo(() => {
        if (!browserLocation) return '';
        return `/prayer-times?lat=${browserLocation.lat}&lng=${browserLocation.lng}&date=${todayDate}&timezone=${browserTimezone}`;
    }, [browserLocation, todayDate, browserTimezone]);

    const { execute: executeAuthLoader, data: authData, loading: authLoading, error: authError } = useFetch<PrayerTimes>('/prayer-times/today', { method: 'GET', auth: true, skip: true });
    const { execute: executePublicLoader, data: publicData, loading: publicLoading, error: publicError } = useFetch<PrayerTimes>(publicUrl, { method: 'GET', auth: false, skip: true });

    useEffect(() => {
        if (user?.location && !authData && !authLoading) executeAuthLoader();
    }, [user?.location, authData, authLoading, executeAuthLoader]);

    useEffect(() => {
        if (!user?.location && browserLocation && publicUrl && !publicData && !publicLoading) {
            executePublicLoader(undefined, publicUrl);
        }
    }, [user?.location, browserLocation, publicUrl, publicData, publicLoading, executePublicLoader]);

    useEffect(() => {
        if (authData) setPrayerTimes(authData);
        else if (publicData) setPrayerTimes(publicData);
    }, [authData, publicData]);

    useEffect(() => {
        if (authError || publicError) toast.error('Ошибка загрузки времени намазов');
    }, [authError, publicError]);

    const requestGeolocation = () => {
        if (!navigator.geolocation) { toast.error('Геолокация не поддерживается'); return; }
        setIsRequestingGeo(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setBrowserLocation(coords);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
                setIsRequestingGeo(false);
            },
            () => { setIsRequestingGeo(false); toast.error('Не удалось получить местоположение'); }
        );
    };

    const currentLoading = (isInitialized && !user && !browserLocation && isRequestingGeo) || authLoading || publicLoading;
    const activeTimezone = user?.timezone || browserTimezone || 'UTC';
    const activePrayerKey = prayerTimes ? getCurrentPrayerKey(prayerTimes, activeTimezone) : '';

    if (isInitialized && !user?.location && !browserLocation && !currentLoading) {
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

    const prayers = [
        { name: 'Фаджр', key: 'Fajr', time: ensure24hFormat(prayerTimes?.Fajr || '') },
        { name: 'Восход', key: 'Sunrise', time: ensure24hFormat(prayerTimes?.Sunrise || '') },
        { name: 'Зухр', key: 'Dhuhr', time: ensure24hFormat(prayerTimes?.Dhuhr || '') },
        { name: 'Аср', key: 'Asr', time: ensure24hFormat(prayerTimes?.Asr || '') },
        { name: 'Магриб', key: 'Maghrib', time: ensure24hFormat(prayerTimes?.Maghrib || '') },
        { name: 'Иша', key: 'Isha', time: ensure24hFormat(prayerTimes?.Isha || '') },
    ];

    return (
        <div className={cn("max-w-md mx-auto space-y-6 pt-8 px-4", className)}>
            <Header headerTitle="Время намаза" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Сегодня</h1>
                <div className="flex items-center gap-1 text-zinc-500 font-medium">
                    <span>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {currentLoading ? (
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
                    <Card className="bg-zinc-900/90 border-zinc-800 rounded-[2.5rem] overflow-hidden p-8 shadow-2xl">
                        {/* Timer + City */}
                        <div className="flex justify-between items-start mb-2">
                            <NextPrayerTimer
                                prayerTimes={{
                                    Fajr: prayerTimes.Fajr,
                                    Dhuhr: prayerTimes.Dhuhr,
                                    Asr: prayerTimes.Asr,
                                    Maghrib: prayerTimes.Maghrib,
                                    Isha: prayerTimes.Isha
                                }}
                                userTimezone={activeTimezone}
                                render={(next, h, m, s) => (
                                    <div className="space-y-0.5">
                                        <span className="text-zinc-400 font-semibold text-sm tracking-wide">{next} через</span>
                                        <div className="text-[2.6rem] font-black tracking-tight leading-none tabular-nums">
                                            {h !== '00' ? `${parseInt(h)}:` : ''}{m}:{s}
                                        </div>
                                    </div>
                                )}
                            />

                            <button
                                onClick={requestGeolocation}
                                className="flex items-center gap-1.5 text-zinc-500 hover:text-primary transition-colors font-bold text-sm pt-1"
                                title="Обновить город"
                            >
                                {currentCity || 'Бишкек'}
                                <Navigation className="h-3.5 w-3.5 fill-current" />
                            </button>
                        </div>

                        {/* Prayer list with separators and active highlighting */}
                        <div className="mt-8 flex flex-col">
                            {prayers.map((prayer, idx) => {
                                const isActive = prayer.key === activePrayerKey;
                                const hasTime = !!prayer.time;
                                return (
                                    <div key={prayer.key}>
                                        <div className={cn(
                                            "flex justify-between items-center py-3 rounded-xl px-3 -mx-3 transition-colors",
                                            isActive && "bg-white/5"
                                        )}>
                                            <span className={cn(
                                                "text-base font-bold transition-colors flex items-center gap-2",
                                                isActive ? "text-primary" : "text-zinc-300"
                                            )}>
                                                {prayer.name}
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                )}
                                            </span>
                                            <span className={cn(
                                                "text-base font-bold tabular-nums transition-colors",
                                                isActive ? "text-primary" : hasTime ? "text-zinc-300" : "text-zinc-600"
                                            )}>
                                                {hasTime ? prayer.time : '—'}
                                            </span>
                                        </div>
                                        {idx < prayers.length - 1 && (
                                            <div className="h-px bg-zinc-800/60 mx-1" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>
            ) : (
                <div className="flex justify-center items-center py-20 text-zinc-500">Нет данных</div>
            )}
        </div>
    );
};
