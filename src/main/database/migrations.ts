import { Kysely, sql } from 'kysely'
import { optionsTable } from './types'

export async function migrate(db: Kysely<any>) {
  await db.schema
    .createTable('options')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('key', 'text', (col) => col.notNull())
    .addColumn('value', 'text')
    .execute()

  await db.schema
    .createTable('boards')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('collections')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('boardsId', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('color', 'text', (col) => col.notNull())
    .execute()

    await db.schema
    .createTable('tasks')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('collectionId', 'text', (col) => col.notNull())
    .addColumn('order', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('dueDate', 'text', (col) => col.notNull())
    .execute()

    const optionTable = await db.selectFrom("options").where("key", '=', "theme").selectAll().execute()
    if (optionTable.toString()  === "") {
        await resetDb(db)
    }
}

export async function resetDb(db: Kysely<any>) {
    const optionPositionX: optionsTable = {
        id: 0,
        key: 'preferedPositionX',
        value: ''
    }
    db.insertInto('options').values(optionPositionX).execute()

    const optionPositionY: optionsTable = {
        id: 1,
        key: 'preferedPositionY',
        value: ''
    }
    db.insertInto('options').values(optionPositionY).execute()

    const optionWidthResolution: optionsTable = {
        id: 2,
        key: 'preferredWidthResolution',
        value: ''
    }
    db.insertInto('options').values(optionWidthResolution).execute()

    const optionHeight: optionsTable = {
        id: 3,
        key: 'preferredHeight',
        value: ''
    }
    db.insertInto('options').values(optionHeight).execute()

    const optionblur: optionsTable = {
        id: 4,
        key: 'blur',
        value: '1'
    }
    db.insertInto('options').values(optionblur).execute()

    const optiontheme: optionsTable = {
        id: 5,
        key: 'theme',
        value: 'system'
    }
    db.insertInto('options').values(optiontheme).execute()

    const optionlanguage: optionsTable = {
        id: 6,
        key: 'languages',
        value: 'system'
    }
    db.insertInto('options').values(optionlanguage).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tasks').execute()
  await db.schema.dropTable('collections').execute()
  await db.schema.dropTable('boards').execute()
  await db.schema.dropTable('options').execute()
}