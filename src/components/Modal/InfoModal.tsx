import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { DatabaseService } from "../../lib/dbClass";
import { getDate, getRelativeTime } from "../../lib/i18n";
import { useEffect, useState } from "react";
import { Task } from "../../lib/types/Task";

interface InfoModalProps {
  task: Task;
  reloadList: boolean;
  contextMenuTask: (e: React.MouseEvent, id: number) => void
  id?: string
}

const InfoModal: React.FC<InfoModalProps> = ({ task, contextMenuTask, id }) => {
  const [checkedDone, setCheckedDone] = useState(false);
  const { t } = useTranslation();
  const dbService = new DatabaseService();
  let date = null

  useEffect(() => {
    if (task.status === "done") {
      setCheckedDone(true);
    } else {
      setCheckedDone(false);
    }
  }, [task.status]);

  if(task.due_date !== "") {
    date = task.due_date !== null ? new Date(task.due_date) : null
  }

  const dateText = (date !== null) ? `${getRelativeTime(date)} (${getDate(date)})` : t("NoDue")  // (date === null) ? "Non définie" : `${day} ${date.getDate()} ${month} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

  async function checkedDoneTask(done: boolean) {
    setCheckedDone(done);
    if (done) {
      await dbService.updateTask({ id: task.id, names: task.names === null ? "" : task.names, descriptions: task.descriptions === null ? "" : task.descriptions, due_date: task.due_date === null ? "" : task.due_date, collection_id: 0, task_order: 0, status: "done" });
    } else {
      await dbService.updateTask({ id: task.id, names: task.names === null ? "" : task.names, descriptions: task.descriptions === null ? "" : task.descriptions, due_date: task.due_date === null ? "" : task.due_date, collection_id: 0, task_order: 0, status: "pending" });
    }
  }
  return (
    <div id={`task-${task.id}`} key={task.id} className={`${checkedDone === true ? "bg-gray-200 dark:bg-blue-950 text-slate-500 dark:text-blue-400" : "bg-gray-300 dark:bg-blue-950 text-slate-800 dark:text-white"} flex w-full h-6 items-center rounded-md transition-all hover:bg-slate-100 dark:hover:bg-blue-600 focus:bg-slate-100 active:bg-slate-100`}>
        <Dialog.Root>
        <Dialog.Trigger asChild id={id !== undefined ? id : ""} >
            <div
              key={task.id}
              id={id !== undefined ? id : ""}
              role="button"
              className="w-full cursor-pointer"
              onContextMenu={(e) => {contextMenuTask(e, task.id)}}
            >
            {task.names}
            {/*<button className="inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                    <img src="/icons/modify.svg" className="w-6 h-6" alt="" />
                </button>*/}
            </div>
        </Dialog.Trigger>

        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-semibold">
                {task.names ?? "Error"}
                </Dialog.Title>
                <p>{checkedDone ? t("Done") : t("Pending")}</p>
                <input
                  type="checkbox"
                  checked={checkedDone}
                  onChange={(e) => {
                    checkedDoneTask(e.target.checked);
                  }}
                  name="Test"
                  id="tt"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            <div className="mt-4">
                <p>
                <strong>{t("Description")} :</strong>{" "}
                <br></br>
                {task.descriptions === "" ? t("NoDescription") : task.descriptions}
                </p>
                <p>
                <strong>{t("Duedate")} :</strong>{" "}
                <span className="capitalize">{dateText}</span>
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
          {/* <span className="dark:invert">
            <ModalForm
              type="task"
              onCreate={handleUpdateTask}
              collectionId={task.collection_id.toString()}
              previousData={{
                id: task.id,
                name: task.names === null ? "" : task.names,
                date: task.due_date === null ? "" : task.due_date,
                description: task.descriptions === null ? "" : task.descriptions,
              }}
            />
          </span> */}
    </div>
  );
};

export default InfoModal;
