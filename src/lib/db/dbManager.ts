import { open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile, copyFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory, join, appConfigDir } from "@tauri-apps/api/path";

export async function chooseDbFolder({ reloadDb }: { reloadDb: () => Promise<void> }): Promise<string | null> {
  const prevPath = await getDbPath()
  const folder = await open({
    directory: true,
    multiple: false,
    defaultPath: await getDbFolder(),
    title: "Choisissez où stocker votre base de données Yapuka",
  });

  if (!folder) return null;

  // Sauvegarder le chemin dans la config interne
  await writeTextFile(
    "db_config.json",
    JSON.stringify({ dbFolder: folder }),
    { baseDir: BaseDirectory.AppConfig }
  );

  await copyFile(prevPath, await join(folder, "yapuka.db"));

  await reloadDb()

  return folder as string;
}

export async function getDbFolder(): Promise<string> {
  try {
    const configContent = await readTextFile("db_config.json", { baseDir: BaseDirectory.AppConfig });
    const { dbFolder } = JSON.parse(configContent);
    return dbFolder;
  } catch {
    await writeTextFile(
      "db_config.json",
      JSON.stringify({ dbFolder: await appConfigDir() }),
      { baseDir: 13 } // AppData sur Windows, ~/.config sur Linux
    );
    return await appConfigDir();
  }
}

export async function getDbPath(): Promise<string> {
  const folder = await getDbFolder();
  return await join(folder, "yapuka.db");
}
