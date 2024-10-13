const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addList: (listName, color) => ipcRenderer.invoke('add-list', listName, color),
  deleteList: (listId) => ipcRenderer.invoke('delete-list', listId),
  addTask: (listId, taskName, taskDescription, dueDate) => ipcRenderer.invoke('add-task', listId, taskName, taskDescription, dueDate),
  updateTaskOrder: (taskId, newListId, newPosition) => ipcRenderer.invoke('update-task-order', taskId, newListId, newPosition),
});