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
  DragOverlay,
} from "@dnd-kit/core";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTasksBoard } from "@/lib/use-tasks-board";
import { TaskColumn } from "@/components/task-column";
import CreateTaskComponent from "@/components/create-task-component";

type TaskStatus = "todo" | "done";
type ViewFilter = "all" | "active" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const {
    tasks,
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

        <CreateTaskComponent />

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
