import { useQuery, useQueryClient } from "@tanstack/react-query";

export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
}

const STORAGE_KEY = "taskboard-tasks";

async function loadInitialTasks(): Promise<Task[]> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: loadInitialTasks,
    staleTime: Infinity,
  });

  const updateTasks = (updater: (prev: Task[]) => Task[]) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old) => {
      const next = updater(old ?? []);

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch(error) {
            console.error(error);
        }
      }

      return next;
    });
  };

  return { tasks, updateTasks };
}
