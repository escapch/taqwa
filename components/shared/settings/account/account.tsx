'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Container } from '../../container';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Header } from '../../widgets/header';

interface Props {
  className?: string;
}

export const Account: React.FC<Props> = ({ className }) => {
  const [user, setUser] = useState({ username: 'test' });
  const router = useRouter();

  return (
    <Container className="flex flex-col  justify-between gap-5">
      <Header headerTitle="Профиль" />
      {user && (
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};
