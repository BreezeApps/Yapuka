import { ipcMain } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
// import { isProduction } from "./env"

export function setupAutoUpdater() {
    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdatesAndNotify()
    // if(isProduction) {
    //     autoUpdater.autoDownload = false
    //     autoUpdater.checkForUpdatesAndNotify()
    // }
}

ipcMain.handle("restart_app", (_event) => {
    autoUpdater.quitAndInstall();
});

ipcMain.handle("check-update", (_event) => {
    autoUpdater.autoDownload = false;
    const check = autoUpdater.checkForUpdates();
    return check;
});