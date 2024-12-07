import {
    Insertable,
    Selectable,
    Updateable,
  } from 'kysely'
  
  export interface DatabaseType {
    options: optionsTable
    boards: boardsTable
    collections: collectionsTable
    tasks: tasksTable
  }

  export interface boardsTable {
    id: number
    name: string
  }

  export type Boards = Selectable<boardsTable>
  export type NewBoards = Insertable<boardsTable>
  export type BoardsUpdate = Updateable<boardsTable>


  export interface collectionsTable {
    id: number
    boardsId: string
    name: string
    color: string
  }

  export type Collection = Selectable<collectionsTable>
  export type NewCollection = Insertable<collectionsTable>
  export type CollectionUpdate = Updateable<collectionsTable>


  export interface optionsTable {
    id: number
    key: string
    value: string
  }

  export type Options = Selectable<optionsTable>
  export type NewOptions = Insertable<optionsTable>
  export type OptionsUpdate = Updateable<optionsTable>


  export interface tasksTable {
    id: number
    collectionId: string
    order: string
    name: string
    description: string
    dueDate: string
  }

  export type Tasks = Selectable<tasksTable>
  export type NewTask = Insertable<tasksTable>
  export type TaskUpdate = Updateable<tasksTable>
  
  // export type Person = Selectable<PersonTable>
  // export type NewPerson = Insertable<PersonTable>
  // export type PersonUpdate = Updateable<PersonTable>