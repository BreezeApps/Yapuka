import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export function TaskModal({ onCreate }: { onCreate: (name: string, description: string) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name) return;
    onCreate(name, description);
    setName("");
    setDescription("");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-blue-500 text-white px-4 py-2 rounded">Créer une tâche</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">Nouvelle tâche</Dialog.Title>
          
          <div className="mt-4">
            <label className="block text-sm">Nom</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Dialog.Close className="bg-gray-300 px-4 py-2 rounded">Annuler</Dialog.Close>
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Créer</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
