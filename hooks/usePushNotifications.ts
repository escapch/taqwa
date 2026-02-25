import { useState, useEffect, useCallback } from "react";
import { useProfileStore } from "@/store/profile";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0))) as Uint8Array<ArrayBuffer>;
}

async function fetchVapidKey(): Promise<string> {
    // Try environment variable first
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    }
    // Fallback to fetching from backend
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/vapid-public-key`
    );
    if (!res.ok) throw new Error("Failed to fetch VAPID key");
    const data = await res.json();
    return data.publicKey;
}

export function usePushNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useProfileStore((state) => state.token);

    useEffect(() => {
        const supported =
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            "PushManager" in window;
        setIsSupported(supported);

        if (supported) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((sub) => {
                    setIsSubscribed(!!sub);
                });
            });
        }
    }, []);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!isSupported) return false;

        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                toast.info("Разрешение на уведомления отклонено");
                return false;
            }

            const vapidKey = await fetchVapidKey();

            // Ensure Service Worker is registered
            let registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations.length === 0) {
                await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            }

            const registration = await navigator.serviceWorker.ready;

            // Subscribe to PushManager
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });

            // Send subscription to backend
            const backendRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(subscription),
                }
            );

            if (!backendRes.ok) {
                throw new Error(`Ошибка сервера: ${backendRes.status}`);
            }

            setIsSubscribed(true);
            toast.success("Уведомления успешно включены!");
            return true;
        } catch (err: any) {
            console.error("Push subscription error:", err);
            toast.error(`Не удалось включить уведомления: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isSupported, token]);

    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!isSupported) return false;

        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                setIsSubscribed(false);
                toast.success("Уведомления отключены");
            }
            return true;
        } catch (err) {
            console.error("Push unsubscription error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isSupported]);

    return { subscribe, unsubscribe, isSubscribed, isSupported, loading };
}
