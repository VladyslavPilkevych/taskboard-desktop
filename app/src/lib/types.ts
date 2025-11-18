export interface Task {
  id: string;
  title: string;
  description?: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}
