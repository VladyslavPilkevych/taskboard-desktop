'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { TaskCard } from '@/components/task-card'

type TaskStatus = 'todo' | 'done'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  order: number
}

interface SortableTaskCardProps {
  task: Task
  onToggleCompleted: (id: string, value: boolean) => void
  onDelete: (id: string) => void
  onEdit: (id: string, data: { title: string; description: string }) => void
}

export function SortableTaskCard({
  task,
  onToggleCompleted,
  onDelete,
  onEdit,
}: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      status: task.status,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        title={task.title}
        description={task.description}
        completed={task.status === 'done'}
        onToggleCompleted={(value) => onToggleCompleted(task.id, value)}
        onDelete={() => onDelete(task.id)}
        onEdit={(data) => onEdit(task.id, data)}
      />
    </div>
  )
}
