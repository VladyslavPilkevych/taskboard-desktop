"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";
import { Search, Filter, PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type FilterType = "all" | "active" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  function handleAddTask() {
    if (!title.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      },
    ]);

    setTitle("");
    setDescription("");
  }

  function handleEditTask(
    id: string,
    data: { title: string; description: string }
  ) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: data.title,
              description: data.description,
            }
          : task
      )
    );
  }

  function handleToggleCompleted(id: string, value: boolean) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: value } : task
      )
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search.trim() ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? !task.completed
          : task.completed;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

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
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("completed")}
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

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:flex-1"
            />
          </div>

          <Textarea
            placeholder="Task description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end">
            <Button variant="default" size="lg" onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              onEdit={(data) => handleEditTask(task.id, data)}
              onToggleCompleted={(value) =>
                handleToggleCompleted(task.id, value)
              }
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}

          {visibleTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tasks found. Try changing filters or creating a new task.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
