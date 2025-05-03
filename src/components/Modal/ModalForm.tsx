import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ModalFormProps = {
  type: "task" | "collection" | "board";
  collectionId?: string
  onCreate: (type: "board" | "collection" | "task", name: string, description?: string, date?: string, color?: string, collection_id?: string, id?: number) => void;
  previousData?: { id: number, name: string, description?: string, status?: string, date?: string, color?: string, collection_id?: string };
  open?: boolean,
  setOpen?: (open: boolean) => void
};

export function ModalForm({ type, collectionId, onCreate, previousData, open, setOpen }: ModalFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [firstReload, setFirstReload] = useState<boolean>(true);

  if (firstReload === true) {
    setFirstReload(false)
    if (previousData) {
      setName(previousData.name)
      setDescription(previousData.description === undefined ? "" : previousData.description)
      setDate(previousData.date === undefined ? "" : previousData.date)
      setColor(previousData.color)
    }
  }

  useEffect(() => {
    if (previousData) {
      setName(previousData.name)
      setDescription(previousData.description === undefined ? "" : previousData.description)
      setDate(previousData.date === undefined ? "" : previousData.date)
      setColor(previousData.color)
    }
  }, [previousData])

  const handleSubmit = () => {
    if (!name) return;
    onCreate(type, name, description, date, color, collectionId, previousData?.id);
    setName("");
    setDescription("");
    setDate("")
    setColor(undefined);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {open === undefined ? 
        <Dialog.Trigger
          className={
            type === "board" 
              ? ""
              : type !== "task"
                ? "rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                : previousData !== undefined
                  ? "inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  : "bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded float-left inline"
          }
          style={
            type === "board" ? {
            display: "inline-block",
            float: "left",
            height: "34px",
            textAlign: "center",
            lineHeight: "22px",
            padding: "0 8px 0 8px",
            margin: "1px 0px 0px 0px",
            border: "1px solid gray",
            borderBottom: "1px solid gray",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            background: "#F0F0F0",
            cursor: "pointer",
          } : undefined}
        >
          <img 
            className={`h-6`}
            src={previousData !== undefined ? "/icons/modify.svg" : type === "task" ? "/icons/ajouter-tache.svg" : type === "collection" ? "/icons/ajouter-liste.svg" : "/icons/ajouter.svg"} />
          {/*t(
            type === "task"
              ? "Add_a_Task"
              : type === "collection"
              ? "Add_a_List"
              : "Add_a_Tab"
          )*/}
        </Dialog.Trigger>
      : ""}
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 bg-black/50`} />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            {t(
              previousData !== undefined
              ? type === "task"
                ? "Modify_a_Task"
                : type === "collection"
                  ? "Modify_a_List"
                  : "Modify_a_Tab"
                    : type === "task"
                    ? "Add_a_Task"
                    : type === "collection"
                      ? "Add_a_List"
                      : "Add_a_Tab"
            )}
          </Dialog.Title>

          <div className="mt-4">
            <label className="block text-sm">{t("Name")}</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {type === "task" && (
            <div className="mt-4">
              <label className="block text-sm">{t("Description")}</label>
              <textarea
                className="w-full border p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}
          {type === "task" && (
            <div className="mt-4">
              <label className="block text-sm">{t("Date")}</label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {/* Color pour collection uniquement */}
          {type === "collection" && (
            <div className="mt-4">
              <label className="block text-sm">{t("Color")}</label>
              <input
                type="color"
                className="w-full border h-10 p-2 rounded"
                value={color ? color : "#000000"}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <Dialog.Close className="bg-gray-300 px-4 py-2 rounded">
              {t("Cancel")}
            </Dialog.Close>
            <Dialog.Close
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t(
                type === "task"
                  ? "Add_the_Task"
                  : type === "collection"
                  ? "Add_the_List"
                  : "Add_the_Tab"
              )}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
