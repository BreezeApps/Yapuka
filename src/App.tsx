import "./App.css";
import { ConfigPage } from "./components/ConfigPage";
import React, { useEffect, useState } from "react";
import { ListContainer } from "./components/ListContainer";
import { ModalForm } from "./components/Modal/ModalForm";
import { DatabaseService } from "./lib/dbClass";
import ErrorBoundary from "./components/ErrorBondary";
// import { checkForAppUpdates } from "./lib/checkForUpdate";
import * as path from "@tauri-apps/api/path";
import { Tabs } from "./components/Tab";
import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";
import { useContextMenu, ItemParams } from "react-contexify";

import { confirm, message, save } from "@tauri-apps/plugin-dialog";

import "react-contexify/dist/ReactContexify.css";
import { t } from "i18next";
import { pdf } from "@react-pdf/renderer";
import { CollectionPDF } from "./components/pdf/Collection";
import { writeFile } from "@tauri-apps/plugin-fs";
import { BoardPDF } from "./components/pdf/Board";
import ContextMenu from "./components/contextMenu";
import { OnBoarding } from "./components/OnBoarding";
import { CalendarPage } from "./components/CalendarPage";
import { EventSourceInput } from "@fullcalendar/core/index.js";

function App() {
  const dbService = new DatabaseService();
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [runBoarding, setRunBoarding] = useState<boolean>(false);
  const [currentBoard, setCurrentBoard] = useState<number>(1);
  const [reloadList, setReloadList] = useState<boolean>(false);
  const [firstReload, setFirstReload] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [infoType, setInfoType] = useState<
  "board" | "collection" | "task" | null
  >(null);
  const [editInfo, setEditInfo] = useState<
  | {
    id: number;
    name: string;
    description?: string;
    status?: string;
    date?: Date;
    color?: string;
    collection_id?: string;
  }
  | undefined
  >(undefined);
  const [allBoards, setAllBoards] = useState<{ id: number; name: string }[]>([
    { id: 0, name: "test" },
  ]);
  const [showTaskInfo, setShowTaskInfo] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [events, setEvents] = useState<EventSourceInput>([]);
  const { show } = useContextMenu();
  
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const handleCreateBoard = async (
    _type: "board" | "collection" | "task",
    name: string
  ) => {
    await dbService.createBoard({ id: 0, name: name });
    setReloadList(true);
  };

  const handleModify = async (
    type: "board" | "collection" | "task",
    name: string,
    description?: string | undefined,
    date?: Date | undefined,
    color?: string | undefined,
    _collection_id?: string | undefined,
    id?: number | undefined
  ) => {
    if (type === "board") {
      await dbService.updateBoard({
        id: id === undefined ? 0 : id,
        name: name,
      });
    } else if (type === "collection") {
      await dbService.updateCollection({
        id: id === undefined ? 0 : id,
        board_id: 0,
        names: name,
        color: color === undefined ? null : color,
      });
    } else if (type === "task") {
      await dbService
        .getTaskById(id === undefined ? 0 : id)
        .then(async (task) => {
          await dbService.updateTask({
            id: id === undefined ? 0 : id,
            names: name,
            descriptions: description === undefined ? null : description,
            due_date: date === undefined ? null : date,
            status: task?.status === undefined ? "pending" : task?.status,
            collection_id: 0,
            task_order: 0,
          });
        });
    }
    setReloadList(true);
  };

  function displayBoardMenu(e: React.MouseEvent, boardId: number) {
    show({
      id: "board-menu",
      props: { boardId },
      event: e,
    });
  }

  async function handleBoardItemClick({ id, props }: ItemParams<any, any>) {
    const boardId = props.boardId;
    if (id === "edit") {
      const board = allBoards.find((board) => board.id === boardId);
      setInfoType("board");
      setEditInfo({
        id: boardId,
        name: board?.name === undefined ? "" : board.name,
      });
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
      const deleteConfirm = await confirm(
        t("Are_Sure", {
          type: t("tab"),
          title: allBoards.find((board) => board.id === boardId)?.name,
        })
      );
      if (deleteConfirm) {
        await dbService.removeBoard(boardId);
        window.location.reload();
      }
    } else if (id === "print") {
      const board = await dbService.getBoardById(boardId);
      const collections = await dbService.getCollectionsByBoard(boardId);
      const tasks = await dbService.getAllTasks();
      const filePath = await save({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath:
          (await path.downloadDir()) +
          "/" +
          `${t("PdfTab")}_${board?.name}.pdf`,
      });
      if (!filePath) return false;
      const pdfDoc = (
        <BoardPDF
          boardName={board?.name === undefined ? "" : board.name}
          collections={collections}
          tasks={tasks}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await writeFile(filePath, uint8Array);
      return true;
    }
  }

  function displayCollectionMenu(e: React.MouseEvent, collection_id: number) {
    show({
      id: "collection-menu",
      props: { collection_id },
      event: e,
    });
  }

  async function handleCollectionItemClick({
    id,
    props,
  }: ItemParams<any, any>) {
    const collection_id = props.collection_id;
    if (id === "edit") {
      const collection = await dbService.getCollectionById(collection_id);
      setInfoType("collection");
      setEditInfo({
        id: collection_id,
        name: collection?.names === undefined ? "" : collection.names,
        color:
          collection?.color === undefined ? "" : collection.color?.toString(),
      });
      setShowModal(true);
    } else if (id === "delete") {
      const deleteConfirm = await confirm(
        t("Are_Sure", {
          type: t("list"),
          title: await dbService
            .getCollectionById(collection_id)
            .then((collection) => collection?.names),
        })
      );
      if (deleteConfirm) {
        await dbService.removeCollection(collection_id);
        setReloadList(true);
      }
    } else if (id === "print") {
      const collection = await dbService.getCollectionById(collection_id);
      const tasks = await dbService.getTasksByCollection(collection_id);
      const filePath = await save({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath:
          (await path.downloadDir()) +
          "/" +
          `${t("PdfList")}_${collection?.names}.pdf`,
      });
      if (!filePath) return false;
      const pdfDoc = (
        <CollectionPDF
          collectionName={
            collection?.names === undefined ? "" : collection.names
          }
          tasks={tasks}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await writeFile(filePath, uint8Array);
      return true;
    }
  }

  function displayTaskMenu(e: React.MouseEvent, task_id: number) {
    show({
      id: "task-menu",
      props: { task_id },
      event: e,
    });
  }

  async function handleTaskItemClick({ id, props }: ItemParams<any, any>) {
    const task_id = props.task_id;
    if (id === "edit") {
      const task = await dbService.getTaskById(task_id);
      setInfoType("task");
      setEditInfo({
        id: task_id,
        name:
          task?.names === null
            ? ""
            : task?.names === undefined
            ? ""
            : task?.names,
        description:
          task?.descriptions === null
            ? ""
            : task?.descriptions === undefined
            ? ""
            : task?.descriptions,
        status:
          task?.status === null
            ? ""
            : task?.status === undefined
            ? ""
            : task?.status,
        date:
          task?.due_date === null
            ? new Date()
            : task?.due_date === undefined
            ? new Date()
            : task?.due_date,
        collection_id:
          task?.collection_id === undefined
            ? "0"
            : task?.collection_id.toString(),
      });
      setShowModal(true);
    } else if (id === "delete") {
      const deleteConfirm = await confirm(
        t("Are_Sure", {
          type: t("task"),
          title: await dbService
            .getTaskById(task_id)
            .then((task) => task?.names),
        })
      );
      if (deleteConfirm) {
        await dbService.removeTask(task_id);
        setReloadList(true);
      }
    }
  }

  useEffect(() => {
    async function handleNotificationPermission() {
      // await checkForAppUpdates(true);
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      if (permissionGranted) {
        await dbService.updateOption("notification", "true");
      }
    }
    handleNotificationPermission();
  }, []);

  useEffect(() => {
    const initBoards = async () => {
      setAllBoards(await dbService.getAllBoards());
    };
    initBoards();
  }, [reloadList]);

  // const handleCreateTask = async (name: string, description: string) => {
  //   const newTaskId = await dbService.createTask(1, name, description); // Remplace 1 par l'ID de la collection
  //   console.log("Tâche créée avec ID:", newTaskId);
  // };

  // localStorage.theme = "light";
  // localStorage.theme = "dark";

  if (firstReload === true) {
    setTimeout(async () => {
      setReloadList(true);
      setFirstReload(false);
      setRunBoarding(
        (await dbService.getOptionByKey("firstStart")) === "true" ? true : false
      );
    }, 500);
  }

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 top-0 absolute">
      <OnBoarding run={runBoarding} setRun={setRunBoarding} />
      <ErrorBoundary>
        <ConfigPage show={showConfig} setShow={setShowConfig} />
        <CalendarPage show={showCalendar} setShow={setShowCalendar} events={events} />
      </ErrorBoundary>
      <div
        id="one-step"
        className="fixed left-0 top-0 flex w-full justify-between pt-4 text-center shadow-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
      >
        <Tabs
          currentBoard={currentBoard}
          reloadList={reloadList}
          setReloadList={setReloadList}
          setCurrentBoard={setCurrentBoard}
          handleCreateBoard={handleCreateBoard}
          contextMenu={displayBoardMenu}
          setShowConfig={setShowConfig}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <ModalForm
        type={infoType === null ? "task" : infoType}
        onCreate={handleModify}
        previousData={editInfo}
        open={showModal}
        setOpen={setShowModal}
      />
      <div className="mt-13 w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
        <ListContainer
          boardId={currentBoard}
          reloadList={reloadList}
          setReloadList={setReloadList}
          currentBoard={currentBoard}
          contextMenuCollection={displayCollectionMenu}
          contextMenuTask={displayTaskMenu}
          setDescription={setDescription}
          setDuedate={setDueDate}
          setShowTaskInfo={setShowTaskInfo}
          setEvents={setEvents}
        />
      </div>
      <div className={`p-4 rounded-2xl fixed top-0 right-0 bg-[#cecece] dark:bg-gray-400 ${showTaskInfo === true ? "" : "hidden"}`}>
        <p>
          <strong>{t("Description")} :</strong> <br></br>
          {description}
          {/* {task.descriptions === "" ? t("NoDescription") : task.descriptions} */}
        </p>
        <p>
          <strong>{t("Duedate")} :</strong><br></br>
          <span className="capitalize">{dueDate}</span>
        </p>
      </div>
      <ContextMenu
        handleBoardItemClick={handleBoardItemClick}
        handleCollectionItemClick={handleCollectionItemClick}
        handleTaskItemClick={handleTaskItemClick}
      />
      <img
        src="/CC_BY-NC-SA.png"
        alt="Creative Commons BY-NC-SA"
        className="absolute bottom-0 right-0 z-50"
        width="100"
      />
    </div>
  );
}

export default App;
