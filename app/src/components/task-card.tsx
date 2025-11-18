"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description?: string;
  completed: boolean;
  onToggleCompleted: (value: boolean) => void;
  onDelete: () => void;
  onEdit: (data: {
    title: string;
    description: string;
  }) => void;
}

export function TaskCard({
  title,
  description = "",
  completed,
  onToggleCompleted,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

const handleOpenChange = (open: boolean) => {
  setEditOpen(open);
  if (open) {
    setEditTitle(title);
    setEditDescription(description);
  }
};

  function handleSave() {
    const newTitle = editTitle.trim() || title;
    const newDescription = editDescription.trim();
    onEdit({
      title: newTitle,
      description: newDescription,
    });
    setEditOpen(false);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            className="flex flex-1 items-center gap-3 text-left"
            onClick={() => onToggleCompleted(!completed)}
          >
            <Checkbox
              checked={completed}
              onCheckedChange={(v) => onToggleCompleted(!!v)}
            />
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "truncate",
                  completed && "line-through text-muted-foreground"
                )}
              >
                {title}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1">
            <Dialog open={editOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit task"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit task</DialogTitle>
                  <DialogDescription>
                    Change the title or description of this task.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Describe the task..."
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="default" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this task?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently
                    delete this task?
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={onDelete}>
                      Delete
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
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
