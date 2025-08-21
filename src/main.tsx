import React from "react";
import ReactDOM from "react-dom/client";
import { LoadApp } from "./LoadApp";
import { LoadingProvider } from "./Hooks/useLoadingScreen";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadingProvider >
      <LoadApp />
    </LoadingProvider>
  </React.StrictMode>
);
