import Database from "@tauri-apps/plugin-sql";
import { Migration } from "../types/Migrations";
import { setupOptions } from "./setupOptions";

export class Migrations {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /* ==================== MIGRATIONS ===================== */
  migrations: Migration[] = [
    {
      from: "0",
      to: "0.1.0",
      migrate: async () => {
        await this.execAll([
          `CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL
          );`,
          `CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
          );`,
          `CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY,
            board_id INTEGER,
            names TEXT NOT NULL,
            color TEXT,
            FOREIGN KEY (board_id) REFERENCES boards(id)
              ON UPDATE CASCADE ON DELETE CASCADE
          );`,
          `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            collection_id INTEGER,
            task_order INTEGER NOT NULL,
            names TEXT,
            descriptions TEXT,
            due_date TEXT,
            status TEXT,
            FOREIGN KEY (collection_id) REFERENCES collections(id)
              ON UPDATE CASCADE ON DELETE CASCADE
          );`,
        ]);
      },
    },
    {
      from: "0.1.0",
      to: "0.8.0",
      migrate: async (db) => {
        const columns: { name: string }[] = await db.select(
          "PRAGMA table_info(boards);"
        );

        const hasColor = columns.some((col) => col.name === "color");
        if (!hasColor) {
          await db.execute("ALTER TABLE boards ADD COLUMN color TEXT;");
        }
      },
    },
  ];

  /* ==================== MIGRATION RUNNER ===================== */
  async runMigrations() {
    let currentVersion = await this.getCurrentDbVersion();
    let migrated = false;

    while (true) {
      const migration = this.migrations.find((m) => m.from === currentVersion);
      if (!migration) break;

      console.log(`Migration de ${migration.from} vers ${migration.to}`);
      await migration.migrate(this.db);
      await this.setDbVersion(migration.to);
      currentVersion = migration.to;
      migrated = true;
    }

    if (migrated) {
      console.log("Toutes les migrations ont été appliquées avec succès !");
    } else {
      console.log("Base de données déjà à jour.");
    }

    await setupOptions(this.db);
  }

  /* ==================== OPTIONS UTILS ===================== */
  async getCurrentDbVersion(): Promise<string> {
    try {
      const result = await this.getOptionByKey("version");
      return result || "0";
    } catch {
      return "0";
    }
  }

  async setDbVersion(version: string) {
    await this.updateOption("version", version);
  }

  async updateOption(key: string, newValue: string): Promise<void> {
    await this.db.execute(
      `INSERT OR REPLACE INTO options (id, key, value)
       VALUES ((SELECT id FROM options WHERE key = ?), ?, ?);`,
      [key, key, newValue]
    );
  }

  async getOptionByKey(key: string): Promise<string | null> {
    const result = await this.db.select<{ value: string }[]>(
      "SELECT value FROM options WHERE key = ?;",
      [key]
    );
    return result?.[0]?.value ?? null;
  }

  /* ==================== SQL HELPERS ===================== */
  private async execAll(queries: string[]) {
    for (const query of queries) {
      await this.db.execute(query);
    }
  }
}
