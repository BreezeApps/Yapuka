import { DatabaseService } from "./dbClass";

export async function setupOptions() {
    const dbService = new DatabaseService()
    await dbService.init();

    if (await dbService.getOptionByKey("theme") === null) {
        try {
            await dbService.createOption("lang", "fr")
        } catch { console.log("Error createOptions lang") }
        try {
            await dbService.createOption("theme", "system")
        } catch { console.log("Error createOptions theme") }
        try {
            await dbService.createOption("syncActive", "false")
        } catch { console.log("Error createOptions syncActive") }
        try {
            await dbService.createOption("syncUrl", "")
        } catch { console.log("Error createOptions syncUrl") }
    }
}