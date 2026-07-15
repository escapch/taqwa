'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { HadithActionButton } from './hadith-action-button';

interface Props {
  text: string;
}

export const ShareButton: React.FC<Props> = ({ text }) => {
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = { title: 'Taqwa', text, url };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // пользователь отменил шеринг — ничего не делаем
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      toast.success('Ссылка скопирована');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  return <HadithActionButton icon={<Share2 className="w-5 h-5" />} onClick={handleShare} />;
};
