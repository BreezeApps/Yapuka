import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { DatabaseService } from "../../lib/dbClass";
import { ModalForm } from "./ModalForm";

interface InfoModalProps {
  task: {
    id: number;
    collection_id: number;
    task_order: number;
    names: string | null;
    descriptions: string | null;
    due_date: string | null;
  };
  reloadList: boolean;
  setReloadList: (reload: boolean) => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ task, setReloadList }) => {
  const { t } = useTranslation();
  const dbService = new DatabaseService();
  let date = null

  if(task.due_date !== "") {
    date = task.due_date !== null ? new Date(task.due_date) : null
  }

  const dateText = date === null ? "Non définie" : `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

  const handleUpdateTask = async (
    name: string,
    description?: string,
    date?: string,
    color?: string,
    collection_id?: string,
    id?: number
  ) => {
    color = color;
    if (collection_id !== undefined) {
      const newCreateId = await dbService.updateTask(
        id === undefined ? 0 : id,
        name,
        description,
        date
      );
      console.log("Tache créée avec ID:", newCreateId);
      setReloadList(true);
    } else {
      alert("Une erreur ses produite");
    }
  };
  return (
    <div className="text-slate-800 dark:text-white flex w-full items-center rounded-md transition-all hover:bg-slate-100 dark:hover:bg-blue-600 focus:bg-slate-100 active:bg-slate-100">
        <Dialog.Root>
        <Dialog.Trigger asChild>
            <div
            key={task.id}
            id={`task-${task.id}`}
            role="button"
            className="w-full cursor-pointer"
            >
            {task.names}
            {/*<button className="inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                    <img src="/icons/modify.svg" className="w-6 h-6" alt="" />
                </button>*/}
            </div>
        </Dialog.Trigger>

        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-semibold">
                {task.names ?? "Non spécifié"}
                </Dialog.Title>
            </div>

            <div className="mt-4">
                <p>
                <strong>Description :</strong>{" "}
                <br></br>
                {task.descriptions === "" ? "Aucune description" : task.descriptions}
                </p>
                <p>
                <strong>Date d'échéance :</strong>{" "}
                {dateText}
                </p>
            </div>

            <div className="mt-4 flex justify-end">
                <Dialog.Close className="bg-gray-300 px-4 py-2 rounded">
                {t("Close")}
                </Dialog.Close>
            </div>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
        {/* <div onClick={handleOpenModal} className={"inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"} >
            <img className="h-6" src={"/icons/modify.svg"} />
          </div> */}
          <ModalForm
            type="task"
            onCreate={handleUpdateTask}
            previousData={{
              id: task.id,
              name: task.names === null ? "" : task.names,
              date: task.due_date === null ? "" : task.due_date,
              description: task.descriptions === null ? "" : task.descriptions,
            }}
          />
    </div>
  );
};

export default InfoModal;
