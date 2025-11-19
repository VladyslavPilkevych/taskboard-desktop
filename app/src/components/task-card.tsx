"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/lib/cn";
import { TaskDialogEdit } from "@/components/task-dialog-edit";
import { TaskDialogDelete } from "@/components/task-dialog-delete";

interface TaskCardProps {
  title: string;
  description?: string;
  completed: boolean;
  onToggleCompleted: (value: boolean) => void;
  onDelete: () => void;
  onEdit: (data: { title: string; description: string }) => void;
}

export function TaskCard({
  title,
  description = "",
  completed,
  onToggleCompleted,
  onDelete,
  onEdit,
}: TaskCardProps) {
  return (
    <Card className="flex flex-col border border-border bg-card shadow-soft transition-colors duration-300">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex flex-1 items-center gap-3 text-left cursor-pointer"
            onClick={() => onToggleCompleted(!completed)}
          >
            <Checkbox
              checked={completed}
              onCheckedChange={(v) => onToggleCompleted(!!v)}
            />
            <CardTitle className="flex flex-col gap-1">
              <span
                className={cn(
                  "truncate",
                  completed && "line-through text-muted-foreground"
                )}
              >
                {title}
              </span>
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <TaskDialogEdit
              title={title}
              description={description}
              completed={completed}
              onToggleCompleted={onToggleCompleted}
              onEdit={onEdit}
            />
            <TaskDialogDelete onDelete={onDelete} />
          </div>
        </div>
      </CardHeader>

      {description && description.trim().length > 0 && (
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {description}
          </p>
        </CardContent>
      )}

      <CardFooter className="justify-end text-xs text-muted-foreground">
        {completed ? "Completed" : "Pending"}
      </CardFooter>
    </Card>
  );
}
