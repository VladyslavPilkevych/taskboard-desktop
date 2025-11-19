"use client";

import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { SortableTaskCard } from "./task-card-sortable";

type TaskStatus = "todo" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
}

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onToggleCompleted: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; description: string }) => void;
}

export function TaskColumn({
  id,
  title,
  tasks,
  onToggleCompleted,
  onDelete,
  onEdit,
}: ColumnProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-3 shadow-soft min-h-[220px] transition-colors",
        isOver && "ring-2 ring-ring/60"
      )}
    >
      <div className="flex items-center justify-between pb-1">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">
          {sortedTasks.length} task{sortedTasks.length === 1 ? "" : "s"}
        </span>
      </div>

      <SortableContext
        items={sortedTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {sortedTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onToggleCompleted={onToggleCompleted}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
