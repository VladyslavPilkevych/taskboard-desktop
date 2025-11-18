'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { Task } from './types';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get<Task[]>('/tasks');
      return res.data;
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      api.post('/tasks', data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (arg: { id: string; data: Partial<Task> }) =>
      api.patch(`/tasks/${arg.id}`, arg.data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
