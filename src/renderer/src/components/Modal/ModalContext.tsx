import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalConfig = {
  id: string; // Identifiant unique pour chaque modal
  content: ReactNode; // Le contenu de la modal
};

type ModalContextType = {
  addModal: (content: ReactNode) => string; // Ajoute une modal
  removeModal: (id: string) => void; // Supprime une modal
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  // Ajout d'une nouvelle modal
  const addModal = (content: ReactNode): string => {
    const id = `modal_${Date.now()}`;
    setModals((prev) => [...prev, { id, content }]);
    return id;
  };

  // Suppression d'une modal spÃ©cifique
  const removeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ addModal, removeModal }}>
      {children}
      {/* Affiche toutes les modals dynamiques */}
      {modals.map(({ id, content }) => (
        <div key={id}>{content}</div>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};