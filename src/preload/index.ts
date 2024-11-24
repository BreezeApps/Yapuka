import { contextBridge } from "electron"
import path from 'path';
import { fileURLToPath } from 'url';

contextBridge.exposeInMainWorld("process.version", {
    
})

// contextBridge.exposeInMainWorld("__dirname", {

//     const __filename = fileURLToPath(import.meta.url);

//     const __dirname = path.dirname(__filename);

// })