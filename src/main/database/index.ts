// import * as schema from "./schema"
import path from "node:path"
import { app } from "electron"
// import Database from 'libsql';
import { pathExistsSync, createFileSync, mkdirSync, readJSONSync, writeFileSync } from "fs-extra"

import { DatabaseType, Boards, BoardsUpdate, NewBoards, Collection, CollectionUpdate, NewCollection, Options, OptionsUpdate, NewOptions, Tasks, TaskUpdate, NewTask } from './types.ts' // this is the Database interface we defined earlier
import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

type DataSourceJson = {
    path: string
}

const appBasePath = path.join(app.getAppPath(), `${app.getName()}_Data`)
if(!(pathExistsSync(appBasePath))) {
    mkdirSync(appBasePath)
}

let dataSourcePath = path.join(appBasePath, "data_source.json")
if(!(pathExistsSync(dataSourcePath))) {
    const baseConfig: DataSourceJson = { path: "" }
    writeFileSync(dataSourcePath, JSON.stringify(baseConfig, null, 2))
}

const dbSourcePath = path.join(appBasePath, "local.db")
if(!(pathExistsSync(dbSourcePath))) {
    createFileSync(dbSourcePath)
}
const dataSource = readJSONSync(dataSourcePath) as DataSourceJson
let databaseURL: string;
if (dataSource?.path !== '') {
  console.log("aaa")
    databaseURL = path.join(dataSource?.path , "local.db")
} else {
    databaseURL = path.join(appBasePath.replace("C:", "file:"), "local.db")
}
console.log(databaseURL)
console.log(appBasePath)
const dialect = new SqliteDialect({
    database: new Database(databaseURL),
  })
  
  export const db = new Kysely<DatabaseType>({
    dialect,
  })

export const addOption = async (option: Options) => {
  return await db.insertInto('options')
    .values(option)
    // const request = db.prepare('INSERT INTO options (key, value) VALUES (?, ?)')
    // return request.get(option.key, option.value)
}

export const getOption = async (key: string) => {
  return await db.selectFrom('options')
    .where('key', '=', key)
    // const request = db.prepare('SELECT * FROM options WHERE key = ?')
    // return request.get(key)
}

export const setOption = async (option: Options) => {
  return await db.updateTable('options').set(option).where('id', '=', option.id)
    // const request = db.prepare('UPDATE options set value = ? WHERE key = ?')
    // return request.get(option.value, option.key)
}

export const removeOption = async (key: string ) => {
  return await db.deleteFrom('options').where('key', '=', key)
    // const request = db.prepare('DELETE FROM options WHERE key = ?')
    // return request.get(key)
}

export const getPreferredPositionX = async () => {
    return getOption("preferedPositionX")[0].value
}

export const setPreferredPositionX = async (newPreferredPositionX: number ) => {
    return setOption({ id: getOption("preferedPositionX")[0].id, key:"preferredPositionX", value: newPreferredPositionX.toString() })
}

export const getPreferredPositionY = async () => {
    return getOption("preferredPositionY")[0].value
}

export const setPreferredPositionY = async (newPreferredPositionY: number ) => {
    return setOption({ id: getOption("preferredPositionY")[0].id, key: "preferredPositionY", value: newPreferredPositionY.toString() })
}

export const getPreferredWidthResolution = async () => {
    return getOption("preferredWidthResolution")[0].value
}

export const setPreferredWidthResolution = async (newPreferredWidthResolution: number ) => {
    return setOption({ id: getOption("preferredWidthResolution")[0].id, key: "preferredWidthResolution", value: newPreferredWidthResolution.toString() })
}

export const getPreferredHeightResolution = async () => {
    return getOption("preferredHeight")[0].value
}

export const setPreferredHeightResolution = async (newPreferredHeightResolution: number ) => {
    return setOption({ id: getOption("preferredHeight")[0].id, key: "preferredHeightResolution", value: newPreferredHeightResolution.toString() })
}

export const getBlur = async () => {
    return getOption("blur")[0].value
}

export const setBlur = async (blur: number ) => {
    return setOption({ id: getOption("blur")[0].id, key: "blur", value: blur.toString() })
}

