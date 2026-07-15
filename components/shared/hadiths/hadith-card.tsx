'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useHadithLike } from '@/hooks/useHadithLike';
import { useRouter } from 'next/navigation';
import { HadithCommentsSheet } from './hadith-comments-sheet';
import { ShareButton } from './share-button';
import { HadithActionButton } from './hadith-action-button';
import type { HadithItem } from './hadiths-feed';

interface Props {
  item: HadithItem;
  onLikeToggle: (liked: boolean, likesCount: number) => void;
  onCommentCountChange: (delta: number) => void;
}

export const HadithCard: React.FC<Props> = ({ item, onLikeToggle, onCommentCountChange }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (el) setIsTruncated(el.scrollHeight - el.clientHeight > 1);
  }, [item.text]);

  const handleLike = useHadithLike(item._id, item.liked, item.likesCount, onLikeToggle);

  const handleCommentsClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setCommentsOpen(true);
  };

  return (
    <Card className="p-4 flex flex-col gap-3">
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

      <div className="flex flex-col gap-1.5">
        <p
          ref={textRef}
          className={cn(
            'text-base leading-relaxed whitespace-pre-line',
            !expanded && 'line-clamp-6'
          )}
        >
          {item.text}
        </p>
        {isTruncated && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-primary text-sm font-semibold text-left"
          >
            {expanded ? 'Свернуть' : 'Читать полностью'}
          </button>
        )}
      </div>

      {item.source && <p className="text-sm text-muted-foreground">— {item.source}</p>}

      <div className="flex items-center gap-5 pt-1">
        <HadithActionButton
          icon={
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                item.liked ? 'fill-red-500 text-red-500' : ''
              )}
            />
          }
          label={item.likesCount}
          onClick={handleLike}
        />
        <HadithActionButton
          icon={<MessageCircle className="w-5 h-5" />}
          label={item.commentsCount}
          onClick={handleCommentsClick}
        />
        <ShareButton text={item.text} />
      </div>

      <HadithCommentsSheet
        contentId={item._id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        onCommentCountChange={onCommentCountChange}
      />
    </Card>
  );
};
