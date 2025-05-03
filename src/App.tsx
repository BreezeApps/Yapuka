import "./App.css";
import { ConfigPage } from "./components/ConfigPage";
import React, { useEffect, useState } from "react";
import { ListContainer } from "./components/ListContainer";
import { ModalForm } from "./components/Modal/ModalForm";
import { DatabaseService } from "./lib/dbClass";
import { setupOptions } from "./lib/setupOptions";
import ErrorBoundary from "./components/ErrorBondary";
import { checkForAppUpdates } from "./lib/checkForUpdate";
import { Tabs } from "./components/Tab";
import {
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/plugin-notification';
import {
  Menu,
  Item,
  useContextMenu,
  ItemParams
} from "react-contexify";

import { confirm, message } from '@tauri-apps/plugin-dialog';

import "react-contexify/dist/ReactContexify.css";
import { t } from "i18next";

function App() {
  const dbService = new DatabaseService()
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [currentBoard, setCurrentBoard] = useState<number>(1);
  const [reloadList, setReloadList] = useState<boolean>(false);
  const [firstReload, setFirstReload] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [infoType, setInfoType] = useState<"board" | "collection" | "task" | null>(null);
  const [editInfo, setEditInfo] = useState<{ id: number, name: string, description?: string, status?: string, date?: string, color?: string, collection_id?: string } | undefined>(undefined);
  const [allBoards, setAllBoards] = useState<{ id: number, name: string }[]>([{ id: 0, name: "test"}]);
  const { show } = useContextMenu();
  
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const handleCreateBoard = async (_type: "board" | "collection" | "task", name: string) => {
    await dbService.createBoard(name);
    window.location.reload();
  };

  const handleModify = async (type: "board" | "collection" | "task", name: string, description?: string | undefined, date?: string | undefined, color?: string | undefined, _collection_id?: string | undefined, id?: number | undefined) => {
    if (type === "board") {
      await dbService.updateBoard(id === undefined ? 0 : id, name);
      window.location.reload();
    } else if (type === "collection") {
      await dbService.updateCollection(id === undefined ? 0 : id, name, color);
      setReloadList(true);
    } else if (type === "task") {
      await dbService.getTaskById(id === undefined ? 0 : id).then(async (task) => {
        await dbService.updateTask(id === undefined ? 0 : id, name, description, date, task?.status);
      });
      setReloadList(true);
    }
    window.location.reload();
  };


  function displayBoardMenu(e: React.MouseEvent, boardId: number) {
    show({
      id: "board-menu",
      props: { boardId },
      event: e,
    });
  }

  async function handleBoardItemClick({id, props }: ItemParams<any, any>) {
    const boardId = props.boardId;
    if (id === "edit") {
      const board = allBoards.find((board) => board.id === boardId);
      setInfoType("board")
      setEditInfo({ id: boardId, name: board?.name === undefined ? "" : board.name });
      setShowModal(true);
      // return (
      //   <ModalForm type="board" onCreate={handleModifyBoard} previousData={board} open={showModal} setOpen={setShowModal} />
      // )
      // setEditBoardInfo({ id: boardId, name: board?.name === undefined ? "" : board.name });
      // setShowModal(true);
    } else if (id === "delete") {
      const nbOfBoards = allBoards.length;
      if (nbOfBoards <= 1) {
        message(t("Cant_Delete_Tab"));
        return;
      }
      const deleteConfirm = await confirm(t("Are_Sure", { "type": t("tab"), "title": allBoards.find((board) => board.id === boardId)?.name }));
      if(deleteConfirm) {
        await dbService.removeBoard(boardId);
        window.location.reload();
      }
    }
  }

  function displayCollectionMenu(e: React.MouseEvent, collection_id: number) {
    show({
      id: "collection-menu",
      props: { collection_id },
      event: e,
    });
  }

  async function handleCollectionItemClick({id, props }: ItemParams<any, any>) {
    const collection_id = props.collection_id;
    if (id === "edit") {
      const collection = await dbService.getCollectionById(collection_id);
      setInfoType("collection")
      setEditInfo({ id: collection_id, name: collection?.names === undefined ? "" : collection.names, color: collection?.color === undefined ? "" : collection.color?.toString() });
      setShowModal(true);
    } else if (id === "delete") {
      const deleteConfirm = await confirm(t("Are_Sure", { "type": t("list"), "title": await dbService.getCollectionById(collection_id).then((collection) => collection?.names) }));
      if(deleteConfirm) {
        await dbService.removeCollection(collection_id);
        setReloadList(true);
      }
    }
  }

  useEffect(() => {
    async function handleNotificationPermission() {
      await checkForAppUpdates(true);
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        await dbService.updateOption("notification", "true");
      }
    }
    handleNotificationPermission();
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
      <div className="fixed left-0 top-0 flex w-full justify-between pt-4 text-center shadow-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Tabs
          currentBoard={currentBoard}
          tabs={allBoards}
          setReloadList={setReloadList}
          setCurrentBoard={setCurrentBoard}
          handleCreateBoard={handleCreateBoard}
          contextMenu={displayBoardMenu}
        />
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
      <ModalForm type={infoType === null ? "task" : infoType} onCreate={handleModify} previousData={editInfo} open={showModal} setOpen={setShowModal} />
      <div
        id="lists-container"
        className="mt-13 w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <ListContainer
          boardId={currentBoard}
          reloadList={reloadList}
          setReloadList={setReloadList}
          currentBoard={currentBoard}
          contextMenu={displayCollectionMenu}
        />
      </div>
      <Menu id={"board-menu"} animation="scale">
        <Item onClick={handleBoardItemClick} id="edit">
          {t("Modify_the_Tab")}
        </Item>
        <Item onClick={handleBoardItemClick} id="delete">
          {t("Delete_the_Tab")}
        </Item>
      </Menu>
      <Menu id={"collection-menu"} animation="scale">
        <Item onClick={handleCollectionItemClick} id="edit">
          {t("Modify_the_List")}
        </Item>
        <Item onClick={handleCollectionItemClick} id="delete">
          {t("Delete_The_List")}
        </Item>
      </Menu>
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

