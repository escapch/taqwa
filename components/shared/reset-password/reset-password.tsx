"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    newPassword: z.string().min(6, { message: "Минимум 6 символов" }),
    confirmPassword: z.string().min(6, { message: "Минимум 6 символов" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { execute, loading } = useFetch<{ message: string }>(
    "/auth/reset-password",
    { method: "POST", skip: true }
  );

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    const res = await execute({ token, newPassword: data.newPassword });
    if (res) {
      toast.success("Пароль изменён, теперь можно войти");
      router.push("/login");
    } else {
      toast.error("Ссылка недействительна или устарела");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-sm space-y-6 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">Ссылка недействительна</h1>
          <p className="text-muted-foreground text-sm">
            В ссылке отсутствует токен сброса пароля. Запросите новую.
          </p>
          <Button className="w-full" onClick={() => router.push("/forgot-password")}>
            Запросить новую ссылку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Новый пароль</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Придумайте новый пароль для входа
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Новый пароль</Label>
            <PasswordInput
              id="newPassword"
              placeholder="********"
              className={cn({ "border-red-500 focus-visible:ring-red-500": errors.newPassword })}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="********"
              className={cn({
                "border-red-500 focus-visible:ring-red-500": errors.confirmPassword,
              })}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Сохранить пароль <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
