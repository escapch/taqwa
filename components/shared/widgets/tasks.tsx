import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Taskslist } from "./tasks-list";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { defaultTasks, ITasks } from "./todo-list";
import { Skeleton } from "@/components/ui/skeleton";

export const Tasks = ({
  taskData,
  title,
  onClose,
  onUpdate,
}: {
  taskData: ITasks[];
  title: string;
  onClose: () => void;
  onUpdate?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [todoList, setTodoList] = useState(defaultTasks);

  const { execute: toggleTask } = useFetch("", {
    method: "PATCH",
    auth: true,
    skip: true,
  });

  const checkProgress = (todos: ITasks[]) => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter((todo: ITasks) => todo.isCompleted);
    return Math.round((completedTodos.length / todos.length) * 100);
  };

  const toggleTodo = async (id: number) => {
    const updatedTodoList = todoList.map((todo) =>
      todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
    );
    setTodoList(updatedTodoList);
    setProgress(checkProgress(updatedTodoList));

    try {
      await toggleTask(undefined, `/task/${id}/toggle`);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Произошла ошибка, попробуйте еще раз");
      // Rollback
      setTodoList(todoList);
      setProgress(checkProgress(todoList));
    }
  };

  useEffect(() => {
    if (taskData.length > 0) {
      setTodoList(taskData);
      setProgress(checkProgress(taskData));
    } else {
      setTodoList([]);
      setProgress(0);
    }
  }, [taskData]);

  return (
    <Card
      className={cn(
        "w-full p-5 flex flex-col gap-6 relative shadow-2xl border-none",
      )}
    >
      <div className="flex items-center gap-3 justify-between">
        <p className="text-2xl font-semibold tracking-tight">{title}</p>
        <X
          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        />
      </div>
      {taskData && taskData.length > 0 ? (
        <>
          {/* Conditional rendering for progress bar and tasks/skeletons */}
          {todoList.length === 0 ? ( // Check todoList for rendering skeletons
            <div className="space-y-4 py-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                  <span>Прогресс</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Taskslist taskData={todoList} toggleTodo={toggleTodo} />
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">
            У вас нет пропущенных намазов за этот день
          </p>
        </div>
      )}
    </Card>
  );
};
