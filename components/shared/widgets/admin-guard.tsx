'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profile';

export const AdminGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(() => useProfileStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useProfileStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (hydrated && (!isAuthenticated || !user?.isAdmin)) {
      router.replace('/hadiths');
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated || !isAuthenticated || !user?.isAdmin) return null;

  return <>{children}</>;
};
