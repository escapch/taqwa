"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Container } from "../../container";
import { useRouter } from "next/navigation";
import { Header } from "../../widgets/header";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Pencil,
  Save,
  X,
  KeyRound,
  LogOut,
  Trash2,
  CalendarDays,
  Globe,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";

interface Props {
  className?: string;
}

interface UserFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const Account: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { logOut, updateProfile, changePassword, deleteAccount } =
    useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Keep form in sync with user data
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({ name: user?.name || "", email: user?.email || "" });
    setIsEditing(false);
  };

  const onSaveProfile = async (data: UserFormData) => {
    setSaving(true);
    const success = await updateProfile(data);
    setSaving(false);

    if (success) {
      toast.success("Профиль обновлён");
      setIsEditing(false);
    } else {
      toast.error("Не удалось обновить профиль");
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setChangingPassword(true);
    const success = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setChangingPassword(false);

    if (success) {
      toast.success("Пароль успешно изменён");
      resetPassword();
      setShowPasswordForm(false);
    } else {
      toast.error("Неверный текущий пароль");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const success = await deleteAccount();
    setDeleting(false);

    if (success) {
      toast.success("Аккаунт удалён");
      router.push("/login");
    } else {
      toast.error("Не удалось удалить аккаунт");
      setDeleteOpen(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Container className="flex flex-col justify-between gap-5 pt-10">
      <Header headerTitle="Профиль" />

      {/* Profile Info */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Личные данные</h3>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" />
              Редактировать
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-1"
              >
                <X className="w-4 h-4" />
                Отмена
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmit(onSaveProfile)}
                disabled={saving}
                className="gap-1"
              >
                <Save className="w-4 h-4" />
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          )}
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Имя обязательно" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Введите имя"
                  id="name"
                  readOnly={!isEditing}
                  className={!isEditing ? "opacity-70" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Эл. адрес</Label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email обязателен",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Некорректный email",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Email"
                  id="email"
                  readOnly={!isEditing}
                  className={!isEditing ? "opacity-70" : ""}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Info fields (always readonly) */}
          <div className="flex flex-col gap-3 pt-2 border-t mt-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Дата регистрации:</span>
              <span className="font-medium text-foreground">
                {formatDate(user?.registeredAt)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Часовой пояс:</span>
              <span className="font-medium text-foreground">
                {user?.timezone || "—"}
              </span>
            </div>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Смена пароля</h3>
          </div>
          {!showPasswordForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordForm(true)}
            >
              Изменить
            </Button>
          )}
        </div>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordSubmit(onChangePassword)}
            className="flex flex-col gap-4 mt-4 pt-4 border-t"
          >
            <div>
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Controller
                  name="currentPassword"
                  control={passwordControl}
                  rules={{ required: "Введите текущий пароль" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Текущий пароль"
                      id="currentPassword"
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive mt-1">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">Новый пароль</Label>
              <div className="relative">
                <Controller
                  name="newPassword"
                  control={passwordControl}
                  rules={{
                    required: "Введите новый пароль",
                    minLength: {
                      value: 6,
                      message: "Минимум 6 символов",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Новый пароль"
                      id="newPassword"
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Controller
                name="confirmPassword"
                control={passwordControl}
                rules={{
                  required: "Подтвердите пароль",
                  validate: (value) =>
                    value === watchPassword("newPassword") ||
                    "Пароли не совпадают",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Подтвердите новый пароль"
                    id="confirmPassword"
                  />
                )}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  resetPassword();
                }}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={changingPassword} className="gap-2">
                <KeyRound className="w-4 h-4" />
                {changingPassword ? "Сохранение..." : "Сменить пароль"}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Account Management (Logout & Delete) */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Управление аккаунтом</h3>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            className="gap-2 justify-start"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="w-4 h-4" />
            Выйти из аккаунта
          </Button>

          <Button
            variant="ghost"
            className="w-full gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Удалить аккаунт
          </Button>
        </div>
      </Card>

      {/* Logout Dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader className="text-start">
            <DialogTitle>Выйти из аккаунта</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите выйти?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить аккаунт</DialogTitle>
            <DialogDescription>
              Это действие необратимо. Все ваши данные, настройки и история будут удалены навсегда.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Удаление..." : "Удалить навсегда"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
