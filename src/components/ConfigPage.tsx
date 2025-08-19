import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage, getLanguages } from "../lib/i18n";
import { useEffect, useState } from "react";
import { DatabaseService } from "../lib/db/dbClass";
import { message } from "@tauri-apps/plugin-dialog";
import FeatureComingSoon from "./FeatureComingSoon";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { chooseDbFolder, getDbPath } from "@/lib/db/dbManager";

type props = {
  dbService: DatabaseService
  show: boolean;
  setShow: (show: boolean) => void;
};

export function ConfigPage({ dbService, show, setShow }: props) {
  const [checkedSync, setCheckedSync] = useState(false);
  const [dbPath, setDbPath] = useState("")
  const [urlSync, setUrlSync] = useState<string | null>("");
  const [firstReload, setFirstReload] = useState<boolean>(true);
  const { t } = useTranslation();
  const languages = getLanguages();

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
      setDbPath(await getDbPath())
      setCheckedSync(
        (await dbService.getOptionByKey("syncActive")) === "true" ? true : false
      );
      setUrlSync(await dbService.getOptionByKey("syncUrl"));
    }
    firstload();
  }, [firstReload]);

  useEffect(() => {
    async function updateOptions() {
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
      className={`z-[49] top-0 h-full w-full absolute bg-black/50`}
    >
      <Button onClick={() => setShow(false)} variant={"ghost"}>
        <img className="h-6 ml-2" src="/icons/fermer.svg" />
      </Button>
      {/* <button
        className={`absolute text-2xl ml-2`}
        onClick={() => setShow(false)}
      >
        <img className="h-6 dark:invert" src="/icons/fermer.svg" />
      </button> */}
      <h1 className={`mb-8 text-center text-3xl font-bold dark:text-white`}>
        {t("app_config")}
      </h1>
      <form
        name="config"
        className="space-y-6 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:p-8 lg:p-10"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="theme">{t("theme")}</Label>
            <Select onValueChange={(value) => changeTheme(value)} defaultValue={localStorage.theme}>
              <SelectTrigger>
                <SelectValue placeholder={"Theme"}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("light_theme")}</SelectItem>
                <SelectItem value="dark">{t("dark_theme")}</SelectItem>
                <SelectItem value="none">{t("system_theme")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="language"
            >
              {t("Language")}
            </Label>
            <Select onValueChange={(value) => changeLanguage(value)} defaultValue={getCurrentLanguage()}>
              <SelectTrigger>
                <SelectValue placeholder={"Languages"} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                <SelectItem key={lang.key} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {t("Feature_Toggles")}
          </h2>
          <FeatureComingSoon message={t("Future_Function")}>
            <div className="space-y-2 overflow-hidden">
              <Label
                htmlFor="Test"
              >
                Activer Sync PHP
              </Label>
              <Input
                type="checkbox"
                checked={checkedSync}
                onChange={(e) => {
                  message(t("Future_Function"), { kind: "warning" });
                  e.target.checked = false;
                  // setCheckedSync(e.target.checked);
                }}
                name="Test"
                id="tt"
              />
              <Label
                htmlFor="url"
              >
                PHP Sync URL
              </Label>
              <Input
                disabled={!checkedSync}
                placeholder="https://example.com/"
                value={urlSync === null ? "" : urlSync}
                onChange={(e) => setUrlSync(e.target.value)}
                type="text"
                name="url"
                id="url"
              />
            </div>
          </FeatureComingSoon>
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
              <Input value={dbPath} disabled={true} />
              <Button onClick={() => chooseDbFolder()}>Placer la base de donnes</Button>
            </div>
            <div id="backup-dir" className="flex space-x-4">
              <Button
                type="button"
                id="backup-button"
                onClick={async () => {
                  const isValid = await dbService.createBackup();
                  if (isValid) {
                    message(t("Backup_Success_Title"), {
                      title: t("Backup_Success"),
                      kind: "info",
                    });
                  } else {
                    message(t("Backup_Error_Title"), {
                      title: t("Backup_Error"),
                      kind: "error",
                    });
                  }
                }}
              >
                {t("Make_Backup")}
              </Button>
              {/* <button
                type="button"
                id="backup-button"
                onClick={async () => {
                  const isValid = await dbService.createBackup()
                  if (isValid) {
                    message(t("Backup_Success_Title"), {
                      title: t("Backup_Success"),
                      kind: "info",
                    })
                  } else {
                    message(t("Backup_Error_Title"), {
                      title: t("Backup_Error"),
                      kind: "error",
                    })
                  }
                }}
                className="rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors duration-300 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t("Make_Backup")}
              </button> */}
              <Button
                type="button"
                id="backup-import-button"
                // onClick={async () => {console.log(await dbService.importBackup())}}
                onClick={() => {
                  message(t("Future_Function"), { kind: "warning" });
                }}
              >
                {t("Backup_Import")}
              </Button>
              {/* <button
                type="button"
                id="backup-import-button"
                // onClick={async () => {console.log(await dbService.importBackup())}}
                onClick={() => {
                  message(t("Future_Function"), { kind: "warning" });
                }}
                className="rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors duration-300 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t("Backup_Import")}
              </button> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
