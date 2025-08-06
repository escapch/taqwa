'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

export const AuthNotificationsModal: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isLoginRegister = pathname === '/login' || pathname === '/register';
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || isLoginRegister) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [user]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Сохраняйте Ваши задачи</DialogTitle>
          <DialogDescription>
            Чтобы сохранить созданные задачи и получать к ним доступ с любого устройства,
            пожалуйста, войдите в аккаунт или зарегистрируйтесь. Это позволит Вам не потерять
            прогресс и продолжить работу в любое удобное время.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)} variant="outline">
            Позже
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              router.push('/login');
            }}
          >
            Войти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
