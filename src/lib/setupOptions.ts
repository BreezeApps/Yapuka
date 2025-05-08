import { DatabaseService } from "./dbClass";

export async function setupOptions() {
    const dbService = new DatabaseService()
    await dbService.init();
    if (await dbService.getOptionByKey("version") === undefined) {
        try {
            await dbService.createOption("version", "")
        } catch { console.log("Error createOptions version") }
    }
    if (await dbService.getOptionByKey("lang") === undefined) {
        try {
            await dbService.createOption("lang", "fr")
        } catch { console.log("Error createOptions lang") }
    }
    if (await dbService.getOptionByKey("theme") === undefined) {
        try {
            await dbService.createOption("theme", "system")
        } catch { console.log("Error createOptions theme") }
    }
    if (await dbService.getOptionByKey("syncActive") === undefined) {
        try {
            await dbService.createOption("syncActive", "false")
        } catch { console.log("Error createOptions syncActive") }
    }
    if (await dbService.getOptionByKey("syncUrl") === undefined) {
        try {
            await dbService.createOption("syncUrl", "")
        } catch { console.log("Error createOptions syncUrl") }
    }
    if (await dbService.getOptionByKey("notifications") === undefined) {
        try {
            await dbService.createOption("notifications", "false")
        } catch { console.log("Error createOptions notifications") }
    }
    if (await dbService.getOptionByKey("firstStart") === undefined) {
        try {
            await dbService.createOption("firstStart", "true")
        } catch { console.log("Error createOptions firstStart") }
    }
}