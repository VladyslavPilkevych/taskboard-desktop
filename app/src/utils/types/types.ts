export type TaskStatus = "todo" | "done";

export type ApiTask = {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'done';
  order: number;
  createdAt: string;
  updatedAt: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order?: number;
}
