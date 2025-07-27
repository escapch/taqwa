"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Container } from "../../container";
import { useRouter } from "next/navigation";
import { Header } from "../../widgets/header";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";

interface Props {
  className?: string;
}

interface UserFormData {
  name: string;
  email: string;
}

export const Account: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { logOut } = useProfileStore();
  const [open, setOpen] = useState(false);

  const { control } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <Container className="flex flex-col justify-between gap-5">
      <Header headerTitle="Профиль" />
      <Card>
        <div className="flex flex-col gap-4 items-center p-4">
          <div className="flex flex-col gap-2">
            <Avatar className="w-[100px] h-full">
              <AvatarImage
                src={user?.avatar || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="link2">Изменить</Button>
          </div>

          <div className="w-full">
            <Label htmlFor="name">Имя</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Имя" id="name" readOnly />
              )}
            />
          </div>

          <div className="w-full">
            <Label htmlFor="email">Эл. адрес</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Email" id="email" readOnly />
              )}
            />
          </div>

          <div className="w-full">
            <Button variant="destructive" onClick={() => setOpen(true)}>
              Выйти
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выйти из аккаунта</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
