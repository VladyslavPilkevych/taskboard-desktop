import { Task, TaskStatus } from "./types";

export function createLocalTask(
  title: string,
  description: string,
  existing: Task[]
): Task {
  const todoTasks = existing.filter((t) => t.status === "todo");
  const nextOrder =
    todoTasks.length > 0 ? Math.max(...todoTasks.map((t) => t.order)) + 1 : 0;

  return {
    id: `temp-${Date.now()}`,
    title,
    description,
    status: "todo",
    order: nextOrder,
  };
}

export function applyToggleStatus(
  tasks: Task[],
  id: string,
  targetStatus: TaskStatus
): Task[] {
  const task = tasks.find((t) => t.id === id);
  if (!task) return tasks;

  const fromStatus = task.status;
  if (fromStatus === targetStatus) return tasks;

  const moved: Task = { ...task, status: targetStatus };
  const others = tasks.filter((t) => t.id !== id);
  const result = [...others, moved];

  const override = new Map<string, number>();

  (["todo", "done"] as TaskStatus[]).forEach((status) => {
    const col = result
      .filter((t) => t.status === status)
      .sort((a, b) => {
        if (status === targetStatus) {
          if (a.id === id) return -1;
          if (b.id === id) return 1;
        }
        return a.order - b.order;
      });

    col.forEach((t, index) => {
      override.set(t.id, index);
    });
  });

  return result.map((t) => {
    const newOrder = override.get(t.id);
    return newOrder !== undefined ? { ...t, order: newOrder } : t;
  });
}

export function applyEditTask(
  tasks: Task[],
  id: string,
  title: string,
  description: string
): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, title, description } : t));
}

export function applyDeleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function applyReorder(
  tasks: Task[],
  activeId: string,
  targetIdOrColumn: string,
  columnIds: TaskStatus[]
): Task[] {
  const activeTask = tasks.find((t) => t.id === activeId);
  if (!activeTask) return tasks;

  const activeStatus = activeTask.status;

  let targetStatus: TaskStatus | null = null;
  let targetTaskId: string | null = null;

  if (columnIds.includes(targetIdOrColumn as TaskStatus)) {
    targetStatus = targetIdOrColumn as TaskStatus;
  } else {
    const overTask = tasks.find((t) => t.id === targetIdOrColumn);
    if (overTask) {
      targetStatus = overTask.status as TaskStatus;
      targetTaskId = overTask.id;
    }
  }

  if (!targetStatus) return tasks;

  if (targetStatus === activeStatus) {
    const columnTasks = tasks
      .filter((t) => t.status === activeStatus)
      .sort((a, b) => a.order - b.order);

    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    if (oldIndex === -1) return tasks;

    let newIndex = oldIndex;

    if (targetTaskId) {
      const idx = columnTasks.findIndex((t) => t.id === targetTaskId);
      if (idx !== -1) newIndex = idx;
    } else {
      newIndex = columnTasks.length - 1;
    }

    const reordered = arrayMove(columnTasks, oldIndex, newIndex);

    const orderMap = new Map<string, number>();
    reordered.forEach((task, index) => {
      orderMap.set(task.id, index);
    });

    return tasks.map((t) =>
      t.status === activeStatus
        ? { ...t, order: orderMap.get(t.id) ?? t.order }
        : t
    );
  }

  const fromTasks = tasks
    .filter((t) => t.status === activeStatus)
    .sort((a, b) => a.order - b.order);

  const toTasks = tasks
    .filter((t) => t.status === targetStatus)
    .sort((a, b) => a.order - b.order);

  const fromIndex = fromTasks.findIndex((t) => t.id === activeId);
  if (fromIndex === -1) return tasks;

  const [moved] = fromTasks.splice(fromIndex, 1);

  let toIndex: number;
  if (targetTaskId) {
    const idx = toTasks.findIndex((t) => t.id === targetTaskId);
    toIndex = idx === -1 ? toTasks.length : idx;
  } else {
    toIndex = toTasks.length;
  }

  toTasks.splice(toIndex, 0, { ...moved, status: targetStatus });

  const override = new Map<string, { status: TaskStatus; order: number }>();

  fromTasks.forEach((t, index) => {
    override.set(t.id, { status: activeStatus, order: index });
  });

  toTasks.forEach((t, index) => {
    override.set(t.id, { status: targetStatus, order: index });
  });

  return tasks.map((t) => {
    const o = override.get(t.id);
    return o ? { ...t, status: o.status, order: o.order } : t;
  });
}

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const arr = array.slice();
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}
