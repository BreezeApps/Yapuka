import React, { createContext, useContext, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Chargement...");

  const showLoading = (msg?: string) => {
    if (msg) setMessage(msg);
    setVisible(true);
  };

  const hideLoading = () => setVisible(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {visible && <LoadingScreen message={message} />}
    </LoadingContext.Provider>
  );
}

export function useLoadingScreen() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoadingScreen doit être utilisé dans LoadingProvider");
  return context;
}
