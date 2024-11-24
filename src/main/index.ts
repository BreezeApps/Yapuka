import dotenv from "dotenv"
dotenv.config()

import path from "node:path"
import { app, BrowserWindow } from "electron"
import { getPreferredPositionX, getPreferredPositionY, getPreferredWidthResolution, getPreferredHeightResolution, setPreferredWidthResolution, setPreferredHeightResolution } from "./database"
import { setupAutoUpdater } from "./updater"

let mainWindow: BrowserWindow | undefined

async function createMainWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, "build/icon.ico"),
        title: "Yapuka",
        x: parseInt(await getPreferredPositionX()) ?? undefined,
        y: parseInt(await getPreferredPositionY()) ?? undefined,
        width: parseInt(await getPreferredWidthResolution()) ?? undefined,
        height: parseInt(await getPreferredHeightResolution()) ?? undefined,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            sandbox: true,
            webSecurity: true
        }
    })
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.setMenu(null)
    mainWindow.removeMenu()
    mainWindow.webContents.openDevTools()

    mainWindow.on("close", async () => {
        const bounds = mainWindow?.getBounds()
        if(bounds) {
            await setPreferredWidthResolution(bounds?.width)
            await setPreferredHeightResolution(bounds?.height)
        }
    })

    setupAutoUpdater()
} 

app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit()
    }
})

app.whenReady().then(createMainWindow)