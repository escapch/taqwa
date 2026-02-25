"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
    MapPin,
    Bell,
    CheckCircle,
    XCircle,
    Loader2,
    BellOff,
} from "lucide-react";
import { toast } from "sonner";

type GeoStatus = "idle" | "loading" | "success" | "denied";
type Step = "geo" | "notifications";

export default function Setup() {
    const [step, setStep] = useState<Step>("geo");
    const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
    const router = useRouter();

    const { execute: sendLocation } = useFetch<
        unknown,
        { latitude: number; longitude: number }
    >("/users/location", {
        method: "PATCH",
        auth: true,
        skip: true,
    });

    const { subscribe, isSupported, loading: notifLoading } = usePushNotifications();

    // ─── Step 1: Geolocation ───────────────────────────────────────────────────

    const handleAllowGeo = () => {
        if (typeof window === "undefined" || !navigator.geolocation) {
            toast.error("Геолокация недоступна в вашем браузере");
            setStep("notifications");
            return;
        }

        setGeoStatus("loading");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await sendLocation({ latitude, longitude });
                setGeoStatus("success");
                setTimeout(() => setStep("notifications"), 900);
            },
            () => setGeoStatus("denied"),
            { timeout: 10000 }
        );
    };

    const handleSkipGeo = () => setStep("notifications");

    // ─── Step 2: Notifications ─────────────────────────────────────────────────

    const handleAllowNotifications = async () => {
        const ok = await subscribe();
        if (ok) {
            toast.success("Уведомления включены!");
        }
        router.push("/");
    };

    const handleSkipNotifications = () => router.push("/");

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
            <Card className="w-full max-w-md p-6">
                <CardContent className="flex flex-col items-center gap-6 pt-2">

                    {/* Step indicator */}
                    <div className="flex gap-2">
                        <div className={`h-1.5 w-8 rounded-full transition-all ${step === "geo" ? "bg-primary" : "bg-primary/30"}`} />
                        <div className={`h-1.5 w-8 rounded-full transition-all ${step === "notifications" ? "bg-primary" : "bg-muted"}`} />
                    </div>

                    {/* ── GEO STEP ── */}
                    {step === "geo" && (
                        <>
                            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                                {geoStatus === "loading" && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
                                {geoStatus === "success" && <CheckCircle className="w-12 h-12 text-green-500" />}
                                {geoStatus === "denied" && <XCircle className="w-12 h-12 text-red-500" />}
                                {geoStatus === "idle" && <MapPin className="w-12 h-12 text-primary" />}
                            </div>

                            <div className="text-center space-y-2">
                                {geoStatus === "idle" && (
                                    <>
                                        <h1 className="text-2xl font-bold">Время намазов</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Разрешите доступ к геолокации, чтобы мы могли точно рассчитать
                                            время намазов для вашего города.
                                        </p>
                                    </>
                                )}
                                {geoStatus === "loading" && (
                                    <>
                                        <h1 className="text-2xl font-bold">Определяем местоположение...</h1>
                                        <p className="text-muted-foreground text-sm">Пожалуйста, разрешите доступ в диалоге браузера</p>
                                    </>
                                )}
                                {geoStatus === "success" && (
                                    <>
                                        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Готово!</h1>
                                        <p className="text-muted-foreground text-sm">Геолокация сохранена.</p>
                                    </>
                                )}
                                {geoStatus === "denied" && (
                                    <>
                                        <h1 className="text-2xl font-bold">Доступ запрещён</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Вы сможете указать город вручную в настройках.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col w-full gap-3">
                                {geoStatus === "idle" && (
                                    <>
                                        <Button className="w-full" onClick={handleAllowGeo}>
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Разрешить доступ
                                        </Button>
                                        <Button variant="outline" className="w-full" onClick={handleSkipGeo}>
                                            Позже
                                        </Button>
                                    </>
                                )}
                                {geoStatus === "loading" && (
                                    <Button className="w-full" disabled>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Ожидание...
                                    </Button>
                                )}
                                {geoStatus === "denied" && (
                                    <>
                                        <Button className="w-full" onClick={handleAllowGeo}>
                                            Попробовать снова
                                        </Button>
                                        <Button variant="outline" className="w-full" onClick={handleSkipGeo}>
                                            Продолжить без геолокации
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── NOTIFICATIONS STEP ── */}
                    {step === "notifications" && (
                        <>
                            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                                {notifLoading
                                    ? <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    : <Bell className="w-12 h-12 text-primary" />
                                }
                            </div>

                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-bold">Напоминания о намазах</h1>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Разрешите уведомления, и мы будем напоминать вам о времени каждого намаза.
                                </p>
                            </div>

                            <div className="flex flex-col w-full gap-3">
                                {isSupported ? (
                                    <>
                                        <Button
                                            className="w-full"
                                            onClick={handleAllowNotifications}
                                            disabled={notifLoading}
                                        >
                                            {notifLoading
                                                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                : <Bell className="w-4 h-4 mr-2" />
                                            }
                                            Включить уведомления
                                        </Button>
                                        <Button variant="outline" className="w-full" onClick={handleSkipNotifications}>
                                            Позже
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                                            <BellOff className="w-4 h-4" />
                                            Уведомления не поддерживаются вашим браузером
                                        </div>
                                        <Button className="w-full" onClick={handleSkipNotifications}>
                                            Продолжить
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
