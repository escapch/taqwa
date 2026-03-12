"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import { Label } from "@/components/ui/label";
import { Chrome, Github, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const { logIn } = useProfileStore();

  const { execute, loading } = useFetch<{ accessToken: string }>(
    "/auth/register",
    {
      method: "POST",
      skip: true,
    }
  );


  const onSubmit = async (data: RegisterFormData) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const res = await execute({
      ...data,
      timezone,
    });

    if (res?.accessToken) {
      await logIn({ email: data.email, password: data.password });
      toast.success("Успешная регистрация!");
      router.push("/register/setup");
    } else {
      toast.error("Не удалось зарегистрироваться");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Создать аккаунт</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Присоединяйтесь к нам и начните свой путь
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Chrome className="h-4 w-4" />
            <span className="text-sm">Google</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <span className="text-sm">GitHub</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              или через email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                className={cn({ "border-red-500 focus-visible:ring-red-500": errors.name })}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={cn({ "border-red-500 focus-visible:ring-red-500": errors.email })}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                className={cn({ "border-red-500 focus-visible:ring-red-500": errors.password })}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Регистрация <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Уже есть аккаунт? </span>
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
