import { autoUpdater } from "electron-updater"
// import { isProduction } from "./env"

export function setupAutoUpdater() {
    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdatesAndNotify()
    // if(isProduction) {
    //     autoUpdater.autoDownload = false
    //     autoUpdater.checkForUpdatesAndNotify()
    // }
}