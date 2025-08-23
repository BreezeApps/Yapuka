import { useEffect, useState } from "react";
import { DatabaseService } from "../lib/db/dbClass";
import { ModalForm } from "./Modal/ModalForm";
import { ReactSortable } from "react-sortablejs";
import { Task } from "../lib/types/Task";
import { t } from "i18next";
import { getDate, getRelativeTime } from "../lib/i18n";
import { Checkbox } from "./ui/checkbox";
import { useLoadingScreen } from "@/Hooks/useLoadingScreen";
import { Board } from "@/lib/types/Board";
import { getTextColor } from "@/lib/utils";

/**
 * The ListContainer component manages the display and interaction of collections
 * and tasks within a board, allowing for tasks to be created, updated, and marked as done.
 */
export function ListContainer({
  dbService,
  boardId,
  reloadList,
  setReloadList,
  currentBoard,
  contextMenuCollection,
  contextMenuTask,
  setDescription,
  setDuedate,
  setShowTaskInfo,
}: {
  dbService: DatabaseService;
  boardId: number;
  reloadList: boolean;
  setReloadList: (reload: boolean) => void;
  currentBoard: number;
  contextMenuCollection: (e: React.MouseEvent, id: number) => void;
  contextMenuTask: (e: React.MouseEvent, id: number) => void;
  setShowTaskInfo: (show: boolean) => void;
  setDescription: (description: string) => void;
  setDuedate: (description: string) => void;
}) {
  const [board, setBoard] = useState<Board>({
    id: 0,
    name: "",
    color: ""
  });
  const [collections, setCollections] = useState<
    { id: number; board_id: number; names: string; color: string | null }[]
  >([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showLoading, hideLoading } = useLoadingScreen();

  useEffect(() => {
    const initDatabase = async () => {
      try {
        showLoading("Chargement de la bdd");
        let tempboard = null;
        let i = 0;
        while (tempboard === null || i >= 100) {
          tempboard = await dbService.getBoardById(boardId);
          if (tempboard === null) {
            tempboard = await dbService.getBoardById(1);
          }
        }
        const allTasks = await dbService.getTasksByBoard(tempboard.id);
        const collections = await dbService.getCollectionsByBoard(tempboard.id);
        setBoard(tempboard ? tempboard : { id: 0, name: "", color: "" });

        setCollections(collections);
        setTasks(allTasks);
      } catch (error) {
        alert("Erreur : " + error);
        console.error(
          "Erreur lors de l'initialisation de la base de données :",
          error
        );
      }
      hideLoading();
    };

    initDatabase();
    setReloadList(false);
  }, [reloadList]);

  const handleSetList = async (collectionId: number, newList: Task[]) => {
    setTasks((prev) => {
      const others = prev.filter((item) => item.collection_id !== collectionId);
      const updated = newList.map((item) => ({
        ...item,
        collection_id: collectionId,
      }));
      return [...others, ...updated];
    });
    for (let i = 0; i < newList.length; i++) {
      const task = newList[i];
      await dbService.updateTaskOrder({
        id: task.id,
        task_order: i,
        collection_id: collectionId,
        names: "",
        descriptions: "",
        status: "pending",
        due_date: new Date(),
      });
    }
  };

  const handleCreateTask = async (
    _type: "board" | "collection" | "task",
    name: string,
    description?: string,
    date?: Date,
    _color?: string,
    collection_id?: string
  ) => {
    if (collection_id !== undefined) {
      const task_order = await dbService.getTasksByCollection(
        parseInt(collection_id)
      );
      await dbService.createTask({
        collection_id: parseInt(collection_id),
        task_order: task_order.length,
        names: name,
        descriptions: description === undefined ? null : description,
        due_date: date === undefined ? null : date,
        id: 0,
        status: "pending",
      });
      setReloadList(true);
    } else {
      alert("Une erreur ses produite");
    }
  };

  const handleCreateCollection = async (
    _type: "board" | "collection" | "task",
    name: string,
    _description?: string,
    _date?: Date,
    color?: string,
    _collection_id?: string,
    _id?: number
  ) => {
    await dbService.createCollection({
      board_id: currentBoard,
      names: name,
      color: color === undefined ? null : color,
      id: 0,
    });
    setReloadList(true);
  };

  async function checkedDoneTask(task: Task, checked: boolean) {
    if (checked) {
      await dbService.updateTask({
        id: task.id,
        names: task.names === null ? "" : task.names,
        descriptions: task.descriptions === null ? "" : task.descriptions,
        due_date: task.due_date === null ? new Date() : task.due_date,
        collection_id: 0,
        task_order: 0,
        status: "done",
      });
    } else {
      await dbService.updateTask({
        id: task.id,
        names: task.names === null ? "" : task.names,
        descriptions: task.descriptions === null ? "" : task.descriptions,
        due_date: task.due_date === null ? new Date() : task.due_date,
        collection_id: 0,
        task_order: 0,
        status: "pending",
      });
    }
    setReloadList(true);
  }

  return (
    <div className="p-6 h-full" style={{ background: board.color === null ? "" : board.color }}>
        <ModalForm
          id="three-step"
          type="collection"
          onCreate={handleCreateCollection}
        />
      {Array.isArray(collections) &&
        collections
          .filter((collection) => collection.board_id === board.id)
          .map((collection) => {
            const list = Array.isArray(tasks)
              ? tasks.filter((task) => task.collection_id === collection.id)
              : [];
            return (
              <div
                id="five-step"
                key={collection?.id}
                className="relative flex-col rounded-lg bg-gray-300 dark:bg-blue-950 shadow-sm border border-slate-200 dark:border-blue-700 min-w-[240px] gap-1 p-1.5 list float-left inline m-3"
              >
                <h3
                  onContextMenu={(e) => {
                    contextMenuCollection(e, collection.id);
                  }}
                  className={`rounded capitalize text-center p-2 font-bold ${
                    collection?.color === null
                      ? "bg-[#d1d5dc] dark:bg-blue-900"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      collection?.color !== null
                        ? collection?.color.toString()
                        : "",
                  }}
                >
                  <span className="pr-4 text-2xl" style={{ color: getTextColor(collection?.color !== null ? collection.color : "#d1d5dc") }}>{collection?.names}</span>
                  <ModalForm
                    type="task"
                    collectionId={collection?.id.toString()}
                    onCreate={handleCreateTask}
                  />
                </h3>
                <ReactSortable
                  list={list}
                  setList={(newList) =>
                    handleSetList(
                      collection?.id === undefined ? 0 : collection?.id,
                      newList
                    )
                  }
                  group="shared"
                  animation={200}
                  forceFallback={true}
                >
                  {/* {list.map((task) => (
                <InfoModal
                  key={task.id}
                  id="seven-step"
                  task={task}
                  reloadList={false}
                  contextMenuTask={contextMenuTask}
                />
              ))} */}
                  {Array.isArray(list) &&
                    list.map((task) => (
                      <div
                        key={task.id}
                        id={"seven-step"}
                        role="button"
                        className={`${
                          task.status === "done"
                            ? "bg-gray-200 dark:bg-blue-950 text-slate-500 dark:text-blue-400"
                            : "bg-gray-300 dark:bg-blue-950 text-slate-800 dark:text-white"
                        } flex w-full h-6 items-center rounded-md transition-all hover:bg-slate-100 dark:hover:bg-blue-600 focus:bg-slate-100 active:bg-slate-100`}
                        onContextMenu={(e) => {
                          contextMenuTask(e, task.id);
                        }}
                        onMouseOver={() => {
                          setDescription(
                            task.descriptions === null ? "" : task.descriptions
                          );
                          const dateText =
                            task.due_date !== null
                              ? `${getRelativeTime(task.due_date)} (${getDate(
                                  task.due_date
                                )})`
                              : t("NoDue");
                          setDuedate(dateText);
                          setShowTaskInfo(true);
                        }}
                        onMouseOut={() => {
                          setShowTaskInfo(false);
                        }}
                      >
                        {/* {task.names}
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={(e) => {
                      checkedDoneTask(task, e.target.checked);
                    }}
                    name="Test"
                    id="tt"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  /> */}
                        <Checkbox
                          checked={task.status === "done"}
                          onChange={(e) => {
                            checkedDoneTask(
                              task,
                              e.currentTarget.value === "on"
                            );
                          }}
                        />
                        {task.names}
                        {/*<button className="inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                        <img src="/icons/modify.svg" className="w-6 h-6" alt="" />
                    </button>*/}
                      </div>
                    ))}
                </ReactSortable>
              </div>
            );
          })}
    </div>
  );
}
