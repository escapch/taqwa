"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { execute, loading } = useFetch<{ message: string }>(
    "/auth/forgot-password",
    { method: "POST", skip: true }
  );

  const onSubmit = async (data: FormData) => {
    const res = await execute(data);
    if (res) {
      setSent(true);
    } else {
      toast.error("Не удалось отправить письмо, попробуйте позже");
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-sm space-y-6 text-center">
          <MailCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Проверьте почту</h1>
          <p className="text-muted-foreground text-sm">
            Если аккаунт с таким email существует, мы отправили на него ссылку для сброса пароля.
          </p>
          <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
            Вернуться ко входу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Забыли пароль?</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Введите email — пришлём ссылку для сброса пароля
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className={cn({ "border-red-500 focus-visible:ring-red-500": errors.email })}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Отправить ссылку <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="flex items-center justify-center gap-1 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться ко входу
        </button>
      </div>
    </div>
  );
}
