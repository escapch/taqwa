'use client';

import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { ArrowUp, Trash2 } from 'lucide-react';

interface Comment {
  _id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

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
        <DrawerTitle className="text-lg font-semibold px-4 pb-2">Комментарии</DrawerTitle>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 min-h-[120px]">
          {loading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Загрузка...</p>
          )}
          {!loading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Пока нет комментариев — будьте первым
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{comment.authorName}</p>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
              {(comment.userId === user?.id || user?.isAdmin) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2 p-4 pt-2 border-t">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Написать комментарий..."
            className="min-h-[44px] max-h-[44px]"
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
