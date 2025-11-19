"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  rectIntersection,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Filter, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTasksBoard } from "@/lib/use-tasks-board";

type TaskStatus = "todo" | "done";
type ViewFilter = "all" | "active" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
}

interface SortableTaskCardProps {
  task: Task;
  onToggleCompleted: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; description: string }) => void;
}

function SortableTaskCard({
  task,
  onToggleCompleted,
  onDelete,
  onEdit,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      status: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        title={task.title}
        description={task.description}
        completed={task.status === "done"}
        onToggleCompleted={(value) => onToggleCompleted(task.id, value)}
        onDelete={() => onDelete(task.id)}
        onEdit={(data) => onEdit(task.id, data)}
      />
    </div>
  );
}

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onToggleCompleted: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; description: string }) => void;
}

function TaskColumn({
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

export default function HomePage() {
  // const { tasks, updateTasks } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const {
    tasks,
    // isLoading, // TODO
    // isError, // TODO
    createTask,
    editTask,
    deleteTask,
    toggleTaskCompleted,
    reorderTask,
  } = useTasksBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search.trim() ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;
      if (viewFilter === "active") {
        matchesFilter = task.status === "todo";
      } else if (viewFilter === "completed") {
        matchesFilter = task.status === "done";
      }

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, viewFilter]);

  const todoTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === "todo"),
    [filteredTasks]
  );

  const doneTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === "done"),
    [filteredTasks]
  );

  function handleAddTask() {
    if (!title.trim()) return;

    createTask(title.trim(), description.trim());

    setTitle("");
    setDescription("");
  }

  function handleToggleCompleted(id: string, value: boolean) {
    toggleTaskCompleted(id, value);
  }

  function handleDeleteTask(id: string) {
    deleteTask(id);
  }

  function handleEditTask(
    id: string,
    data: { title: string; description: string }
  ) {
    editTask(id, data.title, data.description);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeId = String(active.id);

    setActiveTask((prev) => {
      const task = tasks.find((t) => t.id === activeId);
      return task ?? prev;
    });
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    reorderTask(String(active.id), String(over.id));
  }

  const showTodo = viewFilter === "all" || viewFilter === "active";
  const showDone = viewFilter === "all" || viewFilter === "completed";

  return (
    <main className="min-h-screen bg-background px-4 py-8 transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Taskboard</h1>
            <p className="text-sm text-muted-foreground">
              Organize your tasks, filter them, and stay focused.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" />
              View:
            </span>
            <div className="flex gap-1 rounded-full bg-card px-1 py-1 border border-border">
              <Button
                variant={viewFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFilter("all")}
              >
                All
              </Button>
              <Button
                variant={viewFilter === "active" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={viewFilter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/60 p-4 shadow-soft space-y-3">
          <h2 className="text-sm font-medium text-foreground">
            Create a new task
          </h2>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="default" size="lg" onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>
        </section>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <AnimatePresence initial={false}>
            <motion.section
              layout
              className={cn(
                "grid gap-4",
                showTodo && showDone ? "md:grid-cols-2" : "md:grid-cols-1"
              )}
            >
              {showTodo && (
                <motion.div
                  key="todo-column"
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <TaskColumn
                    id="todo"
                    title="To do"
                    tasks={todoTasks}
                    onToggleCompleted={handleToggleCompleted}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                </motion.div>
              )}

              {showDone && (
                <motion.div
                  key="done-column"
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <TaskColumn
                    id="done"
                    title="Done"
                    tasks={doneTasks}
                    onToggleCompleted={handleToggleCompleted}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                </motion.div>
              )}
            </motion.section>
          </AnimatePresence>

          <DragOverlay>
            {activeTask ? (
              <div className="w-full max-w-md">
                <TaskCard
                  title={activeTask.title}
                  description={activeTask.description}
                  completed={activeTask.status === "done"}
                  onToggleCompleted={() => {}}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
