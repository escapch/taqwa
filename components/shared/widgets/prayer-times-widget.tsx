import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Navigation } from 'lucide-react';
import { NextPrayerTimer } from '../services/prayer-time/next-prayer-timer';
import type { PrayerTimes } from '@/hooks/use-prayer-times';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

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

interface PrayerTimesWidgetProps {
    prayerTimes: PrayerTimes;
    activeTimezone: string;
    currentCity?: string;
    requestGeolocation: () => void;
    className?: string;
    cardClassName?: string;
    compact?: boolean;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
    prayerTimes,
    activeTimezone,
    currentCity,
    requestGeolocation,
    className,
    cardClassName,
    compact = false,
}) => {
    const activePrayerKey = getCurrentPrayerKey(prayerTimes, activeTimezone);

    const prayers = [
        // { name: 'Тахаджуд', key: 'Tahajjud', time: ensure24hFormat(prayerTimes.Tahajjud || '') },
        { name: 'Фаджр', key: 'Fajr', time: ensure24hFormat(prayerTimes.Fajr || '') },
        { name: 'Восход', key: 'Sunrise', time: ensure24hFormat(prayerTimes.Sunrise || '') },
        { name: 'Зухр', key: 'Dhuhr', time: ensure24hFormat(prayerTimes.Dhuhr || '') },
        { name: 'Аср', key: 'Asr', time: ensure24hFormat(prayerTimes.Asr || '') },
        { name: 'Магриб', key: 'Maghrib', time: ensure24hFormat(prayerTimes.Maghrib || '') },
        { name: 'Иша', key: 'Isha', time: ensure24hFormat(prayerTimes.Isha || '') },
    ];

    return (
        <div className={cn(
            "bg-transparent border-0 shadow-none p-0",
            cardClassName,
            className
        )}>
            {/* Timer + City */}
            <div className={cn("flex items-center justify-between mb-2 px-1")}>
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
                            <span className="text-primary font-bold text-[10px] uppercase tracking-widest opacity-70">{next} через</span>
                            <div className="text-2xl font-black tracking-tight leading-none tabular-nums text-foreground">
                                {h !== '00' ? `${parseInt(h)}:` : ''}{m}:{s}
                            </div>
                        </div>
                    )}
                />

                <button
                    onClick={requestGeolocation}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold text-xs"
                    title="Обновить город"
                >
                    {currentCity || 'Бишкек'}
                    <Navigation className="h-2.5 w-2.5 fill-current" />
                </button>
            </div>

            {/* Prayer list with separators and active highlighting */}
            <div className={cn("flex flex-col", compact ? "mt-2" : "mt-8")}>
                {prayers.map((prayer, idx) => {
                    const isActive = prayer.key === activePrayerKey;
                    const hasTime = !!prayer.time;
                    return (
                        <div key={prayer.key}>
                            <div className={cn(
                                "flex justify-between items-center rounded-2xl px-4 -mx-2 transition-all duration-500 group",
                                compact ? "py-2" : "py-4",
                                isActive ? "bg-primary/10 shadow-sm" : "hover:bg-accent/50"
                            )}>
                                <span className={cn(
                                    "font-bold transition-colors flex items-center gap-3",
                                    compact ? "text-lg text-muted-foreground" : "text-base",
                                    isActive ? "text-primary scale-105 origin-left" : "text-foreground/80 group-hover:text-foreground"
                                )}>
                                    {prayer.name}
                                    {isActive && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                    )}
                                </span>
                                <span className={cn(
                                    "font-extrabold tabular-nums transition-all",
                                    compact ? "text-lg text-muted-foreground" : "text-base",
                                    isActive ? "text-primary scale-105 origin-right" : hasTime ? "text-foreground/80 group-hover:text-foreground" : "text-muted-foreground/30"
                                )}>
                                    {hasTime ? prayer.time : '—'}
                                </span>
                            </div>
                            {idx < prayers.length - 1 && (
                                <div className={cn("h-px bg-border/40 mx-2", compact && "opacity-50")} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    );
};
