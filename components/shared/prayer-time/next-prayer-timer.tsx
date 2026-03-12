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
}

export const NextPrayerTimer: React.FC<Props> = ({ className, prayerTimes, userTimezone }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
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
                    break; // Found the next prayer today
                }
            }

            // If no prayer is left today, the next prayer is Fajr tomorrow
            if (!nextPrayer && prayerTimes.Fajr) {
                nextPrayer = prayers[0].name;
                nextPrayerTime = dayjs.tz(`${todayDateStr} ${prayerTimes.Fajr}`, 'YYYY-MM-DD HH:mm', userTimezone).add(1, 'day');
            }

            if (nextPrayerTime && nextPrayer) {
                setNextPrayerName(nextPrayer);
                const diffMs = nextPrayerTime.diff(now);

                if (diffMs <= 0) {
                    setTimeLeft('00:00:00');
                } else {
                    const duration = dayjs.duration(diffMs);
                    const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
                    const minutes = duration.minutes().toString().padStart(2, '0');
                    const seconds = duration.seconds().toString().padStart(2, '0');
                    setTimeLeft(`${hours}:${minutes}:${seconds}`);
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [prayerTimes, prayers, userTimezone]);

    if (!timeLeft) {
        return null;
    }

    return (
        <div className={cn("flex flex-col items-center justify-center p-6 bg-primary/10 rounded-2xl border border-primary/20", className)}>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">До {nextPrayerName} осталось</h3>
            <div className="text-5xl font-bold tracking-tight text-primary font-mono">
                {timeLeft}
            </div>
        </div>
    );
};
