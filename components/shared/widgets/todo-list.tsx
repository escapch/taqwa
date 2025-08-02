"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Delete, SendHorizontal } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Taskslist } from "./tasks-list";

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
  { _id: 1, title: "Фаджр", isCompleted: false, type: "fard" },
  { _id: 2, title: "Зухр", isCompleted: false, type: "fard" },
  { _id: 3, title: "Аср", isCompleted: false, type: "fard" },
  { _id: 4, title: "Магриб", isCompleted: false, type: "fard" },
  { _id: 5, title: "Иша", isCompleted: false, type: "fard" },
];

export const TodoList: React.FC<Props> = ({ className }) => {
  const [todoList, setTodoList] = useState(defaultTasks);
  const [newTodo, setNewTodo] = useState("");
  const [progress, setProgress] = useState(0);
  const { isAuthenticated } = useAuth();
  const { execute, data } = useFetch<ITasks[]>("/task/today", {
    method: "GET",
    auth: true,
    skip: true,
  });
  const { execute: toggleTask } = useFetch("", {
    method: "PATCH",
    auth: true,
    skip: true,
  });
  const { execute: deleteTask } = useFetch("", {
    method: "DELETE",
    auth: true,
    skip: true,
  });
  const { execute: addCustomTask } = useFetch("/task/custom", {
    method: "POST",
    auth: true,
    skip: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      execute();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (data) {
      setTodoList(data);
    }
  }, [data]);

  const toggleTodo = async (id: number) => {
    const updatedTodoList = todoList.map((todo) =>
      todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodoList(updatedTodoList);
    try {
      await toggleTask(undefined, `/task/${id}/toggle`);
    } catch (err) {
      toast.error("Произошла ошибка, попробуйте еще раз");
    }
  };

  const removeTodo = async (id: number) => {
    setTodoList((prev) => prev.filter((todo) => todo._id !== id));
    try {
      await deleteTask(undefined, `/task/${id}`);
      await execute();
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте еще раз");
    }
  };

  const addTask = async () => {
    if (newTodo.trim() && newTodo) {
      try {
        await addCustomTask({ title: newTodo });
        await execute();
      } catch (err) {
        toast.error("Произошла ошибка, попробуйте еще раз");
      } finally {
        setNewTodo("");
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
    <>
      <Card
        className={cn("w-full p-3 flex flex-col gap-6 relative", className)}
      >
        <div className="flex items-center gap-3 justify-between">
          <p className="text-3xl font-medium">Сегодня</p>
          <ChevronRight className="text-primary cursor-pointer" />
        </div>
        <Progress value={progress} />
        <Taskslist
          taskData={todoList}
          onDelete={removeTodo}
          toggleTodo={toggleTodo}
        />
        <div className="relative w-full">
          <Input
            placeholder="Добавить задачу..."
            className="pr-10"
            onChange={(e) => setNewTodo(e.target.value)}
            value={newTodo}
          />
          <SendHorizontal
            onClick={addTask}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer  text-primary transition-all hover:bg-secondary duration-100 rounded-xs"
          />
        </div>
      </Card>
    </>
  );
};
