// import React from "react"

import { onmodif, onmodifarea } from "@renderer/lib/function";
import { CreateListModal } from "@renderer/components/Modal/CreateListModal";
import { CreateTabModal } from "@renderer/components/Modal/CreateTabModal";
import { CreateTaskModal } from "@renderer/components/Modal/CreateTaskModal";
import { DescriptionModal } from "@renderer/components/Modal/DescriptionModal";
import { ModifyListModal } from "@renderer/components/Modal/ModifyListModal";
import { ModifyTabModal } from "@renderer/components/Modal/ModifyTabModal";
import { ModifyTaskModal } from "@renderer/components/Modal/ModifyTaskModal";

export function AllModal() {
  return (
    <>
      <CreateListModal />

      <CreateTaskModal />

      <ModifyTaskModal onmodif={onmodif} onmodifarea={onmodifarea} />

      <ModifyListModal onmodif={onmodif} />

      <DescriptionModal />

      <CreateTabModal />

      <ModifyTabModal />
    </>
  );
}
