// import React from "react"

export function DescriptionModal() {
    return (
        <div
        id="description-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        className="fixed left-0 right-0 top-0 z-[155] hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
      >
        <div className="relative max-h-full w-full max-w-2xl p-4">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <h3
                id="description-title-modal"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              ></h3>
              <button
                id="close-description-modal"
                type="button"
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
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
                <span className="sr-only" data-i18n="Close_Modal">
                  Fermer la fenêtre modale
                </span>
              </button>
            </div>
            <div className="space-y-4 p-4 md:p-5">
              <p
                id="description-text-modal"
                className="text-base leading-relaxed text-gray-500 dark:text-gray-400"
              ></p>
            </div>
            <div className="flex items-center rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
              <button
                id="close-description-modal-foot"
                type="button"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                data-i18n="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
    )
}