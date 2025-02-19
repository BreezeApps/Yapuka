import Database from "@tauri-apps/plugin-sql";
const db = new Database("sqlite:tasks.db");

export async function logChange(
  action: string,
  tableName: string,
  rowId: number | null,
  oldData: string | null,
  newData: string | null,
) {
  try {
    await db.execute(
        "INSERT INTO changelog (action, table_name, row_id, old_data, new_data) VALUES (?, ?, ?, ?, ?);",
        [action, tableName, rowId, oldData, newData]
      );
  } catch (error) {
    console.error('Error logging change:', error);
  }
}

export async function getLog() {
  try {
    const response = await db.execute(
        "SELECT * FROM changelog ORDER BY timestamp;"
      );
    return response
  } catch (error) {
    console.error('Error logging change:', error);
  }
}