export const getTheme = async () => {
    return getOption("theme")[0].value
}

export const setTheme = async (theme: number ) => {
    return setOption({ id: getOption("theme")[0].id, key: "theme", value: theme.toString() })
}

// Board

export const fetchOneBoard = async (id: number) => {
  return await db.selectFrom('boards').where('id', '=', id)[0]
    // const request = db.prepare(`SELECT * FROM boards WHERE id = ?`)
    // return request.get(id)
}

export const fetchAllBoard = async () => {
  return await db.selectFrom('boards').selectAll()
    // return db.exec(`SELECT * FROM boards`)
}

export const insertBoard = async (board: Boards) => {
  return await db.insertInto('boards').values(board)
    // const request = db.prepare('INSERT INTO boards (name) VALUES (?)')
    // return request.get(board.name)
}

export const updateBoard = async (board: Boards) => {
  return db.updateTable('boards').set(board).where('id', '=', board.id)
    // const request = db.prepare('UPDATE boards set name = ? WHERE id = ?')
    // return request.get(board.name, board.id)
}

export const deleteBoard = async (boardId: number) => {
  return db.deleteFrom('boards').where('id', '=', boardId)
    // const request = db.prepare('DELETE FROM boards WHERE id = ?')
    // return request.get(boardId)
}

// Collection

export const fetchOneCollection = async (id: number) => {
  return await db.selectFrom('collections').where('id', '=', id)[0]
    // return await db.select()
    //     .from(schema.collectionsTable)
    //     .where(eq(schema.collectionsTable.id, id))[0]
}

export const fetchAllCollection = async () => {
  return await db.selectFrom('collections').selectAll()
    // return await db.select()
    //     .from(schema.collectionsTable)
    //     .where(eq(schema.collectionsTable.boardId, boardId))
}

export const insertCollection = async (collection: Collection) => {
  return await db.insertInto('collections').values(collection)
    // return await db.insert(schema.collectionsTable).values(collection)
}

export const updateCollection = async (collection: Collection) => {
  return db.updateTable('collections').set(collection).where('id', '=', collection.id)
    // return await db.update(schema.collectionsTable)
    //     .set(collection)
    //     .where(eq(schema.collectionsTable, collection.id))
}

export const deleteCollection = async (collectionId: number) => {
  return db.deleteFrom('collections').where('id', '=', collectionId)
    // return await db.delete(schema.collectionsTable).where(eq(schema.collectionsTable.id, collectionId))
}

// Tasks

export const fetchOneTask = async (id: number) => {
  return await db.selectFrom('tasks').where('id', '=', id)[0]
    // return await db.select()
    //     .from(schema.tasksTable)
    //     .where(eq(schema.tasksTable.id, id))[0]
}

export const fetchAllTasks = async (listId: number) => {
  return await db.selectFrom('tasks').selectAll()
    // return await db.select()
    //     .from(schema.tasksTable)
    //     .where(eq(schema.tasksTable.collectionId, listId))
}

export const insertTask = async (task: Tasks) => {
  return await db.insertInto('tasks').values(task)
    // return await db.insert(schema.tasksTable).values(task)
}

export const updateTask = async (task: Tasks) => {
  return db.updateTable('tasks').set(task).where('id', '=', task.id)
    // return await db.update(schema.tasksTable)
    //     .set(task)
    //     .where(eq(schema.tasksTable, task.id))
}

export const deleteTask = async (taskId: number) => {
  return db.deleteFrom('tasks').where('id', '=', taskId)
    // return await db.delete(schema.tasksTable).where(eq(schema.tasksTable.id, taskId))
}

// Update Task Position

export const updatePosition = async (taskId: number, newCollectionId: number, newPosition: number) => {
  return db.updateTable('tasks').set({ id: taskId, collectionId: newCollectionId.toString(), order: newPosition.toString() }).where('id', '=', taskId)
    // let task: Task = { id: taskId, collectionId: newCollectionId, order: newPosition }
    // return await db.update(schema.tasksTable)
    //     .set(task)
    //     .where(eq(schema.tasksTable, task.id))
}