import { open } from "@tauri-apps/plugin-dialog";
import {copyFile, exists, create } from "@tauri-apps/plugin-fs";
import { join, appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store"
import { DatabaseService } from "./dbClass";
/**
 * This function allows the user to choose a folder to store a database, updating the
 * configuration and reloading the database if necessary.
 * @returns The function `chooseDbFolder` returns a `Promise` that resolves to a `string` representing
 * the selected folder path where the database will be stored. If the user cancels the folder selection
 * or an error occurs during the process, it returns `null`.
 */
export async function chooseDbFolder({ reloadDb, dbService }: { reloadDb: () => Promise<void>, dbService: DatabaseService }): Promise<string | null> {
  const config = await load("config.json")
  const prevPath = await getDbPath()
  const folder = await open({
    directory: true,
    multiple: false,
    defaultPath: await getDbFolder(),
    title: "Choisissez où stocker votre base de données Yfokon",
  });

  if (!folder) return null;

  await dbService.close()

  await config.set("dbFolder", folder)
  await config.save()

  if(!await exists(await join(folder, "Yfokon.yfdb"))) {
    await copyFile(prevPath, await join(folder, "Yfokon.yfdb"));
  }

  await reloadDb()

  return folder as string;
}

/**
 * This function retrieves the database folder path, creates it if it doesn't exist, and
 * returns the path.
 * @returns The `getDbFolder` function returns a Promise that resolves to a string. The function first
 * checks if the `dbFolder` value is null or undefined in the configuration. If it is, it sets the
 * `dbFolder` value to the result of `appConfigDir()`, saves the configuration, and creates a database
 * file named "Yfokon.yfdb" in the app's configuration directory
 */
export async function getDbFolder(): Promise<string> {
  const config = await load("config.json")
  const dbFolder = await config.get("dbFolder");
  if(dbFolder === null || dbFolder === undefined) {
    await config.set("dbFolder", await appConfigDir())
    await config.save()
    try {
      await create("Yfokon.yfdb", { baseDir: BaseDirectory.AppConfig })
    } catch (error) {
      console.warn("Db already exist")
    }
    return (await appConfigDir());
  }
  return dbFolder as string
}

/**
 * The function `getDbPath` returns the path to a database file named "Yfokon.yfdb" within a specified
 * folder.
 * @returns The function `getDbPath` is returning a Promise that resolves to the path of the database
 * file "Yfokon.yfdb" within the folder obtained from the `getDbFolder` function.
 */
export async function getDbPath(): Promise<string> {
  const folder = await getDbFolder();
  return await join(folder, "Yfokon.yfdb");
}
