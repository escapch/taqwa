import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ITasks } from "./todo-list";
import { Delete } from "lucide-react";

export const Taskslist = ({
  taskData,
  toggleTodo,
  onDelete,
}: {
  taskData: ITasks[];
  toggleTodo: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}) => {
  return (
    <ul className={`space-y-5 px-3 max-h-[250px] overflow-auto `}>
      {taskData.map((todo: ITasks) => (
        <li key={todo._id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              className="mr-2 h-6 w-6"
              id={`todo-${todo._id}`}
              checked={todo.isCompleted}
              onCheckedChange={() => toggleTodo(todo._id)}
              value={todo.title}
            />
            <label
              htmlFor={`todo-${todo._id}`}
              className={cn(
                todo.isCompleted ? "line-through" : "",
                "cursor-pointer text-lg"
              )}
            >
              {todo.title}
            </label>
          </div>
          {onDelete && todo.type !== "fard" && (
            <Delete
              className="cursor-pointer text-red-500"
              onClick={() => onDelete(todo._id)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
