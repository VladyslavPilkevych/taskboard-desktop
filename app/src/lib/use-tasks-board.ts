"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "./types";
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  reorderTasksApi,
} from "./tasks-api";
import {
  applyDeleteTask,
  applyEditTask,
  applyReorder,
  applyToggleStatus,
  createLocalTask,
} from "./board-logic";

const COLUMN_IDS: TaskStatus[] = ["todo", "done"];

export function useTasksBoard() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasksApi,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => createTaskApi(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]) ?? [];

      const optimistic = createLocalTask(
        input.title,
        input.description,
        previous
      );

      queryClient.setQueryData<Task[]>(["tasks"], [...previous, optimistic]);

      return { previous, tempId: optimistic.id };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["tasks"], ctx.previous);
      }
    },
    onSuccess: (created, _vars, ctx) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.filter((t) => t.id !== ctx?.tempId).concat(created)
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: UpdateTaskInput }) =>
      updateTaskApi(payload.id, payload.data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTaskApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]) ?? [];
      const next = applyDeleteTask(previous, id);
      queryClient.setQueryData<Task[]>(["tasks"], next);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["tasks"], ctx.previous);
      }
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (tasks: Task[]) => reorderTasksApi(tasks),
    onSuccess: (updated) => {
      queryClient.setQueryData<Task[]>(["tasks"], updated);
    },
  });

  function createTask(title: string, description: string) {
    createMutation.mutate({ title, description });
  }

  function editTask(id: string, title: string, description: string) {
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      applyEditTask(old, id, title, description)
    );
    updateMutation.mutate({ id, data: { title, description } });
  }

  function toggleTaskCompleted(id: string, completed: boolean) {
    const targetStatus: TaskStatus = completed ? "done" : "todo";

    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      applyToggleStatus(old, id, targetStatus)
    );

    updateMutation.mutate({ id, data: { status: targetStatus } });
  }

  function deleteTask(id: string) {
    deleteMutation.mutate(id);
  }

  function reorderTask(activeId: string, overId: string) {
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) => {
      const next = applyReorder(old, activeId, overId, ["todo", "done"]);
      reorderMutation.mutate(next);
      return next;
    });
  }

  return {
    tasks,
    isLoading,
    isError,
    createTask,
    editTask,
    deleteTask,
    toggleTaskCompleted,
    reorderTask,
  };
}
