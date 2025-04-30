import { useEffect, useState } from "react";
import { DatabaseService } from "../lib/dbClass";
import { useTranslation } from "react-i18next";
import { ModalForm } from "./Modal/ModalForm";
// import Sortable from 'sortablejs';
import { ReactSortable } from "react-sortablejs";
import InfoModal from "./Modal/InfoModal";

type Task = {
  id: number;
  collection_id: number;
  task_order: number;
  names: string | null;
  descriptions: string | null;
  due_date: string | null;
}

export function ListContainer({ boardId, reloadList, setReloadList, currentBoard }: { boardId: number, reloadList: boolean, setReloadList: (reload: boolean) => void , currentBoard: number}) {
  let tt = currentBoard;
  tt = tt
  const { t } = useTranslation();
  const [board, setBoard] = useState<{ id: number; name: string }>({
    id: 0,
    name: "",
  });
  const dbService = new DatabaseService()
  const [collections, setCollections] = useState<
    { id: number;
      board_id: number;
      names: string;
      color: string | null; }[]
  >([]);
  const [tasks, setTasks] = useState<
    Task[]
  >([]);

  //const webService = new WebService("http://192.168.1.38/yapuka/api/")

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await dbService.init();

        const tempboard = await dbService.getBoardById(boardId);
        const allTasks = await dbService.getAllTasks()
        if (tempboard === null) {
          const tempBoard2 = await dbService.getBoardById(1);
          if (tempBoard2 === null) {
            const newBoardId = await dbService.createBoard("Premier Onglet");
            console.log("Board ajouté avec ID :", newBoardId);
          }
        }
        const collections = await dbService.getAllCollections()
        setBoard(tempboard ? tempboard : { id: 0, name: "" });

        setCollections(collections);
        setTasks(allTasks);

      } catch (error) {
        alert("Erreur : " + error)
        console.error(
          "Erreur lors de l'initialisation de la base de données :",
          error
        );
      }
    };

    initDatabase();
    setReloadList(false)
  }, [reloadList]);

  const groupedItems = tasks.reduce<Record<number, Task[]>>((acc, item) => {
    acc[item.collection_id] = acc[item.collection_id] || [];
    acc[item.collection_id].push(item);
    return acc;
  }, {});

  const handleSetList = async (collectionId: number, newList: Task[]) => {
    setTasks((prev) => {
      const others = prev.filter((item) => item.collection_id !== collectionId);
      const updated = newList.map((item) => ({ ...item, collection_id: collectionId }));
      return [...others, ...updated];
    });
    for (let i = 0; i < newList.length; i++) {
      const task = newList[i];
      await dbService.updateTaskOrder(task.id, i, collectionId)
    }
    if (reloadList === false) {
      setReloadList(true)
    }
  };

  const handleCreateTask = async (name: string, description?: string, date?: string, color?: string, collection_id?: string) => {
    color = color
    if (collection_id !== undefined) {
      const task_order = await dbService.getTasksByCollection(parseInt(collection_id))
      const newCreateId = await dbService.createTask(parseInt(collection_id), task_order.length, name, description, date);
      console.log("Tache créée avec ID:", newCreateId);
      setReloadList(true)
    } else {
      alert("Une erreur ses produite")
    }
  };

  const deleteList = ( collectionListName: string, collectionListId: number) => {
    if (confirm(`${t("Are_Sure", { type:t("list"),  title:collectionListName })}`)) {
      dbService.removeCollection(collectionListId)
      setReloadList(true)
    }
  }

  const handleUpdateCollection = async (
    name: string,
    description?: string | undefined,
    date?: string | undefined,
    color?: string | undefined,
    collection_id?: string | undefined,
    id?: number | undefined
  ) => {
    date = date
    description = description;
    collection_id = collection_id;
    const newCollectionId = await dbService.updateCollection(
      id === undefined ? 0 : id,
      name,
      color
    );
    console.log("Collection créée avec ID:", newCollectionId);
    setReloadList(true);
  };

  // useEffect(() => {
  //   console.log("Reloading list")
  //   collections.forEach((_, index) => {
  //     if (!listRefs.current[index]) return;
  //     console.log("Collection ID: ", collections[index].id)
  //     new Sortable(listRefs.current[index]!, {
  //       group: "shared",
  //       animation: 150,
  //       onEnd: async (evt) => {
  //         const newCollection = parseInt(evt.to.id.replace("collection-", ""));
  //         const newPosition = evt.newIndex;
  //         const taskId = parseInt(evt.item.id.replace("task-", ""));
  //         await dbService.updateTaskOrder(taskId, newPosition === undefined ? 0 : newPosition, newCollection)
  //       },
  //     });
  //   });
  // }, [reloadList]);

  // async function sortTask(
  //   tasks: {
  //     id: number;
  //     collection_id: number;
  //     task_order: number;
  //     names: string | null;
  //     descriptions: string | null;
  //     due_date: string | null;
  //   }[]) {
  //   console.log(tasks)
  //   console.log()
  //   // tasks.forEach(task => {
  //   //   console.log(task.id, task.collection_id, task.task_order, task.names, task.descriptions, task.due_date)
  //   // });
  //   // console.log(fakeTasks)
  //   // const newCollection = parseInt(evt.from.id);
  //   // const newPosition = evt.newIndex;
  //   // const taskId = parseInt(evt.item.id);
  //   // await dbService.updateTaskOrder(taskId, newPosition === undefined ? 0 : newPosition, newCollection)
  //   // if (reloadList === false) {
  //   //   setReloadList(true)
  //   // }
  // }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{board.name} {/*<img src="/icons/refresh.svg" className="h-6 w-6" onClick={() => setReload(true)} />*/}</h1>
      {Object.entries(groupedItems).filter(([collectionIdStr]) => Number(collections.find((c) => c.id === Number(collectionIdStr))?.board_id) === boardId).map(([collectionIdStr, list]) => {
        const collection = collections.find((c) => c.id === Number(collectionIdStr));
        return (
          <div key={collection?.id} className="relative flex-col rounded-lg bg-gray-300 dark:bg-blue-950 shadow-sm border border-slate-200 dark:border-blue-700 min-w-[240px] gap-1 p-1.5 list float-left inline m-3">
            <h3
              className={`rounded capitalize text-center p-2 font-bold ${collection?.color === null ? "bg-[#d1d5dc] dark:bg-blue-900" : ""}`}
              style={{ 
                backgroundColor: collection?.color !== null ? collection?.color.toString() : ''
              }}
            >
              {collection?.names}
              <ModalForm type="collection" onCreate={handleUpdateCollection} previousData={ { id: collection?.id === undefined ? 0 : collection?.id, name: collection?.names === undefined ? "Error" : collection?.names, color:collection?.color?.toString() } } />
              <div className="overflow-hidden">
                <button onClick={() => deleteList(collection?.names === undefined ? "Error" : collection?.names, collection?.id === undefined ? 0 : collection?.id)} className="bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l float-left inline">
                  <img className="h-6" src="/icons/supprimer.svg" />
                </button>
                <ModalForm type="task" collectionId={collection?.id.toString()} onCreate={handleCreateTask} />
              </div>
            </h3>
            <ReactSortable
              list={list}
              setList={(newList) => handleSetList(collection?.id === undefined ? 0 : collection?.id, newList)}
              group="shared"
              animation={200}
              forceFallback={true}
            >
              {list.map((task) => (
                <InfoModal key={task.id} task={task} reloadList={false} setReloadList={setReloadList} />
              ))}
            </ReactSortable>
          </div>
        );
      })}
      {/* <div>
        {collections
          .filter((collection) => collection.board_id === boardId)
          .map((collection, index) => (
          <div
            key={collection.id}
            id={index.toString()}
            className="relative flex-col rounded-lg bg-gray-300 dark:bg-blue-950 shadow-sm border border-slate-200 dark:border-blue-700 min-w-[240px] gap-1 p-1.5 list float-left inline m-3"
            >
            <h3
              className={`rounded capitalize text-center p-2 font-bold ${collection.color === null ? "bg-[#d1d5dc] dark:bg-blue-900" : ""}`}
              style={{ 
                backgroundColor: collection.color !== null ? collection.color.toString() : ''
              }}
            >
              {collection.names}
              <ModalForm type="collection" onCreate={handleUpdateCollection} previousData={ { id: collection.id, name:collection.names, color:collection.color?.toString() } } />
              <div className="overflow-hidden">
                <button onClick={() => deleteList(collection.names, collection.id)} className="bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l float-left inline">
                  <img className="h-6" src="/icons/supprimer.svg" />
                </button>
                <ModalForm type="task" collectionId={collection.id.toString()} onCreate={handleCreateTask} />
              </div>
            </h3>
            <ReactSortable
              id={collection.id.toString()}
              setList={setFaketasks}
              list={tasks.filter((task) => task.collection_id === collection.id)}
              onEnd={async (evt) => {
                // console.log(fakeTasks)
                const newCollection = parseInt(evt.from.id);
                const newPosition = evt.newIndex;
                const taskId = parseInt(evt.item.id);
                await dbService.updateTaskOrder(taskId, newPosition === undefined ? 0 : newPosition, newCollection)
                if (reloadList === false) {
                  setReloadList(true)
                }
              }}
              multiDrag={true}
              group="shared"
              sort= {true}
              animation={150}>
              {tasks
                .filter((task) => task.collection_id === collection.id)
                .sort((a, b) => a.task_order - b.task_order)
                .map((task) => (
                  <p key={task.id} id={task.id.toString()}>{task.names} - {task.task_order}</p>
                ))}
              <InfoModal key={task.id} task={task} reloadList={false} setReloadList={setReloadList} />
            </ReactSortable>
            <div id={`collection-${collection.id}`} ref={(el) => (listRefs.current[index] = el)}>
              {tasks
                .filter((task) => task.collection_id === collection.id)
                .sort((a, b) => a.task_order - b.task_order)
                .map((task) => (
                  <InfoModal key={task.id} task={task} reloadList={false} setReloadList={setReloadList} />
                ))}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
