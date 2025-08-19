import Database from "@tauri-apps/plugin-sql";

export type Migration = {
  from: string;
  to: string;
  migrate: (db: Database) => Promise<void>;
};