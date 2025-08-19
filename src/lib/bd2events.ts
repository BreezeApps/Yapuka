import { EventSourceInput } from "@fullcalendar/core";
import { Task } from "./types/Task";
import { DatabaseService } from "./db/dbClass";

/* function date1hour(date: Date) {
    return date.setHours(date.getHours() + 1);
} */

async function getCollectionColor(dbService: DatabaseService) {
    const collections = await dbService.getAllCollections()
    const allCollection = collections.map(collection => { return { id: collection.id, color: collection.color } })
    return allCollection
}

export async function db2events(events: Task[], dbService: DatabaseService): Promise<EventSourceInput> {
    const collectionColors = await getCollectionColor(dbService);
    const eventsReturn: EventSourceInput = events.map(event => ({
            id: event.id.toString(),
            title: event.names === null ? '' : event.names,
            start: event.due_date ? new Date(event.due_date) : new Date(),
            description: event.descriptions || '',
            color: collectionColors[event.collection_id - 1].color || '#3788d8',
        }))
    return eventsReturn;
}