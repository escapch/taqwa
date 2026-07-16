'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Container } from '../container';
import { HadithCard } from './hadith-card';

export interface HadithItem {
  _id: string;
  text: string;
  tags: string[];
  source?: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  createdAt: string;
}

interface FeedResponse {
  items: HadithItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const HadithsFeed: React.FC = () => {
  const [items, setItems] = useState<HadithItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { execute, loading } = useFetch<FeedResponse>('/hadiths?limit=10', { auth: true });

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    const url = cursor
      ? `/hadiths?limit=10&cursor=${encodeURIComponent(cursor)}`
      : '/hadiths?limit=10';
    const res = await execute(undefined, url);
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    loadingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '600px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleLikeToggle = (id: string, liked: boolean, likesCount: number) => {
    setItems((prev) => prev.map((it) => (it._id === id ? { ...it, liked, likesCount } : it)));
  };

  const handleCommentCountChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it._id === id ? { ...it, commentsCount: Math.max(0, it.commentsCount + delta) } : it
      )
    );
  };

  return (
    <Container className="flex flex-col gap-4 pt-10 pb-24">
      <p className="text-3xl font-medium">Лучи</p>

      {!loading && items.length === 0 && (
        <p className="text-muted-foreground text-center py-10">Пока здесь пусто — загляните позже</p>
      )}

      {items.map((item) => (
        <HadithCard
          key={item._id}
          item={item}
          onLikeToggle={(liked, likesCount) => handleLikeToggle(item._id, liked, likesCount)}
          onCommentCountChange={(delta) => handleCommentCountChange(item._id, delta)}
        />
      ))}

      <div ref={sentinelRef} className="h-1" />
      {loading && <p className="text-center text-sm text-muted-foreground py-4">Загрузка...</p>}
    </Container>
  );
};
