import { useEffect, useState } from "react";
import { DatabaseService } from "../lib/dbClass";
import { useTranslation } from "react-i18next";
import { ModalForm } from "./Modal/ModalForm";
import InfoModal from "./Modal/InfoModal";

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
    {
      id: number;
      collection_id: number;
      task_order: number;
      names: string | null;
      descriptions: string | null;
      due_date: string | null;
    }[]
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
        alert("Erreru : " + error)
        console.error(
          "Erreur lors de l'initialisation de la base de données :",
          error
        );
      }
    };

    initDatabase();
    setReloadList(false)
  }, [reloadList]);

  const handleCreateTask = async (name: string, description?: string, date?: string, color?: string, collection_id?: string) => {
    color = color
    if (collection_id !== undefined) {
      const newCreateId = await dbService.createTask(parseInt(collection_id), 0, name, description, date);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{board.name} {/*<img src="/icons/refresh.svg" className="h-6 w-6" onClick={() => setReload(true)} />*/}</h1>
      <div>
        {collections
          .filter((collection) => collection.board_id === boardId)
          .map((collection) => (
          <div
            key={collection.id}
            className="relative flex-col rounded-lg bg-gray-300 dark:bg-blue-950 shadow-sm border border-slate-200 dark:border-blue-700 min-w-[240px] gap-1 p-1.5 list float-left inline m-3"
            >
            <h3
              className={`rounded capitalize text-center p-2 font-bold ${collection.color === null ? "bg-[#d1d5dc] dark:bg-blue-900" : ""}`}
              style={{ 
                backgroundColor: collection.color !== null ? collection.color.toString() : ''
              }}
            >
              {collection.names}
              {/* <button className="place-self-end inline-block ml-auto place-items-center rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                <img src="/icons/print-icon.svg" className="h-6" alt="" />
              </button> */}
              <ModalForm type="collection" onCreate={handleUpdateCollection} previousData={ { id: collection.id, name:collection.names, color:collection.color?.toString() } } />
              <div className="overflow-hidden">
                <button onClick={() => deleteList(collection.names, collection.id)} className="bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l float-left inline">
                  <img className="h-6" src="/icons/supprimer.svg" />
                </button>
                <ModalForm type="task" collectionId={collection.id.toString()} onCreate={handleCreateTask} />
              </div>
            </h3>
            <div>
              {tasks
                .filter((task) => task.collection_id === collection.id)
                .map((task) => (
                  <InfoModal task={task} reloadList={false} setReloadList={setReloadList} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
