"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Delete, SendHorizontal } from "lucide-react";
import useAuthStore from "@/hooks/useAuth"; // Кастомный хук для проверки авторизации
import { useModal } from "@/hooks/useModal"; // Zustand для управления модалкой
import { Button } from "@/components/ui/button";
import { AuthComponent } from "../auth-component";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Props {
  className?: string;
}

const initialTodoList = [
  { id: 1, title: "Фаджр", completed: true, must: true },
  { id: 2, title: "Зухр", completed: true, must: true },
  { id: 3, title: "Аср", completed: false, must: true },
  { id: 4, title: "Магриб", completed: false, must: true },
  { id: 5, title: "Иша", completed: false, must: true },
];

export const TodoList: React.FC<Props> = ({ className }) => {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [newTodo, setNewTodo] = useState("");
  const [progress, setProgress] = useState(0);
  const { user } = useAuthStore();
  const { openModal, isOpen } = useModal();

  const toggleTodo = (id: number) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = () => {
    setNewTodo("");
    setTodoList((prev) => [
      ...prev,
      { id: prev.length + 1, title: newTodo, completed: false, must: false },
    ]);
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
      {!user && (
        <div
          className={`absolute bottom-60 inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 ${
            isOpen ? "hidden" : ""
          }`}
        >
          <Button onClick={() => openModal()}>Войти/Зарегистрироваться</Button>
        </div>
      )}
      <Card
        className={cn(
          "w-full p-3 flex flex-col gap-6 relative",
          className,
          !user && "opacity-50 blur-sm"
        )}
      >
        <div className="flex items-center gap-3 justify-between">
          <p className="text-3xl font-medium">Сегодня</p>
          <ChevronRight className="text-primary cursor-pointer" />
        </div>
        <Progress value={progress} />
        <ul
          // className={`space-y-2 px-3 max-h-[250px] overflow-auto ${!user} ? opacity-50 blur-sm : ''`}
          className={`space-y-2 px-3 max-h-[250px] overflow-auto `}
        >
          {todoList.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="mr-2"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={cn(
                    todo.completed ? "line-through" : "",
                    "cursor-pointer"
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
        {user && <Button onClick={() => signOut(auth)}>logout</Button>}
      </Card>
      {isOpen && <AuthComponent />}
    </>
  );
};
