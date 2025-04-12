import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Delete, X } from "lucide-react";

export const Tasks = ({
  taskData,
  title,
  progress,
  onClose,
  onToggleTask,
}: {
  taskData: any;
  title: string;
  progress: number;
  onClose: () => void;
  onToggleTask: (taskId: number) => void;
}) => {
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
          <ul className={`space-y-2 px-3 max-h-[250px] overflow-auto `}>
            {taskData.map((todo: any) => (
              <li key={todo.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="mr-2"
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => onToggleTask(todo.id)}
                    value={todo.value}
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
                    // onClick={() => removeTodo(todo.id)}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-gray-500">
          У вас нет пропущенных намазов
        </p>
      )}
    </Card>
  );
};
