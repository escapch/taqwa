'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../container';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  headerTitle: string;
  className?: string;
}

export const Header: React.FC<Props> = ({ headerTitle, className }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-3xl font-medium">{headerTitle}</p>
      <X className="text-primary cursor-pointer" onClick={() => router.back()} />
    </div>
  );
};
