'use client';

import { useEffect, useRef, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNowStrict } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowUp, MessageCircle, Trash2 } from 'lucide-react';

interface Comment {
  _id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

interface CommentsResponse {
  items: Comment[];
  total: number;
  hasMore: boolean;
}

interface Props {
  contentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentCountChange: (delta: number) => void;
}

export const HadithCommentsSheet: React.FC<Props> = ({
  contentId,
  open,
  onOpenChange,
  onCommentCountChange,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { execute: fetchComments, loading } = useFetch<CommentsResponse>(
    `/hadiths/${contentId}/comments?limit=50`
  );
  const { execute: postComment, loading: posting } = useFetch<Comment>(
    `/hadiths/${contentId}/comments`,
    { method: 'POST', auth: true }
  );
  const { execute: removeComment } = useFetch<{ message: string }>('', {
    method: 'DELETE',
    auth: true,
  });

  useEffect(() => {
    if (!open) return;
    fetchComments().then((res) => {
      if (res) setComments(res.items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contentId]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [open, comments.length]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const res = await postComment({ text: trimmed });
    if (res) {
      setComments((prev) => [...prev, res]);
      setText('');
      onCommentCountChange(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (commentId: string) => {
    const res = await removeComment(undefined, `/hadiths/${contentId}/comments/${commentId}`);
    if (res) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCommentCountChange(-1);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92dvh] max-h-[92dvh]">
        <DrawerTitle className="text-lg font-semibold px-4 pb-2">
          Комментарии{comments.length > 0 && ` (${comments.length})`}
        </DrawerTitle>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 min-h-[120px]">
          {loading && comments.length === 0 && (
            <div className="flex flex-col gap-4 pt-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 pt-0.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-full max-w-[220px]" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div className="flex flex-col items-center gap-2 text-center py-10">
              <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Пока нет комментариев — будьте первым
              </p>
            </div>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {getInitials(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-semibold truncate">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNowStrict(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                  {comment.text}
                </p>
              </div>
              {(comment.userId === user?.id || user?.isAdmin) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-muted-foreground hover:text-destructive shrink-0 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex items-end gap-2 p-4 pt-2 border-t">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать комментарий..."
            rows={1}
            className="min-h-[44px] max-h-[120px] resize-none"
          />
          <button
            onClick={handleSend}
            disabled={posting || !text.trim()}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-transform active:scale-90"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
