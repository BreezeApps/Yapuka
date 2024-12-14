// import * as schema from "./schema"
import path from "node:path"
import { app } from "electron"
// import Database from 'libsql';
import pkg from 'fs-extra';
const { pathExistsSync, mkdirSync, writeFileSync, readJSONSync } = pkg;
// import { pathExistsSync, mkdirSync, readJSONSync, writeFileSync } from "fs-extra"

import { DatabaseType, Boards, Collection, Options, Tasks } from './types' // this is the Database interface we defined earlier
import DatabaseSqlite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { migrate } from "./migrations"

type DataSourceJson = {
    path: string
}

const appBasePath = path.join(app.getAppPath(), `${app.getName()}_Data`)
if(!pathExistsSync(appBasePath)) {
    mkdirSync(appBasePath, { recursive: true })
}

let dataSourcePath = path.join(appBasePath, "data_source.json")
if(!pathExistsSync(dataSourcePath)) {
    const baseConfig: DataSourceJson = { path: "" }
    writeFileSync(dataSourcePath, JSON.stringify(baseConfig, null, 2))
}

// const dbSourcePath = path.join(appBasePath, "local.db")
// if(!(pathExistsSync(dbSourcePath))) {
//     createFileSync(dbSourcePath)
// }
const dataSource = readJSONSync(dataSourcePath) as DataSourceJson
let databaseURL: string;
if (dataSource?.path !== '') {
    databaseURL = path.join(dataSource?.path , "local.db")
} else {
    databaseURL = path.join(appBasePath, "local.db")
}

const dbDirectory = path.dirname(databaseURL);
if (!pathExistsSync(dbDirectory)) {
  mkdirSync(dbDirectory, { recursive: true });
}

// const dialect = new SqliteDialect({
//     database: new Database(databaseURL),
//   })
  
  export const db = new Kysely<DatabaseType>({
    dialect: new SqliteDialect({
      database: new DatabaseSqlite(databaseURL),
    }),
  })

  migrate(db)

export const addOption = async (option: Options) => {
  return db.insertInto('options')
    .values(option)
    // const request = db.prepare('INSERT INTO options (key, value) VALUES (?, ?)')
    // return request.get(option.key, option.value)
}

export const getOption = async (key: string) => {
  return await db.selectFrom('options')
    .selectAll()
    .where('key', '=', key)
    .executeTakeFirst()
    // const request = db.prepare('SELECT * FROM options WHERE key = ?')
    // return request.get(key)
}

export const setOption = async (option: Options) => {
  return db.updateTable('options').set(option).where('id', '=', option.id).execute()
    // const request = db.prepare('UPDATE options set value = ? WHERE key = ?')
    // return request.get(option.value, option.key)
}

export const removeOption = async (key: string ) => {
  return db.deleteFrom('options').where('key', '=', key).execute()
    // const request = db.prepare('DELETE FROM options WHERE key = ?')
    // return request.get(key)
}

export const getPreferredPositionX = async () => {
    return await getOption("preferedPositionX")
}

export const setPreferredPositionX = async (newPreferredPositionX: number ) => {
    return await setOption({ id: await getOption("preferedPositionX")[0], key:"preferredPositionX", value: newPreferredPositionX.toString() })
}

export const getPreferredPositionY = async () => {
    return await getOption("preferredPositionY")
}

export const setPreferredPositionY = async (newPreferredPositionY: number ) => {
    return await setOption({ id: await getOption("preferredPositionY")[0], key: "preferredPositionY", value: newPreferredPositionY.toString() })
}

export const getPreferredWidthResolution = async () => {
    return await getOption("preferredWidthResolution")
}

export const setPreferredWidthResolution = async (newPreferredWidthResolution: number ) => {
  const id = await getOption("preferredWidthResolution")
    return await setOption({ id: id[0], key: "preferredWidthResolution", value: newPreferredWidthResolution.toString() })
}

export const getPreferredHeightResolution = async () => {
    return await getOption("preferredHeight")
}

export const setPreferredHeightResolution = async (newPreferredHeightResolution: number ) => {
  const id = await getOption("preferredHeight")
    return await setOption({ id: id, key: "preferredHeightResolution", value: newPreferredHeightResolution.toString() })
}

export const getBlur = async () => {
    return await getOption("blur")
}

export const setBlur = async (blur: number ) => {
  const id = await getOption("blur")
    return await setOption({ id: id[0], key: "blur", value: blur.toString() })
}

