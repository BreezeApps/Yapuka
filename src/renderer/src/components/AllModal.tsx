// import React from "react"

import { useModal } from "./Modal/ModalContext";
// import { onmodif, onmodifarea } from "@renderer/lib/function";
// import { CreateListModal } from "@renderer/components/Modal/CreateListModal";
// import { CreateTabModal } from "@renderer/components/Modal/CreateTabModal";
// import { CreateTaskModal } from "@renderer/components/Modal/CreateTaskModal";
// import { DescriptionModal } from "@renderer/components/Modal/DescriptionModal";
import { ModifyListModal } from "@renderer/components/Modal/ModifyListModal";
import { ModifyTabModal } from "@renderer/components/Modal/ModifyTabModal";
import { ModifyTaskModal } from "./Modal/ModifyTaskModal";
// import { ModifyTaskModal } from "@renderer/components/Modal/ModifyTaskModal";

export function AllModal() {
  const { addModal, removeModal } = useModal();

  const openModifyListModal = () => {
    const modalId = addModal(
      <ModifyListModal
        visible={true}
        onClose={() => removeModal(modalId)}
        initialData={{ id: "", name: "John Doe", color: "#ffffff" }}
      />
    );
  };

  const openModifyTabModal = () => {
    const modalId = addModal(
      <ModifyTabModal
        visible={true}
        onClose={() => removeModal(modalId)}
        initialData={{ name: "John Doe" }}
      />
    );
  };

  const openModifyTaskModal = () => {
    const modalId = addModal(
      <ModifyTaskModal
        visible={true}
        onClose={() => removeModal(modalId)}
        initialData={{taskId: "", listId: "", name: "", date: "", description: ""}}
      />
    );
  };

  return (
    <>
      <button onClick={openModifyListModal}>Open Form Modal</button>
      <button onClick={openModifyTabModal}>Open Form Modal</button>
      <button onClick={openModifyTaskModal}>Open Form Modal</button>
      {/* <CreateListModal />

      <CreateTaskModal />

      <ModifyTaskModal onmodif={onmodif} onmodifarea={onmodifarea} />

      <ModifyListModal onmodif={onmodif} />

      <DescriptionModal />

      <CreateTabModal />

      <ModifyTabModal /> */}
    </>
  );
}
