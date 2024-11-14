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
        x: await getPreferredPositionX() ?? undefined,
        y: await getPreferredPositionY() ?? undefined,
        width: await getPreferredWidthResolution() ?? undefined,
        height: await getPreferredHeightResolution() ?? undefined,
        webPreferences: {
            contextIsolation: true,
            sandbox: true,
            webSecurity: true
        }
    })
    mainWindow.setMenu(null)
    mainWindow.removeMenu()

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