import { useEffect, useState } from "react";
import App from "./App";
import { DatabaseService } from "./lib/db/dbClass";
import ErrorBoundary from "./components/ErrorBondary";
import { useLoadingScreen } from "./Hooks/useLoadingScreen";
import "./lib/i18n";
import { t } from "i18next";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";

export function LoadApp() {
  const [dbService, setDbService] = useState<DatabaseService | null>(null);
  const [currentBoard, setCurrentBoard] = useState<number>(1);
  const { showLoading, hideLoading } = useLoadingScreen();

  async function initDatabase() {
    showLoading(t("loading_db"));

    if (dbService !== null) {
      await dbService.close();
    }

    const service = await DatabaseService.create();
    setDbService(service);
    setCurrentBoard(parseInt(await service.getOptionByKey("lastOpenBoard") ?? "1"))

    hideLoading();
  }

  getCurrentWindow().onCloseRequested(async (event) => {
    event.preventDefault();
    await dbService?.updateOption("lastOpenBoard", currentBoard.toString())
    await dbService?.close()
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
