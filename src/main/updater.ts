import { autoUpdater } from "electron-updater"
import { isProduction } from "./env"

export function setupAutoUpdater() {
    if(isProduction) {
        autoUpdater.autoDownload = false
        autoUpdater.checkForUpdatesAndNotify()
    }
}