'use client';

import { useEffect, useState } from 'react';
import { Container } from '../container';
import { Header } from '../widgets/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import type { HadithItem } from './hadiths-feed';

interface FeedResponse {
  items: HadithItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

const emptyForm = { text: '', tags: [] as string[], source: '' };

export const HadithsAdmin: React.FC = () => {
  const [items, setItems] = useState<HadithItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');

  const { execute: fetchAll, loading } = useFetch<FeedResponse>('/hadiths?limit=200', {
    auth: true,
  });
  const { execute: createItem, loading: creating } = useFetch<HadithItem>('/hadiths', {
    method: 'POST',
    auth: true,
  });
  const { execute: updateItem, loading: updating } = useFetch<HadithItem>('', {
    method: 'PATCH',
    auth: true,
  });
  const { execute: deleteItem } = useFetch<{ message: string }>('', {
    method: 'DELETE',
    auth: true,
  });

  const load = async () => {
    const res = await fetchAll();
    if (res) setItems(res.items);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setTagInput('');
    setEditingId(null);
  };

  const handleEdit = (item: HadithItem) => {
    setEditingId(item._id);
    setForm({ text: item.text, tags: item.tags, source: item.source || '' });
    setTagInput('');
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    const text = form.text.trim();
    if (!text) {
      toast.error('Введите текст');
      return;
    }

    const payload = { text, tags: form.tags, source: form.source.trim() || undefined };

    if (editingId) {
      const res = await updateItem(payload, `/hadiths/${editingId}`);
      if (res) {
        toast.success('Изменения сохранены');
        resetForm();
        load();
      }
    } else {
      const res = await createItem(payload);
      if (res) {
        toast.success('Опубликовано');
        resetForm();
        load();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteItem(undefined, `/hadiths/${id}`);
    if (res) {
      toast.success('Удалено');
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (editingId === id) resetForm();
    }
  };

  return (
    <Container className="flex flex-col gap-5 pt-10 pb-24">
      <Header headerTitle="Управление Лучами" />

      <Card className="p-5 flex flex-col gap-4">
        <Textarea
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="Текст хадиса или истории..."
          className="min-h-[120px]"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Теги</label>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Например: ахляк — Enter, чтобы добавить"
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Добавить
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Источник</label>
          <Input
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
            placeholder="Например: Сахих аль-Бухари, №1"
          />
        </div>

        <div className="flex gap-2 justify-end">
          {editingId && (
            <Button variant="outline" onClick={resetForm} className="gap-1">
              <X className="w-4 h-4" />
              Отмена
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={creating || updating} className="gap-2">
            {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Сохранить' : 'Опубликовать'}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Загрузка...</p>
        )}
        {items.map((item) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold w-fit px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm line-clamp-3">{item.text}</p>
              {item.source && <p className="text-xs text-muted-foreground">— {item.source}</p>}
              <p className="text-xs text-muted-foreground">
                {item.likesCount} лайков · {item.commentsCount} комментариев
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};
