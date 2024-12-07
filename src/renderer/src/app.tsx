import {
  closeNotification,
  downloadUpdate,
  go_config_window,
  restartApp,
} from "@renderer/lib/function";

import { AllModal } from "@renderer/components/AllModal";
import { translate } from "./lib/i18n";

const transl = await translate("Language_Name")
function App() {
  return (
    <>
      <h1>{transl}</h1>
      <div id="notification" className="hidden">
        <p id="message"></p>
        <button
          id="close-button"
          data-i18n="Close"
          onClick={closeNotification}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        ></button>
        <button
          id="download-button"
          data-i18n="update_btn_download"
          onClick={downloadUpdate}
          className="hidden rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        ></button>
        <button
          id="restart-button"
          data-i18n="update_btn_restart"
          onClick={restartApp}
          className="hidden rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        ></button>
      </div>
      <div id="blur" className="absolute z-[150] hidden h-full w-full"></div>
      <div
        id="context-menu"
        className="absolute z-[100] hidden border bg-white shadow-md"
      >
        <button
          id="edit-button"
          className="w-full px-4 py-2 text-left hover:bg-gray-200"
        >
          Modifier
        </button>
      </div>
      <div className="fixed left-0 top-0 flex w-full justify-between py-4 text-center shadow-lg">
        <div id="tabs"></div>
        <button
          id="add-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          data-i18n="Add_a_Tab"
        ></button>
        <button
          id="modify-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          data-i18n="Modify_a_Tab"
        ></button>
        <button
          id="delete-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          data-i18n="Delete_a_Tab"
        ></button>
        <button
          id="add-list-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          data-i18n="Add_a_List"
        ></button>
        <button
          id="print-tab-btn"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          type="button"
          data-i18n="Print"
        ></button>
        <span
          onClick={go_config_window}
          className="flex h-7 w-7 cursor-pointer flex-row-reverse justify-self-end"
        >
          <img src="../../build/img/icons/config.svg" alt="" />
        </span>
      </div>
      <div id="lists-container" className="mt-16 w-full"></div>

      <AllModal />

      <img
        src="./src/public/CC BY-NC-SA.png"
        alt="Creative Commons BY-NC-SA"
        className="absolute bottom-0 right-0 z-50"
        width="100"
      />

      {/* <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script> */}
      {/* <script type="module" src="src/lib/get_dirname.ts"></script> */}
    </>
  )
}
export default App;
