'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';
import { Container } from '../container';
import { Header } from '../widgets/header';
import { useFetch } from '@/hooks/useFetch';
import { useHadithLike } from '@/hooks/useHadithLike';
import { HadithActionButton } from './hadith-action-button';
import { ShareButton } from './share-button';
import { HadithCommentsSheet } from './hadith-comments-sheet';
import type { HadithItem } from './hadiths-feed';

export const HadithDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<HadithItem | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const { execute: fetchItem, loading } = useFetch<HadithItem>(`/hadiths/${id}`, { auth: true });

  useEffect(() => {
    fetchItem().then((res) => {
      if (res) setItem(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLikeChange = (liked: boolean, likesCount: number) => {
    setItem((prev) => (prev ? { ...prev, liked, likesCount } : prev));
  };

  const handleCommentCountChange = (delta: number) => {
    setItem((prev) =>
      prev ? { ...prev, commentsCount: Math.max(0, prev.commentsCount + delta) } : prev
    );
  };

  const handleLike = useHadithLike(id, item?.liked ?? false, item?.likesCount ?? 0, handleLikeChange);

  if (loading && !item) {
    return (
      <Container className="pt-10 text-center text-muted-foreground">Загрузка...</Container>
    );
  }

  if (!item) {
    return (
      <Container className="pt-10 text-center text-muted-foreground">Запись не найдена</Container>
    );
  }

  return (
    <Container className="flex flex-col gap-6 pt-10 pb-24">
      <Header headerTitle="Луч" />

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xl leading-relaxed font-medium whitespace-pre-line">{item.text}</p>
      {item.source && <p className="text-sm text-muted-foreground">— {item.source}</p>}

      <div className="flex items-center gap-6 pt-2">
        <HadithActionButton
          icon={
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                item.liked ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          }
          label={item.likesCount}
          onClick={handleLike}
        />
        <HadithActionButton
          icon={<MessageCircle className="w-5 h-5" />}
          label={item.commentsCount}
          onClick={() => setCommentsOpen(true)}
        />
        <ShareButton text={item.text} />
      </div>

      <HadithCommentsSheet
        contentId={item._id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        onCommentCountChange={handleCommentCountChange}
      />
    </Container>
  );
};
