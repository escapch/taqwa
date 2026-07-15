import { useRouter } from 'next/navigation';
import { useFetch } from './useFetch';
import { useAuth } from './useAuth';

export function useHadithLike(
  id: string,
  liked: boolean,
  likesCount: number,
  onChange: (liked: boolean, likesCount: number) => void
) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { execute } = useFetch<{ liked: boolean; likesCount: number }>(`/hadiths/${id}/like`, {
    method: 'POST',
    auth: true,
  });

  return async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    onChange(!liked, likesCount + (liked ? -1 : 1));
    const res = await execute();
    if (res) onChange(res.liked, res.likesCount);
  };
}
