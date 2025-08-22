import Database from "@tauri-apps/plugin-sql";

/**
 * The `Migration` type in TypeScript represents a database migration with a source version, target
 * version, and a function to migrate the database.
 * @property {string} from - The `from` property in the `Migration` type represents the current version
 * of the database schema that the migration will start from.
 * @property {string} to - The `to` property in the `Migration` type represents the version that the
 * database should be migrated to. This version typically corresponds to a specific schema or data
 * structure that the database should be updated to.
 * @property migrate - The `migrate` property in the `Migration` type is a function that takes a
 * `Database` object as a parameter and returns a `Promise<void>`. This function is responsible for
 * performing the necessary database migration operations to upgrade the database schema from the
 * `from` version to the `to`
 */
export type Migration = {
  from: string;
  to: string;
  migrate: (db: Database) => Promise<void>;
};