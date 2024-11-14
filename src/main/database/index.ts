import * as schema from "./schema"
import path from "node:path"
import { app } from "electron"
import { drizzle } from "drizzle-orm/libsql"
import { eq } from "drizzle-orm"
import { pathExists, mkdir, createFile, readJSON } from "fs-extra"

type DataSourceJson = {
    path: string
}

const appBasePath = path.join(app.getAppPath(), `${app.getName()}_Data`)
if(!(await pathExists(appBasePath))) {
    await mkdir(appBasePath)
}

const dataSourcePath = path.join(appBasePath, "data_source.json")
if(!(await pathExists(dataSourcePath))) {
    await createFile(appBasePath)
}

const dataSource = await readJSON(dataSourcePath) as DataSourceJson
const databaseURL = path.join(dataSource?.path ?? appBasePath, "local.db")

const db = drizzle(databaseURL, { schema })

type Options = typeof schema.optionsTable.$inferInsert

export const addOption = async (option: Options) => {
    return await db.insert(schema.optionsTable).values(option)
}

export const getOption = async (key: string) => {
    return await db.select({ key: schema.optionsTable.key, value: schema.optionsTable.value })
        .from(schema.optionsTable)
        .where(eq(schema.optionsTable.key, key))
        .get()
}

export const setOption = async (key: string, value: any ) => {
    return await db.update(schema.optionsTable)
        .set({ value: value.toString() })
        .where(eq(schema.optionsTable.key, key))
        .get()
}

export const removeOption = async (key: string ) => {
    return await db.delete(schema.optionsTable)
        .where(eq(schema.optionsTable.key, key))[0]
}

export const getPreferredPositionX = async () => {
    return getOption("preferedPositionX")
}

export const setPreferredPositionX = async (newPreferredPositionX: number ) => {
    return setOption("preferredPositionX", newPreferredPositionX)
}

export const getPreferredPositionY = async () => {
    return getOption("preferredPositionY")
}

export const setPreferredPositionY = async (newPreferredPositionY: number ) => {
    return setOption("preferredPositionY", newPreferredPositionY)
}

export const getPreferredWidthResolution = async () => {
    return getOption("preferredWidthResolution")
}

export const setPreferredWidthResolution = async (newPreferredWidthResolution: number ) => {
    return setOption("preferredWidthResolution", newPreferredWidthResolution)
}

export const getPreferredHeightResolution = async () => {
    return getOption("preferredHeight")
}

export const setPreferredHeightResolution = async (newPreferredHeightResolution: number ) => {
    return setOption("preferredHeightResolution", newPreferredHeightResolution)
}

export const getBlur = async () => {
    return getOption("blur")
}

export const setBlur = async (blur: number ) => {
    return setOption("blur", blur)
}

export const getTheme = async () => {
    return getOption("theme")
}

export const setTheme = async (theme: number ) => {
    return setOption("theme", theme)
}

// Board

type Board = typeof schema.boardsTable.$inferInsert

export const fetchOneBoard = async (id: number) => {
    return await db.select()
        .from(schema.boardsTable)
        .where(eq(schema.boardsTable.id, id))[0]
}

export const fetchAllBoard = async () => {
    return await db.select()
        .from(schema.boardsTable)
}

export const insertBoard = async (board: Board) => {
    return await db.insert(schema.boardsTable).values(board)
}

export const updateBoard = async (board: Board) => {
    return await db.update(schema.tasksTable)
        .set(board)
        .where(eq(schema.tasksTable, board.id))
}

export const deleteBoard = async (boardId: number) => {
    return await db.delete(schema.tasksTable).where(eq(schema.tasksTable.id, boardId))
}

// Collection

type Collection = typeof schema.collectionsTable.$inferInsert

export const fetchOneCollection = async (id: number) => {
    return await db.select()
        .from(schema.collectionsTable)
        .where(eq(schema.collectionsTable.id, id))[0]
}

export const fetchAllCollection = async (boardId: number) => {
    return await db.select()
        .from(schema.collectionsTable)
        .where(eq(schema.collectionsTable.boardId, boardId))
}

export const insertCollection = async (collection: Collection) => {
    return await db.insert(schema.collectionsTable).values(collection)
}

export const updateCollection = async (collection: Collection) => {
    return await db.update(schema.collectionsTable)
        .set(collection)
        .where(eq(schema.collectionsTable, collection.id))
}

export const deleteCollection = async (collectionId: number) => {
    return await db.delete(schema.collectionsTable).where(eq(schema.collectionsTable.id, collectionId))
}

// Tasks

type Task = typeof schema.tasksTable.$inferInsert

export const fetchOneTask = async (id: number) => {
    return await db.select()
        .from(schema.tasksTable)
        .where(eq(schema.tasksTable.id, id))[0]
}

export const fetchAllTasks = async (listId: number) => {
    return await db.select()
        .from(schema.tasksTable)
        .where(eq(schema.tasksTable.collectionId, listId))
}

export const insertTask = async (task: Task) => {
    return await db.insert(schema.tasksTable).values(task)
}

export const updateTask = async (task: Task) => {
    return await db.update(schema.tasksTable)
        .set(task)
        .where(eq(schema.tasksTable, task.id))
}

export const deleteTask = async (taskId: number) => {
    return await db.delete(schema.tasksTable).where(eq(schema.tasksTable.id, taskId))
}

// Update Task Position

export const updatePosition = async (taskId: number, newCollectionId: number, newPosition: number) => {
    let task: Task = { id: taskId, collectionId: newCollectionId, order: newPosition }
    return await db.update(schema.tasksTable)
        .set(task)
        .where(eq(schema.tasksTable, task.id))
}