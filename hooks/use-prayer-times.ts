import { useState, useEffect, useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useProfileStore } from '@/store/profile';
import { toast } from 'sonner';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Tahajjud: string;
    Weekday: string;
    date: string;
}

const STORAGE_KEY = 'taqwa_guest_location';

export const usePrayerTimes = () => {
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

    const isLoading = (isInitialized && !user && !browserLocation && isRequestingGeo) || authLoading || publicLoading;
    const activeTimezone = user?.timezone || browserTimezone || 'Asia/Bishkek';

    return {
        prayerTimes,
        isLoading,
        isInitialized,
        user,
        browserLocation,
        currentCity,
        activeTimezone,
        requestGeolocation,
    };
};
