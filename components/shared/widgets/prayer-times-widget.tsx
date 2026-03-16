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
            compact
                ? "bg-transparent border-0 shadow-none p-0"
                : "bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] overflow-hidden p-8 shadow-2xl",
            cardClassName,
            className
        )}>
            {/* Timer + City */}
            <div className={cn("flex items-start mb-2", compact ? "justify-end" : "justify-between")}>
                {!compact && (
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
                )}

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
            <div className={cn("flex flex-col", compact ? "mt-2" : "mt-8")}>
                {prayers.map((prayer, idx) => {
                    const isActive = prayer.key === activePrayerKey;
                    const hasTime = !!prayer.time;
                    return (
                        <div key={prayer.key}>
                            <div className={cn(
                                "flex justify-between items-center rounded-xl px-3 -mx-3 transition-colors",
                                compact ? "py-2" : "py-3",
                                isActive && "bg-white/5"
                            )}>
                                <span className={cn(
                                    "font-bold transition-colors flex items-center gap-2",
                                    compact ? "text-lg text-zinc-400" : "text-base",
                                    isActive ? "text-primary" : "text-zinc-300"
                                )}>
                                    {prayer.name}
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </span>
                                <span className={cn(
                                    "font-bold tabular-nums transition-colors",
                                    compact ? "text-lg text-zinc-400" : "text-base",
                                    isActive ? "text-primary" : hasTime ? "text-zinc-300" : "text-zinc-600"
                                )}>
                                    {hasTime ? prayer.time : '—'}
                                </span>
                            </div>
                            {idx < prayers.length - 1 && (
                                <div className={cn("h-px bg-zinc-800/60 mx-1", compact && "opacity-50")} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
