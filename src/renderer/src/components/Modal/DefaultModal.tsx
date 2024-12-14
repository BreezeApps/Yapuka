import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  titleI18nId: string;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ visible, onClose, titleI18nId, children }) => {
  if (!visible) return null;

  // Nettoyage du DOM en supprimant les listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        id="modal"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-0 right-0 top-0 z-[155] hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
      >
        <div className="relative max-h-full w-full max-w-md p-4">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white"
                data-i18n={titleI18nId}
              ></h3>
              <button
                type="button"
                id="close-modal"
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only" data-i18n="Close_Modal"></span>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;