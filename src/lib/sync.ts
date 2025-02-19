import {DatabaseService} from './dbClass';
import { WebService } from './webClass';
import { emit, listen } from '@tauri-apps/api/event';

const dbService = new DatabaseService();
const webService = new WebService('https://example.com/');

async function syncBoards() {
    console.log('Synchronizing boards...');
    const localBoards = await dbService.getAllBoards();
    const remoteBoards = JSON.parse(await webService.getAllBoards());

    for (const board of localBoards) {
        if (!remoteBoards.some(b => b.id === board.id)) {
            await webService.createBoard(board.name);
        }
    }
    for (const board of remoteBoards) {
        if (!localBoards.some(b => b.id === board.id)) {
            await dbService.createBoard(board.name);
        }
    }
    emit('sync_complete', { table: 'boards' });
}

async function syncCollections() {
    console.log('Synchronizing collections...');
    const localCollections = await dbService.getAllCollections();
    const remoteCollections = JSON.parse(await webService.getAllCollections());
    
    for (const collection of localCollections) {
        if (!remoteCollections.some(c => c.id === collection.id)) {
            await webService.createCollection(collection.board_id, collection.name, collection.color === null ? "" : collection.color);
        }
    }
    for (const collection of remoteCollections) {
        if (!localCollections.some(c => c.id === collection.id)) {
            await dbService.createCollection(collection.name, collection.boardId);
        }
    }
    emit('sync_complete', { table: 'collections' });
}

async function syncTasks() {
    console.log('Synchronizing tasks...');
    const localTasks = await dbService.getAllTasks();
    const remoteTasks = JSON.parse(await webService.getAllTasks());
    
    for (const task of localTasks) {
        if (!remoteTasks.some(t => t.id === task.id)) {
            await webService.createTask(task.collection_id, task.order, task.name === null ? "" : task.name, task.description === null ? "" : task.description, task.due_date === null ? "" : task.due_date);
        }
    }
    for (const task of remoteTasks) {
        if (!localTasks.some(t => t.id === task.id)) {
            await dbService.createTask(task.name, task.collectionId);
        }
    }
    emit('sync_complete', { table: 'tasks' });
}

async function syncAll() {
    console.log('Starting full synchronization...');
    await syncBoards();
    await syncCollections();
    await syncTasks();
    console.log('Sync completed!');
}

setInterval(syncAll, 5 * 60 * 1000);

listen('manual_sync', () => {
    console.log('Manual sync triggered');
    syncAll();
});

syncAll();

export { syncAll, syncBoards, syncCollections, syncTasks };