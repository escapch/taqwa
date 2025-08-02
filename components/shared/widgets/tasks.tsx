import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Taskslist } from "./tasks-list";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { defaultTasks, ITasks } from "./todo-list";

export const Tasks = ({
  taskData,
  title,
  onClose,
}: {
  taskData: ITasks[];
  title: string;
  onClose: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [todoList, setTodoList] = useState(defaultTasks);

  const { execute: toggleTask } = useFetch("", {
    method: "PATCH",
    auth: true,
    skip: true,
  });

  const checkProgress = () => {
    const completedTodos = taskData.filter((todo: ITasks) => todo.isCompleted);
    return Math.round((completedTodos.length / taskData.length) * 100);
  };

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

  useEffect(() => {
    setTodoList(taskData);
    setProgress(checkProgress());
  }, [taskData]);

  return (
    <Card className={cn("w-full p-3 flex flex-col gap-6 relative")}>
      <div className="flex items-center gap-3 justify-between">
        <p className="text-xl font-medium">{title}</p>
        <X
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onClose}
        />
      </div>
      {taskData ? (
        <>
          <Progress value={progress} />
          <Taskslist taskData={todoList} toggleTodo={toggleTodo} />
        </>
      ) : (
        <p className="text-center text-gray-500">
          У вас нет пропущенных намазов
        </p>
      )}
    </Card>
  );
};
