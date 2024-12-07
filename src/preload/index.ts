import { contextBridge, ipcRenderer } from 'electron'
import { Boards, Collection, Tasks } from '../main/database/types'

// // Use `contextBridge` APIs to expose Electron APIs to
// // renderer only if context isolation is enabled, otherwise
// // just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   // @ts-ignore (define in dts)
//   window.electron = electronAPI
//   // @ts-ignore (define in dts)
//   window.api = api
// }

if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('i18n', {
        i18nTranslate: (key: string) => ipcRenderer.invoke("i18n-translate", key),
        i18nTranslateWithVar: (key: string, variable) => ipcRenderer.invoke("i18n-translate-with-var", key, variable),
        changeLanguage: (lang: string) => ipcRenderer.invoke("change-language", lang)
    })
    contextBridge.exposeInMainWorld('ipc', {
        getTabs: async () => ipcRenderer.invoke("get-tabs"),
        getTab: async (tabId: string) => ipcRenderer.invoke("get-tab", tabId),
        addTab: async (tab: Boards) => ipcRenderer.invoke("add-tab", tab),
        updateTab: async (tab: Boards) => ipcRenderer.invoke("update-tab", tab),
        deleteTab: async (tabId: string) => ipcRenderer.invoke("delete-tab", tabId),

        getLists: async (tabId: string) => ipcRenderer.invoke("get-lists", tabId),
        getList: async (listId: string) => ipcRenderer.invoke("get-list", listId),
        addList: async (list: Collection) => ipcRenderer.invoke("add-list", list),
        updateList: async (list: Collection) => ipcRenderer.invoke("update-list", list),
        deleteList: async (listId: string) => ipcRenderer.invoke("delete-list", listId),
        
        getTasks: async (listId: string) => ipcRenderer.invoke("get-tasks", listId),
        getTask: async (taskId: string) => ipcRenderer.invoke("get-task", taskId),
        addTask: async (task: Tasks) => ipcRenderer.invoke("add-task", task),
        updateTask: async (task: Tasks) => ipcRenderer.invoke("update-task", task),
        updateTaskListPosition: async (taskId: string, newListId: string | undefined, newPosition: string | undefined) => ipcRenderer.invoke("update-task-list-position", taskId, newListId, newPosition),
        deleteTask: async (taskId: string) => ipcRenderer.invoke("delete-task", taskId),

        getBlur: async () => ipcRenderer.invoke("get-option", "blur"),
        setBlur: async (value: string) => ipcRenderer.invoke("set-option", "blur", value),
        getTheme: async () => ipcRenderer.invoke("get-option", "theme"),
        setTheme: async (value: string) => ipcRenderer.invoke("set-option", "theme", value),
        getLanguage: async () => ipcRenderer.invoke("get-option", "language"),
        setLanguage: async (value: string) => ipcRenderer.invoke("set-option", "language", value),
        restartApp: () => ipcRenderer.invoke("restart_app"),
        downloadUpdate: () => ipcRenderer.invoke("download_update"),
        getAppVersion: async () => ipcRenderer.invoke("app_version"),
        printer: (type: "tab" | "list", id: string) => ipcRenderer.invoke("printer", type, id),
        checkUpdate: async () => ipcRenderer.invoke("check-update"),
        configWindow: async () => ipcRenderer.invoke("config-window"),

        injectCode: (callback) => ipcRenderer.on('inject-code', (_event, code) => callback(code)),
        pdfLink: (callback) => ipcRenderer.on("pdfLink", (_event, link, name) => callback(link, name)),
        updateDownloaded: (callback) => ipcRenderer.on("update_downloaded", (_event) => callback()),
    })
}