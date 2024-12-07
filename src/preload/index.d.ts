import { boardsTable, collectionsTable, optionsTable, tasksTable } from "../main/database/types"

declare type IpcFunctions = {
  getTabs: () => boardsTable[],
  getTab: (tabId: string) => boardsTable,
  addTab: (name: string) => boardsTable,
  updateTab: (id: string, name: string) => boardsTable
  deleteTab: (tabId: string) => boardsTable

  getLists: (tabId: string) => collectionsTable[]
  getList: (listId: string) => collectionsTable
  addList: (tabId: string, name: string, color: string) => collectionsTable
  updateList: (id: string, name: string, color: string) => collectionsTable
  deleteList: (listId: string) => collectionsTable

  getTasks: (listId: string) => tasksTable[]
  getTask: (taskId: string) => tasksTable
  addTask: (listId: string, description: string, date: string, name: string) => tasksTable
  updateTask: (taskId: string, description: string, date: string, name: string) => tasksTable
  updateTaskListPosition: (taskId: string, newListId: string | undefined, newPosition: string | undefined) => void
  deleteTask: (taskId: string) => tasksTable

  getBlur: () => optionsTable
  setBlur: (value: string) => optionsTable
  getTheme: () => optionsTable
  setTheme: (value: string) => optionsTable
  getLanguage: () => optionsTable
  setLanguage: (value: string) => optionsTable
  restartApp: () => void
  downloadUpdate: () => void
  getAppVersion: () => string
  printer: (type: "tab" | "list", id: string) => void
  checkUpdate: () => any
  configWindow: () => void

  injectCode: (callback) => void
  pdfLink: (callback) => void
  updateDownloaded: (callback) => void
}

declare type I18n = {
  i18nTranslate: (key: string) => string
  i18nTranslateWithVar: (key: string, variable) => string
  changeLanguage: (lang: string) => string
}

declare global {
  interface Window {
    ipc: IpcFunctions,
    i18n: I18n
  }
}