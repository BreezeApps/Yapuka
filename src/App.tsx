import { useTranslation } from "react-i18next";

import "./App.css";
import { ConfigPage } from "./components/ConfigPage";
import { useEffect, useState } from "react";
import { ListContainer } from "./components/ListContainer";
import { ModalForm } from "./components/Modal/ModalForm";
import { DatabaseService } from "./lib/dbClass";
import { setupOptions } from "./lib/setupOptions";
import ErrorBoundary from "./components/ErrorBondary";
import { checkForAppUpdates } from "./lib/checkForUpdate";

function App() {
  const dbService = new DatabaseService()
  const { t } = useTranslation();
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [currentBoard, setCurrentBoard] = useState<number>(1);
  const [reloadList, setReloadList] = useState<boolean>(false);
  const [firstReload, setFirstReload] = useState<boolean>(true);
  const [allBoards, setAllBoards] = useState<{ id: number, name: string }[]>([{ id: 0, name: "test"}]);

  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const handleCreateBoard = async (name: string) => {
    const newBoardId = await dbService.createBoard(name);
    console.log("Board créé avec ID:", newBoardId);
    setReloadList(true);
  };

  const handleCreateCollection = async (
    name: string,
    description?: string,
    date?: string,
    color?: string
  ) => {
    date = date
    description = description;
    const newCollectionId = await dbService.createCollection(
      currentBoard,
      name,
      color
    );
    console.log("Collection créée avec ID:", newCollectionId);
    setReloadList(true);
  };

  useEffect(() => {
    checkForAppUpdates(true);
}, []);

  useEffect(() => {
    const initBoards = async () => {
      setAllBoards(await dbService.getAllBoards())
    }
    initBoards()
  }, [reloadList])

  // const handleCreateTask = async (name: string, description: string) => {
  //   const newTaskId = await dbService.createTask(1, name, description); // Remplace 1 par l'ID de la collection
  //   console.log("Tâche créée avec ID:", newTaskId);
  // };

  // localStorage.theme = "light";
  // localStorage.theme = "dark";

  if (firstReload === true) {
    setTimeout(() => {
      setReloadList(true);
      setupOptions()
      setFirstReload(false);
    }, 500);
  }

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900">
      <ErrorBoundary>
        <ConfigPage show={showConfig} setShow={setShowConfig} />
      </ErrorBoundary>
      <h1 className="text-gray-900 dark:text-white">{t("Language_Name")}</h1>
      <div
        id="notification"
        className="hidden bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow-lg"
      >
        <p id="message"></p>
        <button
          id="close-button"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          {t("Close")}
        </button>
        <button
          id="download-button"
          className="hidden rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          {t("update_btn_download")}
        </button>
        <button
          id="restart-button"
          className="hidden rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          {t("update_btn_restart")}
        </button>
      </div>
      <div
        id="context-menu"
        className="absolute z-[100] hidden border bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow-md"
      >
        <button
          id="edit-button"
          className="w-full px-4 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          Modifier
        </button>
      </div>
      <div className="fixed left-0 top-0 flex w-full justify-between py-4 text-center shadow-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div id="tabs"></div>
        <select
          onChange={(e) => {setCurrentBoard(parseInt(e.target.value)); setReloadList(true)}}
          defaultValue={currentBoard}
          className="bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer dark:text-white"
        >
          {allBoards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
        <ModalForm type="board" onCreate={handleCreateBoard} />
        <ModalForm type="collection" onCreate={handleCreateCollection} />
        {/* <button
          id="modify-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
        >
          {t("Modify_a_Tab")}
        </button>
        <button
          id="delete-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
        >
          {t("Delete_a_Tab")}
        </button> */}
        {/* <button
          id="print-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
        >
          {t("Print")}
        </button> */}
        <span
          onClick={() => {
            setShowConfig(true);
          }}
          className="flex h-7 w-7 cursor-pointer flex-row-reverse justify-self-end"
        >
          <img src="/icons/config.svg" alt="" className="dark:invert" />
        </span>
      </div>
      <div
        id="lists-container"
        className="mt-16 w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <ListContainer
          boardId={currentBoard}
          reloadList={reloadList}
          setReloadList={setReloadList}
          currentBoard={currentBoard}
        />
      </div>
      <img
        src="/CC BY-NC-SA.png"
        alt="Creative Commons BY-NC-SA"
        className="absolute bottom-0 right-0 z-50"
        width="100"
      />
    </div>
  );
}

export default App;

