import Database from "@tauri-apps/plugin-sql";
import { Migration } from "../types/Migrations";
import { setupOptions } from "../setupOptions";

export class Migrations {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /* ==================== MIGRATIONS ===================== */

  migrations: Migration[] = [
    {
      from: "0",
      to: "1",
      migrate: async (db) => {
        await db.execute(
          "CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL);"
        );
        await db.execute(
            "CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, name TEXT NOT NULL);"
        );
        await db.execute(
            "CREATE TABLE IF NOT EXISTS collections (id INTEGER PRIMARY KEY, board_id INTEGER, names TEXT NOT NULL, color TEXT, FOREIGN KEY (board_id) REFERENCES boards(id) ON UPDATE CASCADE ON DELETE CASCADE);"
        );
        await db.execute(
            "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, collection_id INTEGER, task_order INTEGER NOT NULL, names TEXT, descriptions TEXT, due_date TEXT, status TEXT, FOREIGN KEY (collection_id) REFERENCES collections(id) ON UPDATE CASCADE ON DELETE CASCADE);"
        );
      },
    },
  ];

  async runMigrations() {
    let currentVersion = await this.getCurrentDbVersion();

    for (const migration of this.migrations) {
      if (migration.from === currentVersion) {
        /* console.log(`Migration de ${migration.from} vers ${migration.to}`); */
        await migration.migrate(this.db);
        await this.setDbVersion(migration.to);
        currentVersion = migration.to;
      }
    }

    await setupOptions(this.db)

    console.log("Base de données à jour !");
  }

  async getCurrentDbVersion(): Promise<string> {
    try {
      const result = await this.getOptionByKey("version");
      return result || "0";
    } catch {
      return "0"
    }
  }

  async setDbVersion(version: string) {
    await this.updateOption("version", version);
  }

  async updateOption(key: string, newValue: string): Promise<void> {
    await this.db?.execute("UPDATE options SET value = ? WHERE key = ?;", [
      newValue,
      key,
    ]);
  }

  async getOptionByKey(key: string): Promise<string | null> {
    const result: { value: string }[] = await this.db?.select(
      "SELECT value FROM options WHERE key = ?;",
      [key]
    );
    return result.length > 0 ? result[0].value : null;
  }
}
