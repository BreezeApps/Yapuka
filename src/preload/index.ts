import { contextBridge } from "electron"

contextBridge.exposeInMainWorld("process.version", {
    
})