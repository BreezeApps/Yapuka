import { useEffect, useState } from "react";
import App from "./App";
import { DatabaseService } from "./lib/db/dbClass";
import ErrorBoundary from "./components/ErrorBondary";
import { useLoadingScreen } from "./Hooks/useLoadingScreen";

export function LoadApp() {
  const [dbService, setDbService] = useState<DatabaseService | null>(null);
  const { showLoading, hideLoading } = useLoadingScreen();

  async function initDatabase() {
    showLoading("Chargement de la base Yapuka...");

    if (dbService !== null) {
      await dbService.close()
    }

    const service = await DatabaseService.create();
    setDbService(service);

    hideLoading();
  }

  useEffect(() => {
    initDatabase();
  }, []);

  if (!dbService) {
    return null;
  }

  return (
    <ErrorBoundary>
      <App dbService={dbService} reloadDb={initDatabase} />
    </ErrorBoundary>
  );
}
