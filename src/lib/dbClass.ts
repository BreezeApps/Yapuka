import Database from "@tauri-apps/plugin-sql";
import * as path from '@tauri-apps/api/path';
import { save, open } from "@tauri-apps/plugin-dialog";
import { copyFile, rename } from '@tauri-apps/plugin-fs';

import { Board } from "./types/Board";
import { Collection } from "./types/Collection";
import { Task } from "./types/Task";
import { setupOptions } from "./setupOptions";

type Migration = {
  from: string;
  to: string;
  migrate: (db: Database) => Promise<void>;
};

export class DatabaseService {
  private db: Database;

  constructor() {
    this.db = new Database("sqlite:tasks.db");
  }

  async init() {
    await this.db.execute("PRAGMA foreign_keys = ON;");
    await this.runMigrations()
  }

  async createBackup(): Promise<boolean> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
    const filePath = await save({
      defaultPath: (await path.downloadDir()) + "/" + `task_backup_${date}.yapdb`,
    });
    if (!filePath) return false;
    try {
      await this.db.execute(`VACUUM INTO '${filePath.replace(/\.yapdb$/, ".db")}';`);
      rename(filePath.replace(/\.yapdb$/, ".db"), filePath.replace(/\.db$/, ".yapdb"));
    } catch (error) {
      console.error("Error creating backup:", error);
      return false;
    }
    return true;
  }

  async importBackup(): Promise<boolean> {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Yapuka DataBase",
          extensions: ["yapdb"],
        },
      ],
    });
    if (!file) return false;

    try {
      copyFile(file === null ? "" : file, await path.join(await path.appConfigDir(), "backup.db"));
    } catch (error) {
      console.error("Error importing backup:", error);
      return false;
    }
    try {
      await this.db.execute(`ATTACH DATABASE '${await path.join(await path.appConfigDir(), "backup.db")}' AS 'backup';`);
      // await this.db.execute("INSERT OR REPLACE INTO boards SELECT * FROM backup.boards;");
      // await this.db.execute("INSERT OR REPLACE INTO collections SELECT * FROM backup.collcetions;");
      // await this.db.execute("INSERT OR REPLACE INTO tasks SELECT * FROM backup.tasks;");
      console.log(await this.db.execute("SELECT * FROM backup.boards;"));
      await this.db.execute("DETACH DATABASE backup;");
      // await this.db.execute("VACUUM;");
    } catch (error) {
      console.error("Error importing backup:", error);
      return false;
    }
    return true
  }

  async createDbBase(): Promise<void> {
    setupOptions()
    this.createBoard({ id: 0, name: "Premiere Onglet" });
    this.createBoard({ id: 0, name: "Deuxieme Onglet" });
    this.createCollection({ id: 0, board_id: 0, names: "Premiere Liste", color: "" })
    this.createCollection({ id: 0, board_id: 0, names: "Deuxieme Liste", color: "" })
    this.createTask({ id: 0, collection_id: 0, names: "Premiere Tache", due_date: new Date(), status: "pending", task_order: 0, descriptions: "Ceci est la premiere tache" })
    this.createTask({ id: 0, collection_id: 0, names: "Deuxieme Tache", due_date: new Date(), status: "pending", task_order: 0, descriptions: "Ceci est la deuxieme tache" })
  }

  /* ==================== OPTIONS ==================== */
  async createOption(key: string, value: string): Promise<void> {
    await this.db.execute("INSERT INTO options (key, value) VALUES (?, ?);", [key, value]);
  }

  async updateOption(key: string, newValue: string): Promise<void> {
    await this.db.execute("UPDATE options SET value = ? WHERE key = ?;", [newValue, key]);
  }

  async removeOption(key: string): Promise<void> {
    await this.db.execute("DELETE FROM options WHERE key = ?;", [key]);
  }

  async getOptionByKey(key: string): Promise<string | null> {
    const result: { value: string }[] = await this.db.select("SELECT value FROM options WHERE key = ?;", [key]);
    return result.length > 0 ? result[0].value : null;
  }

  async getAllOptions(): Promise<{ key: string; value: string }[]> {
    return await this.db.select("SELECT * FROM options;");
  }

  async getCurrentDbVersion(): Promise<string> {
    const result = await this.getOptionByKey("version");
    return result || "1";
  };
    
  async setDbVersion(version: string) {
    await this.updateOption("version", version);
  };

  /* ==================== BOARDS ==================== */
  async createBoard(board: Board): Promise<void> {
    await this.db.execute("INSERT INTO boards (name) VALUES (?);", [board.name]);
  }

  async updateBoard(board: Board): Promise<void> {
    await this.db.execute("UPDATE boards SET name = ? WHERE id = ?;", [board.name, board.id]);
  }

  async removeBoard(id: number): Promise<void> {
    await this.db.execute("DELETE FROM boards WHERE id = ?;", [id]);
  }

  async getBoardById(id: number): Promise<Board | null> {
    const result: Board[] = await this.db.select("SELECT * FROM boards WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllBoards(): Promise<Board[]> {
    return await this.db.select("SELECT * FROM boards;");
  }

  /* ==================== COLLECTIONS ==================== */
  async createCollection(collection: Collection): Promise<void> {
    await this.db.execute("INSERT INTO collections (board_id, names, color) VALUES (?, ?, ?);", [collection.board_id, collection.names, collection.color ?? null]);
  }

  async updateCollection(collection: Collection): Promise<void> {
    await this.db.execute("UPDATE collections SET names = ?, color = ? WHERE id = ?;", [collection.names, collection.color ?? null, collection.id]);
  }

  async removeCollection(id: number): Promise<void> {
    await this.db.execute("DELETE FROM collections WHERE id = ?;", [id]);
  }

  async getCollectionById(id: number): Promise<Collection | null> {
    const result: Collection[] = await this.db.select("SELECT * FROM collections WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllCollections(): Promise<Collection[]> {
    return await this.db.select("SELECT * FROM collections;");
  }

  async getCollectionsByBoard(boardId: number): Promise<Collection[]> {
    return await this.db.select("SELECT * FROM collections WHERE board_id = ?;", [boardId]);
  }

  /* ==================== TASKS ==================== */
  async createTask(task: Task): Promise<void> {
    await this.db.execute(
      "INSERT INTO tasks (collection_id, task_order, names, descriptions, due_date, status) VALUES (?, ?, ?, ?, ?, ?);",
      [task.collection_id, task.task_order, task.names ?? null, task.descriptions ?? null, task.due_date ?? null, "pending"]
    );
  }

  async updateTask(task: Task): Promise<void> {
    await this.db.execute(
      "UPDATE tasks SET names = ?, descriptions = ?, due_date = ?, status = ? WHERE id = ?;",
      [task.names ?? null, task.descriptions ?? null, task.due_date ?? null, task.status ?? null, task.id]
    );
  }

  async updateTaskOrder(task: Task): Promise<void> {
    await this.db.execute(
      "UPDATE tasks SET task_order = ?, collection_id = ? WHERE id = ?;",
      [task.task_order, task.collection_id, task.id]
    );
  }

  async removeTask(id: number): Promise<void> {
    await this.db.execute("DELETE FROM tasks WHERE id = ?;", [id]);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const result: Task[] = await this.db.select("SELECT * FROM tasks WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.db.select("SELECT * FROM tasks ORDER BY task_order;");
  }

  async getTasksByCollection(collectionId: number): Promise<Task[]> {
    return await this.db.select("SELECT * FROM tasks WHERE collection_id = ? ORDER BY task_order;", [collectionId]);
  }

  /* ==================== MIGRATIONS ==================== */

  migrations: Migration[] = [
    {
      from: "0.1.0",
      to: "1",
      migrate: async (db) => {
        await db.execute("ALTER TABLE tasks ADD COLUMN status TEXT DEFAULT 'pending'");
      },
    }
  ];

  async runMigrations() {
    let currentVersion = await this.getCurrentDbVersion();

    for (const migration of this.migrations) {
      if (migration.from === currentVersion) {
        console.log(`Migration de ${migration.from} vers ${migration.to}`);
        await migration.migrate(this.db);
        await this.setDbVersion(migration.to);
        currentVersion = migration.to;
      }
    }

    console.log("Base de données à jour !");
  };
}