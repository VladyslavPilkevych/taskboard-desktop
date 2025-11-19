"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTasksBoard } from "@/lib/use-tasks-board";

export default function CreateTaskComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createTask } = useTasksBoard();

  function handleAddTask() {
    if (!title.trim()) return;

    createTask(title.trim(), description.trim());

    setTitle("");
    setDescription("");
  }

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4 shadow-soft space-y-3">
      <h2 className="text-sm font-medium text-foreground">Create a new task</h2>

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
  );
}
