import { Task } from './types';

export type TaskFilter = 'all' | 'done' | 'pending';

export function applyTasksFilter(tasks: Task[], filter: TaskFilter, search: string): Task[] {
  const s = search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filter === 'done' && !task.done) return false;
    if (filter === 'pending' && task.done) return false;

    if (!s) return true;

    const inTitle = task.title.toLowerCase().includes(s);
    const inDesc = (task.description ?? '').toLowerCase().includes(s);
    return inTitle || inDesc;
  });
}
