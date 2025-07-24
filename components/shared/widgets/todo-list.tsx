'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Delete, SendHorizontal } from 'lucide-react';
import useAuthStore from '@/hooks/useAuth'; // Кастомный хук для проверки авторизации
import { useModal } from '@/hooks/useModal'; // Zustand для управления модалкой
import { Button } from '@/components/ui/button';
import { AuthComponent } from '../auth-component';
import { AuthGuard } from './auth-guard';

interface Props {
  className?: string;
}

const defaultTasks = [
  { id: 1, title: 'Фаджр', completed: false, must: true, value: 'fajr' },
  { id: 2, title: 'Зухр', completed: false, must: true, value: 'dhuhr' },
  { id: 3, title: 'Аср', completed: false, must: true, value: 'asr' },
  { id: 4, title: 'Магриб', completed: false, must: true, value: 'maghrib' },
  { id: 5, title: 'Иша', completed: false, must: true, value: 'isha' },
];

export const TodoList: React.FC<Props> = ({ className }) => {
  const [todoList, setTodoList] = useState(defaultTasks);
  const [newTodo, setNewTodo] = useState('');
  const [progress, setProgress] = useState(0);
  const { openModal, isOpen } = useModal();

  const toggleTodo = async (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    setTodoList(updatedTodoList);
  };

  const addTodo = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      id: todoList.length + 1,
      title: newTodo,
      completed: false,
      must: false,
      value: newTodo,
    };
    setTodoList((prev) => [...prev, newTask]);
    setNewTodo('');
  };

  const removeTodo = (id: number) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const checkProgress = () => {
    const completedTodos = todoList.filter((todo) => todo.completed);
    return Math.round((completedTodos.length / todoList.length) * 100);
  };

  useEffect(() => {
    setProgress(checkProgress());
  }, [todoList]);

  return (
    <>
      {<AuthGuard isAuthenticated={false} onLoginClick={openModal} />}
      <Card
        className={cn('w-full p-3 flex flex-col gap-6 relative', className)}
      >
        <div className="flex items-center gap-3 justify-between">
          <p className="text-3xl font-medium">Сегодня</p>
          <ChevronRight className="text-primary cursor-pointer" />
        </div>
        <Progress value={progress} />
        <ul className={`space-y-5 px-3 max-h-[250px] overflow-auto `}>
          {todoList.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="mr-2 h-6 w-6"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  value={todo.value}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={cn(
                    todo.completed ? 'line-through' : '',
                    'cursor-pointer text-lg',
                  )}
                >
                  {todo.title}
                </label>
              </div>
              {!todo.must && (
                <Delete
                  className="cursor-pointer text-red-500"
                  onClick={() => removeTodo(todo.id)}
                />
              )}
            </li>
          ))}
        </ul>
        <div className="relative w-full">
          <Input
            placeholder="Добавить задачу..."
            className="pr-10"
            onChange={(e) => setNewTodo(e.target.value)}
            value={newTodo}
          />
          <SendHorizontal
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer  text-primary transition-all hover:bg-secondary duration-100 rounded-xs"
            onClick={() => addTodo()}
          />
        </div>
        {/* {user && <Button onClick={() => signOut(auth)}>logout</Button>} */}
      </Card>
      {isOpen && <AuthComponent />}
    </>
  );
};
