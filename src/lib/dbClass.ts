import Database from "@tauri-apps/plugin-sql";

export class DatabaseService {
  private db: Database;

  constructor() {
    this.db = new Database("sqlite:tasks.db");
  }

  async init() {
    await this.db.execute("PRAGMA foreign_keys = ON;");
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

  /* ==================== BOARDS ==================== */
  async createBoard(name: string): Promise<number> {
    await this.db.execute("INSERT INTO boards (name) VALUES (?);", [name]);
    const result: { id: number }[] = await this.db.select("SELECT last_insert_rowid() AS id;");
    return result[0].id;
  }

  async updateBoard(id: number, newName: string): Promise<void> {
    await this.db.execute("UPDATE boards SET name = ? WHERE id = ?;", [newName, id]);
  }

  async removeBoard(id: number): Promise<void> {
    await this.db.execute("DELETE FROM boards WHERE id = ?;", [id]);
  }

  async getBoardById(id: number): Promise<{ id: number; name: string } | null> {
    const result: { id: number, name: string }[] = await this.db.select("SELECT * FROM boards WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllBoards(): Promise<{ id: number; name: string }[]> {
    return await this.db.select("SELECT * FROM boards;");
  }

  /* ==================== COLLECTIONS ==================== */
  async createCollection(boardId: number, name: string, color?: string): Promise<number> {
    await this.db.execute("INSERT INTO collections (board_id, names, color) VALUES (?, ?, ?);", [boardId, name, color ?? null]);
    const result: { id: number }[] = await this.db.select("SELECT last_insert_rowid() AS id;");
    return result[0].id;
  }

  async updateCollection(id: number, newName: string, newColor?: string): Promise<void> {
    await this.db.execute("UPDATE collections SET names = ?, color = ? WHERE id = ?;", [newName, newColor ?? null, id]);
  }

  async removeCollection(id: number): Promise<void> {
    await this.db.execute("DELETE FROM collections WHERE id = ?;", [id]);
  }

  async getCollectionById(id: number): Promise<{ id: number; board_id: number; names: string; color: number | null } | null> {
    const result: { id: number; board_id: number; names: string; color: number | null }[] = await this.db.select("SELECT * FROM collections WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllCollections(): Promise<{ id: number; board_id: number; names: string; color: string | null }[]> {
    return await this.db.select("SELECT * FROM collections;");
  }

  async getCollectionsByBoard(boardId: number): Promise<{ id: number; names: string; color: number | null }[]> {
    return await this.db.select("SELECT * FROM collections WHERE board_id = ?;", [boardId]);
  }

  /* ==================== TASKS ==================== */
  async createTask(collectionId: number, order: number, name?: string, description?: string, dueDate?: string): Promise<number> {
    await this.db.execute(
      "INSERT INTO tasks (collection_id, task_order, names, descriptions, due_date) VALUES (?, ?, ?, ?, ?);",
      [collectionId, order, name ?? null, description ?? null, dueDate ?? null]
    );
    const result: { id: number }[] = await this.db.select("SELECT last_insert_rowid() AS id;");
    return result[0].id;
  }

  async updateTask(id: number, newName?: string, newDescription?: string, newDueDate?: string): Promise<void> {
    await this.db.execute(
      "UPDATE tasks SET names = ?, descriptions = ?, due_date = ? WHERE id = ?;",
      [newName ?? null, newDescription ?? null, newDueDate ?? null, id]
    );
  }

  async updateTaskOrder(id: number, order: number, collection_id: number): Promise<void> {
    await this.db.execute(
      "UPDATE tasks SET task_order = ?, collection_id = ? WHERE id = ?;",
      [order, collection_id, id]
    );
  }

  async removeTask(id: number): Promise<void> {
    await this.db.execute("DELETE FROM tasks WHERE id = ?;", [id]);
  }

  async getTaskById(id: number): Promise<{ id: number; collection_id: number; task_order: number; names: string | null; descriptions: string | null; due_date: string | null } | null> {
    const result: { id: number; collection_id: number; task_order: number; names: string | null; descriptions: string | null; due_date: string | null }[] = await this.db.select("SELECT * FROM tasks WHERE id = ?;", [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getAllTasks(): Promise<{ id: number; collection_id: number; task_order: number; names: string | null; descriptions: string | null; due_date: string | null }[]> {
    return await this.db.select("SELECT * FROM tasks ORDER BY task_order;");
  }

  async getTasksByCollection(collectionId: number): Promise<{ id: number; task_order: number; names: string | null; descriptions: string | null; due_date: string | null }[]> {
    return await this.db.select("SELECT * FROM tasks WHERE collection_id = ? ORDER BY task_order;", [collectionId]);
  }
}
