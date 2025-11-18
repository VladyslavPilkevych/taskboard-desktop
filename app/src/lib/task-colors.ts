export type TaskColorId = "leaf" | "moss" | "lime" | "sand";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export const TASK_COLOR_ORDER: TaskColorId[] = ["leaf", "moss", "lime", "sand"];

export const DEFAULT_TASK_COLOR: TaskColorId = "leaf";
export const DEFAULT_TASK_PRIORITY: TaskPriority = "medium";

export const TASK_COLOR_STYLES: Record<
  TaskColorId,
  {
    label: string;
    dotClass: string;
    cardClass: string;
  }
> = {
  leaf: {
    label: "Leaf",
    dotClass: "bg-task-leaf",
    cardClass: "bg-task-leaf/20",
  },
  moss: {
    label: "Moss",
    dotClass: "bg-task-moss",
    cardClass: "bg-task-moss/20",
  },
  lime: {
    label: "Lime",
    dotClass: "bg-task-lime",
    cardClass: "bg-task-lime/20",
  },
  sand: {
    label: "Sand",
    dotClass: "bg-task-sand",
    cardClass: "bg-task-sand/30",
  },
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_COLOR_MAP: Record<TaskPriority, TaskColorId> = {
  low: "sand",
  medium: "moss",
  high: "leaf",
  critical: "lime",
};
