import { open } from "@tauri-apps/plugin-dialog";
import {copyFile, exists, create } from "@tauri-apps/plugin-fs";
import { join, appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store"
import { DatabaseService } from "./dbClass";

const config = await load("config.json")

export async function chooseDbFolder({ reloadDb, dbService }: { reloadDb: () => Promise<void>, dbService: DatabaseService }): Promise<string | null> {
  const prevPath = await getDbPath()
  const folder = await open({
    directory: true,
    multiple: false,
    defaultPath: await getDbFolder(),
    title: "Choisissez où stocker votre base de données Yapuka",
  });

  if (!folder) return null;

  await dbService.close()

  await config.set("dbFolder", folder)
  await config.save()

  if(!await exists(await join(folder, "yapuka.yapdb"))) {
    await copyFile(prevPath, await join(folder, "yapuka.yapdb"));
  }

  await reloadDb()

  return folder as string;
}

export async function getDbFolder(): Promise<string> {
  const dbFolder = await config.get("dbFolder");
  if(dbFolder === null || dbFolder === undefined) {
    await config.set("dbFolder", await appConfigDir())
    await config.save()
    try {
      await create("yapuka.yapdb", { baseDir: BaseDirectory.AppConfig })
    } catch (error) {
      console.warn("Db already exist")
    }
    return (await appConfigDir());
  }
  return dbFolder as string
}

export async function getDbPath(): Promise<string> {
  const folder = await getDbFolder();
  return await join(folder, "yapuka.yapdb");
}
