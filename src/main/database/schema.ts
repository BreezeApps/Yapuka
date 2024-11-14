import { sqliteTable, int, text } from "drizzle-orm/sqlite-core"

export const optionsTable = sqliteTable("options", {
    id: int().primaryKey(),
    key: text().unique().notNull(),
    value: text().notNull()
})

export const boardsTable = sqliteTable("boards", {
    id: int().primaryKey(),
    name: text().notNull()
})

export const collectionsTable = sqliteTable("collections", {
    id: int().primaryKey(),
    boardId: int("board_id").references(() => boardsTable.id, { onUpdate: "cascade", onDelete: "cascade" }),
    name: text().notNull(),
    color: int()
})

export const tasksTable = sqliteTable("tasks", {
    id: int().primaryKey(),
    collectionId: int("collection_id").references(() => collectionsTable.id, {  onUpdate: "cascade", onDelete: "cascade" }),
    order: int().notNull(),
    name: text(),
    description: text(),
    dueDate: text()
})