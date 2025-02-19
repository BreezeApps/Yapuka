import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage, getLanguages } from "../lib/i18n";
import { useEffect, useState } from "react";
import { DatabaseService } from "../lib/dbClass";

type props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export function ConfigPage({ show, setShow }: props) {
  const [checkedSync, setCheckedSync] = useState(false);
  const [urlSync, setUrlSync] = useState<string | null>("");
  const [firstReload, setFirstReload] = useState<boolean>(true);
  const { t } = useTranslation();
  const languages = getLanguages();
  const dbService = new DatabaseService()

  function changeTheme(theme: string) {
    if (theme === "none") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme ?? "system";
    }
  }

  useEffect(() => {
    if (!firstReload) return;
    setFirstReload(false);
    async function firstload() {
      await dbService.init();
      setCheckedSync(
        (await dbService.getOptionByKey("syncActive")) === "true" ? true : false
      );
      setUrlSync(await dbService.getOptionByKey("syncUrl"));
    }
    firstload();
  }, [firstReload]);

  useEffect(() => {
    async function updateOptions() {
      await dbService.init();
      await dbService.updateOption(
        "syncActive",
        checkedSync === true ? "true" : "false"
      );
      await dbService.updateOption("syncUrl", urlSync === null ? "" : urlSync);
    }
    updateOptions();
  }, [checkedSync, urlSync]);

  return (
    <div
      hidden={!show}
      className={`z-[2000] h-full w-full absolute bg-black/50`}
    >
      <button
        className={`absolute text-2xl ml-2`}
        onClick={() => setShow(false)}
      >
        <img className="h-6 dark:invert" src="/icons/fermer.svg" />
      </button>
      <h1 className={`mb-8 text-center text-3xl font-bold dark:text-white`}>
        {t("app_config")}
      </h1>
      <form
        name="config"
        className="space-y-6 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              {t("theme")}
            </label>
            <select
              id="theme"
              name="theme"
              onChange={(e) => changeTheme(e.target.value)}
              defaultValue={localStorage.theme}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="light">{t("light_theme")}</option>
              <option value="dark">{t("dark_theme")}</option>
              <option value="none">{t("system_theme")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              {t("Language")}
            </label>
            <select
              id="language"
              name="language"
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={getCurrentLanguage()}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {languages.map((lang) => (
                <option key={lang.key} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {t("Feature_Toggles")}
          </h2>
          <div className="space-y-2">
            <label htmlFor="Test" className="block text-sm font-medium text-gray-700 dark:text-white" >Activer Sync PHP</label>
            <input
              type="checkbox"
              checked={checkedSync}
              onChange={(e) => {
                setCheckedSync(e.target.checked);
              }}
              name="Test"
              id="tt"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-white">PHP Sync URL</label>
            <input
              disabled={!checkedSync}
              placeholder="https://example.com/"
              value={urlSync === null ? "" : urlSync}
              onChange={(e) => setUrlSync(e.target.value)}
              type="text"
              name="url"
              id="url"
              className="text-sm overflow-x-scroll mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {t("Advanced_Settings")}
          </h2>
          <div>
            <div className="space-y-2">
              {/*<button
                type="button"
                id="plugin-button"
                // onClick="go_plugin_window()"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                {t("GoPlugin")}
              </button>*/}
              <button
                id="DB_file"
                name="DB_file"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                {t("data_file")}
              </button>
              <input
                type="text"
                disabled
                name="data-link"
                id="data_link"
                className="text-sm overflow-x-scroll mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div id="backup-dir" className="flex space-x-4">
              <button
                type="button"
                id="backup-button"
                className="rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors duration-300 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t("Make_Backup")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
