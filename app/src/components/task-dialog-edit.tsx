'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface TaskDialogEditProps {
  title: string
  description: string
  completed: boolean
  onToggleCompleted: (value: boolean) => void
  onEdit: (data: { title: string; description: string }) => void
}

export function TaskDialogEdit({
  title,
  description,
  completed,
  onToggleCompleted,
  onEdit,
}: TaskDialogEditProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editCompleted, setEditCompleted] = useState(completed)

  const handleOpenChange = (open: boolean) => {
    setEditOpen(open)
    if (open) {
      setEditTitle(title)
      setEditDescription(description)
      setEditCompleted(completed)
    }
  }

  const handleSave = () => {
    const newTitle = editTitle.trim() || title
    const newDescription = editDescription.trim()

    onEdit({ title: newTitle, description: newDescription })

    if (editCompleted !== completed) {
      onToggleCompleted(editCompleted)
    }

    setEditOpen(false)
  }

  return (
    <Dialog open={editOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit task">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Update the title, description, or status of this task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Describe the task..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="edit-completed"
              checked={editCompleted}
              onCheckedChange={(v) => setEditCompleted(!!v)}
            />
            <label
              htmlFor="edit-completed"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Mark as completed
            </label>
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
  )
}
