'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SendHorizontal, Clock, ListTodo, Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Taskslist } from './tasks-list';
import { motion } from 'framer-motion';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { PrayerTimesWidget } from './prayer-times-widget';

interface Props {
  className?: string;
}

export interface ITasks {
  _id: number;
  title: string;
  isCompleted: boolean;
  type: string;
}

export const defaultTasks = [
  { _id: 1, title: 'Фаджр', isCompleted: false, type: 'fard' },
  { _id: 2, title: 'Зухр', isCompleted: false, type: 'fard' },
  { _id: 3, title: 'Аср', isCompleted: false, type: 'fard' },
  { _id: 4, title: 'Магриб', isCompleted: false, type: 'fard' },
  { _id: 5, title: 'Иша', isCompleted: false, type: 'fard' },
];

export const TodoList: React.FC<Props> = ({ className }) => {
  const [newTodo, setNewTodo] = useState('');
  const [progress, setProgress] = useState(0);
  const { isAuthenticated } = useAuth();
  const [todoList, setTodoList] = useState<ITasks[]>(() => {
    if (typeof window === 'undefined') return defaultTasks;
    const cached = sessionStorage.getItem('tasks-today');
    if (!cached) return defaultTasks;

    const { date, tasks } = JSON.parse(cached);
    const today = new Date().toDateString();

    return date === today ? tasks : defaultTasks;
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const { prayerTimes, isLoading, user, browserLocation, currentCity, activeTimezone, requestGeolocation } = usePrayerTimes();

  // Task API hooks
  const { execute, data } = useFetch<ITasks[]>('/task/today', {
    method: 'GET',
    auth: true,
    skip: true,
  });
  const { execute: toggleTask } = useFetch('', {
    method: 'PATCH',
    auth: true,
    skip: true,
  });
  const { execute: deleteTask } = useFetch('', {
    method: 'DELETE',
    auth: true,
    skip: true,
  });
  const { execute: addCustomTask } = useFetch('/task/custom', {
    method: 'POST',
    auth: true,
    skip: true,
  });

  // Tasks effect
  useEffect(() => {
    if (isAuthenticated) {
      execute();
    }
  }, [isAuthenticated, execute]);

  useEffect(() => {
    if (data) {
      setTodoList(data);
      sessionStorage.setItem('tasks-today', JSON.stringify({
        date: new Date().toDateString(),
        tasks: data,
      }));
    }
  }, [data]);

  // Actions
  const toggleTodo = async (id: number) => {
    const previousList = todoList;
    setTodoList((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );

    const result = await toggleTask(undefined, `/task/${id}/toggle`);

    if (!result) {
      setTodoList(previousList);
      toast.error('Произошла ошибка, попробуйте еще раз');
    }
  };

  const removeTodo = async (id: number) => {
    const previousList = todoList;
    setTodoList((prev) => prev.filter((todo) => todo._id !== id));

    const result = await deleteTask(undefined, `/task/${id}`);

    if (!result) {
      setTodoList(previousList);
      toast.error('Произошла ошибка, попробуйте еще раз');
    }
  };

  const addTask = async () => {
    if (newTodo.trim() && newTodo) {
      try {
        await addCustomTask({ title: newTodo });
        await execute();
      } catch (err) {
        toast.error('Произошла ошибка, попробуйте еще раз');
      } finally {
        setNewTodo('');
      }
    }
  };

  const checkProgress = () => {
    const completedTodos = todoList.filter((todo) => todo.isCompleted);
    return Math.round((completedTodos.length / todoList.length) * 100);
  };

  useEffect(() => {
    setProgress(checkProgress());
  }, [todoList]);

  return (
    <div className={cn('relative w-full h-[450px]', className)} style={{ perspective: 1000 }}>
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front: Tasks */}
        <Card
          className="w-full h-full p-4 flex flex-col gap-6 absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-3 justify-between">
            <p className="text-3xl font-medium">Сегодня</p>
            <div className="flex items-center gap-3">
              <Clock className="text-primary cursor-pointer transition-colors" onClick={() => setIsFlipped(true)} />
            </div>
          </div>
          <Progress value={progress} />
          <div className="flex-1 overflow-auto">
            <Taskslist
              taskData={todoList}
              onDelete={removeTodo}
              toggleTodo={toggleTodo}
            />
          </div>
          <div className="relative w-full mt-auto">
            <Input
              placeholder="Добавить задачу..."
              className="pr-10"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <SendHorizontal
              onClick={addTask}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-primary transition-all hover:bg-secondary duration-100 rounded-sm"
            />
          </div>
        </Card>

        {/* Back: Prayer Times */}
        <Card
          className="w-full h-full p-4 flex flex-col absolute inset-0 backface-hidden shadow-none border-0 bg-transparent"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center gap-3 justify-between px-2 pt-2 pb-2">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold tracking-tight">Время намаза</p>
            </div>
            <div className="flex items-center gap-3">
              <ListTodo className="text-primary cursor-pointer transition-colors" onClick={() => setIsFlipped(false)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pl-2 pr-[2px] -mr-1 custom-scrollbar">
            {!prayerTimes && isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-zinc-500">Загружаем расписание...</p>
              </div>
            ) : !prayerTimes && !user?.location && !browserLocation ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <p className="text-zinc-500 mb-2">Настройте местоположение</p>
              </div>
            ) : prayerTimes ? (
              <PrayerTimesWidget
                prayerTimes={prayerTimes}
                activeTimezone={activeTimezone}
                currentCity={currentCity}
                requestGeolocation={requestGeolocation}
                className="px-2 pb-4"
                compact={true}
              />
            ) : (
              <div className="flex justify-center items-center h-full text-zinc-500">Нет данных</div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

