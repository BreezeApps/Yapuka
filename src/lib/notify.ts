import { sendNotification } from "@tauri-apps/plugin-notification";
import { Task } from "./types/Task";

export const notifyTaskLate = (taskName: string) => {
  sendNotification({
    title: "⏰ Tâche en retard",
    body: `"${taskName}" est dépassée !`,
  });
};

export const notifyTaskReminder = (taskName: string) => {
  sendNotification({
    title: "📝 Rappel",
    body: `"${taskName}" commence dans 5 minutes.`,
  });
};

export const startTaskMonitoring = (tasks: Task[]) => {
  tasks.forEach((task) => {
    if (task.status !== "pending") return;

    const now = Date.now();
    const due = task.due_date === null ? new Date().getTime() : task.due_date.getTime()

    // 🔔 Rappel 5 min avant
    const reminderTime = due - 10 * 60 * 1000;
    if (reminderTime > now) {
      setTimeout(
        () => notifyTaskReminder(task.names === null ? "" : task.names),
        reminderTime - now
      );
    }

    // 🚨 Vérifie si la tâche est en retard
    if (due > now) {
      setTimeout(
        () => notifyTaskLate(task.names === null ? "" : task.names),
        due - now
      );
    } else {
      // Si déjà en retard au démarrage
      notifyTaskLate(task.names === null ? "" : task.names);
    }
  });
  setInterval(() => {
    const now = Date.now();
    tasks.forEach((task) => {
      const due = new Date(
        task.due_date === null ? "" : task.due_date
      ).getTime();
      if (task.status === "pending" && due < now) {
        notifyTaskLate(task.names === null ? "" : task.names);
      }
    });
  }, 10 * 60 * 1000);
};
