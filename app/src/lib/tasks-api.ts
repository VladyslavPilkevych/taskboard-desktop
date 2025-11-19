import { ApiTask, CreateTaskInput, Task, UpdateTaskInput } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function mapApiTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTasksApi(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const apiTasks = (await handleJson<ApiTask[]>(res)) ?? [];
  return apiTasks.map((t) => mapApiTask(t));
}

export async function createTaskApi(input: CreateTaskInput): Promise<Task> {
  const body: Partial<Task> = {
    title: input.title,
    description: input.description ?? "",
    status: "todo",
  };

  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const apiTask = await handleJson<ApiTask>(res);
  return mapApiTask(apiTask);
}

export async function updateTaskApi(
  id: string,
  data: UpdateTaskInput
): Promise<Task> {
  const patchBody: Partial<Task> = {}; // todo

  if (data.title !== undefined) patchBody.title = data.title;
  if (data.description !== undefined) patchBody.description = data.description;
  if (data.status !== undefined) patchBody.status = data.status;
  if (data.order !== undefined) patchBody.order = data.order;

  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patchBody),
  });

  const apiTask = await handleJson<ApiTask>(res);
  return mapApiTask(apiTask);
}

export async function deleteTaskApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to delete task`);
  }
}

export async function reorderTasksApi(tasks: Task[]): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tasks: tasks.map((t) => ({
        id: t.id,
        status: t.status,
        order: t.order,
      })),
    }),
  });

  const apiTasks = await handleJson<ApiTask[]>(res);
  return apiTasks.map(mapApiTask);
}
