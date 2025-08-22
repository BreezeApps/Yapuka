import { useEffect, useState } from "react";
import App from "./App";
import { DatabaseService } from "./lib/db/dbClass";
import ErrorBoundary from "./components/ErrorBondary";
import { useLoadingScreen } from "./Hooks/useLoadingScreen";
import "./lib/i18n";
import { t } from "i18next";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import { load } from "@tauri-apps/plugin-store";
import { saveWindowState, restoreState, StateFlags } from "@tauri-apps/plugin-window-state"

export function LoadApp() {
  const [dbService, setDbService] = useState<DatabaseService | null>(null);
  const [currentBoard, setCurrentBoard] = useState<number>(1);
  const { showLoading, hideLoading } = useLoadingScreen();

  async function initDatabase() {
    showLoading(t("loading_db"));
    restoreState("", StateFlags.ALL)

    if (dbService !== null) {
      await dbService.close();
    }

    const service = await DatabaseService.create();
    setDbService(service);
    const config = await load("config.json")
    setCurrentBoard(parseInt(await config.get("lastOpenBoard") ?? "1"))

    hideLoading();
  }

  getCurrentWindow().onCloseRequested(async () => {
    const config = await load("config.json", { autoSave: true, defaults: { dbFolder: "", lastOpenBoard: "1" } })
    await config.set("lastOpenBoard", currentBoard.toString())
    await config.save()
    await config.close()
    saveWindowState(StateFlags.ALL);
    await dbService?.close()
    /* event.preventDefault(); */
    exit()
  });

  useEffect(() => {
    initDatabase();
  }, []);

  if (!dbService) {
    return null;
  }

  return (
    <ErrorBoundary>
      <App dbService={dbService} reloadDb={initDatabase} currentBoard={currentBoard} setCurrentBoard={setCurrentBoard} />
    </ErrorBoundary>
  );
}
