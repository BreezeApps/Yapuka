type Task = {
  id: number;
  collection_id: number;
  task_order: number;
  names: string | null;
  descriptions: string | null;
  status: "pending" | "done";
  due_date: string | null;
};

export type { Task }