export const getTheme = async () => {
    return await getOption("theme")
}

export const setTheme = async (theme: number ) => {
  const id = await getOption("theme")
    return await setOption({ id: id[0], key: "theme", value: theme.toString() })
}

// Board

export const fetchOneBoard = async (id: number) => {
  return await db.selectFrom('boards').selectAll().where('id', '=', id).executeTakeFirst()
    // const request = db.prepare(`SELECT * FROM boards WHERE id = ?`)
    // return request.get(id)
}

export const fetchAllBoard = async () => {
  return await db.selectFrom('boards').selectAll().execute()
    // return db.exec(`SELECT * FROM boards`)
}

export const insertBoard = async (board: Boards) => {
  return await db.insertInto('boards').values(board).execute()
    // const request = db.prepare('INSERT INTO boards (name) VALUES (?)')
    // return request.get(board.name)
}

export const updateBoard = async (board: Boards) => {
  return await db.updateTable('boards').set(board).where('id', '=', board.id).execute()
    // const request = db.prepare('UPDATE boards set name = ? WHERE id = ?')
    // return request.get(board.name, board.id)
}

export const deleteBoard = async (boardId: number) => {
  return await db.deleteFrom('boards').where('id', '=', boardId).execute()
    // const request = db.prepare('DELETE FROM boards WHERE id = ?')
    // return request.get(boardId)
}

// Collection

export const fetchOneCollection = async (id: number) => {
  return await db.selectFrom('collections').where('id', '=', id).executeTakeFirst()
    // return await db.select()
    //     .from(schema.collectionsTable)
    //     .where(eq(schema.collectionsTable.id, id))[0]
}

export const fetchAllCollection = async (boardId: number) => {
  return await db.selectFrom('collections').where("boardsId", "=", boardId.toString()).selectAll().execute()
    // return await db.select()
    //     .from(schema.collectionsTable)
    //     .where(eq(schema.collectionsTable.boardId, boardId))
}

export const insertCollection = async (collection: Collection) => {
  return await db.insertInto('collections').values(collection).execute()
    // return await db.insert(schema.collectionsTable).values(collection)
}

export const updateCollection = async (collection: Collection) => {
  return await db.updateTable('collections').set(collection).where('id', '=', collection.id).execute()
    // return await db.update(schema.collectionsTable)
    //     .set(collection)
    //     .where(eq(schema.collectionsTable, collection.id))
}

export const deleteCollection = async (collectionId: number) => {
  return await db.deleteFrom('collections').where('id', '=', collectionId).execute()
    // return await db.delete(schema.collectionsTable).where(eq(schema.collectionsTable.id, collectionId))
}

// Tasks

export const fetchOneTask = async (id: number) => {
  return await db.selectFrom('tasks').where('id', '=', id).executeTakeFirst()
    // return await db.select()
    //     .from(schema.tasksTable)
    //     .where(eq(schema.tasksTable.id, id))[0]
}

export const fetchAllTasks = async (listId: number) => {
  return await db.selectFrom('tasks').where('collectionId', '=', listId.toString()) .selectAll().execute()
    // return await db.select()
    //     .from(schema.tasksTable)
    //     .where(eq(schema.tasksTable.collectionId, listId))
}

export const insertTask = async (task: Tasks) => {
  return await db.insertInto('tasks').values(task).execute()
    // return await db.insert(schema.tasksTable).values(task)
}

export const updateTask = async (task: Tasks) => {
  return await db.updateTable('tasks').set(task).where('id', '=', task.id).execute()
    // return await db.update(schema.tasksTable)
    //     .set(task)
    //     .where(eq(schema.tasksTable, task.id))
}

export const deleteTask = async (taskId: number) => {
  return await db.deleteFrom('tasks').where('id', '=', taskId).execute()
    // return await db.delete(schema.tasksTable).where(eq(schema.tasksTable.id, taskId))
}

// Update Task Position

export const updateTaskPosition = async (taskId: number, newCollectionId: number, newPosition: number) => {
  return await db.updateTable('tasks')
    .set({ id: taskId, collectionId: newCollectionId.toString(), order: newPosition.toString() })
    .where('id', '=', taskId)
    .execute()
    // let task: Task = { id: taskId, collectionId: newCollectionId, order: newPosition }
    // return await db.update(schema.tasksTable)
    //     .set(task)
    //     .where(eq(schema.tasksTable, task.id))
}