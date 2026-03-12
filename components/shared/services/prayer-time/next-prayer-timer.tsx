'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

interface Props {
    className?: string;
    prayerTimes: Record<string, string>;
    userTimezone: string;
    onTimerUpdate?: (nextPrayer: string, timeLeft: string) => void;
    render?: (nextPrayer: string, h: string, m: string, s: string) => React.ReactNode;
}

export const NextPrayerTimer: React.FC<Props> = ({ className, prayerTimes, userTimezone, onTimerUpdate, render }) => {
    const [timeLeft, setTimeLeft] = useState<{ h: string, m: string, s: string } | null>(null);
    const [nextPrayerName, setNextPrayerName] = useState<string>('');

    const prayers = useMemo(() => [
        { name: 'Фаджр', key: 'Fajr' },
        { name: 'Зухр', key: 'Dhuhr' },
        { name: 'Аср', key: 'Asr' },
        { name: 'Магриб', key: 'Maghrib' },
        { name: 'Иша', key: 'Isha' },
    ], []);

    useEffect(() => {
        if (!prayerTimes.Fajr || !userTimezone) return;

        const intervalId = setInterval(() => {
            const now = dayjs().tz(userTimezone);
            const todayDateStr = now.format('YYYY-MM-DD');

            let nextPrayer = null;
            let nextPrayerTime: dayjs.Dayjs | null = null;

            for (const prayer of prayers) {
                const timeStr = prayerTimes[prayer.key];
                if (!timeStr) continue;

                const prayerDateTime = dayjs.tz(`${todayDateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm', userTimezone);

                if (now.isBefore(prayerDateTime)) {
                    nextPrayer = prayer.name;
                    nextPrayerTime = prayerDateTime;
                    break;
                }
            }

            if (!nextPrayer && prayerTimes.Fajr) {
                nextPrayer = prayers[0].name;
                nextPrayerTime = dayjs.tz(`${todayDateStr} ${prayerTimes.Fajr}`, 'YYYY-MM-DD HH:mm', userTimezone).add(1, 'day');
            }

            if (nextPrayerTime && nextPrayer) {
                setNextPrayerName(nextPrayer);
                const diffMs = nextPrayerTime.diff(now);

                const dur = dayjs.duration(diffMs);
                const h = Math.floor(dur.asHours()).toString().padStart(2, '0');
                const m = dur.minutes().toString().padStart(2, '0');
                const s = dur.seconds().toString().padStart(2, '0');

                const formattedTime = h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`;
                setTimeLeft({ h, m, s });
                if (onTimerUpdate) onTimerUpdate(nextPrayer, formattedTime);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [prayerTimes, prayers, userTimezone, onTimerUpdate]);

    if (!timeLeft) return null;

    if (render) return render(nextPrayerName, timeLeft.h, timeLeft.m, timeLeft.s);

    return (
        <div className={cn("text-center", className)}>
            <span className="text-sm font-medium opacity-60">До {nextPrayerName} осталось</span>
            <div className="text-4xl font-bold">{timeLeft.h !== '00' ? `${timeLeft.h}:` : ''}{timeLeft.m}:{timeLeft.s}</div>
        </div>
    );
};
