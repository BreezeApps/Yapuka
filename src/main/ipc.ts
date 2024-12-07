import { app, ipcMain } from "electron";
import { deleteBoard, deleteCollection, deleteTask, fetchAllBoard, fetchAllCollection, fetchAllTasks, fetchOneBoard, fetchOneCollection, fetchOneTask, getOption, insertBoard, insertCollection, insertTask, setOption, updateBoard, updateCollection, updateTask, updateTaskPosition } from "./database";
import { Boards, Collection, Tasks } from "./database/types";
import i18n from "./i18n-main";

ipcMain.handle("get-option", (_event, key: string) =>  {
    return getOption(key)
})

ipcMain.handle("set-option", async (_event, key: string, value: string) => {
    const option = await getOption(key)
    return setOption({
        key: key, value: value,
        id: option?.id!
    })
})

// Boards

ipcMain.handle("get-tabs", (_event) => {
    return fetchAllBoard()
})
ipcMain.handle("get-tab", (_event, id: string) => {
    return fetchOneBoard(parseInt(id))
})
ipcMain.handle("add-tab", (_event, tab: Boards) => {
    return insertBoard(tab)
})
ipcMain.handle("update-tab", (_event, board: Boards) => {
    return updateBoard(board)
})
ipcMain.handle("delete-tab", async (_event, boardId: string) => {
    const lists = await fetchAllCollection(parseInt(boardId))
    lists.forEach(async list => {
        const tasks = await fetchAllTasks(list.id)
        tasks.forEach(async task => {
            await deleteTask(task.id)
        });
    })
    return deleteBoard(parseInt(boardId))
})

// Collection

ipcMain.handle("get-lists", (_event, tabId: string) => {
    return fetchAllCollection(parseInt(tabId))
})
ipcMain.handle("get-list", (_event, id: string) => {
    return fetchOneCollection(parseInt(id))
})
ipcMain.handle("add-list", (_event, list: Collection) => {
    return insertCollection(list)
})
ipcMain.handle("update-list", (_event, list: Collection) => {
    return updateCollection(list)
})
ipcMain.handle("delete-list", async (_event, listId: string) => {
    const tasks = await fetchAllTasks(parseInt(listId))
    tasks.forEach(async task => {
        await deleteTask(task.id)
    });
    return deleteCollection(parseInt(listId))
})

// Task

ipcMain.handle("get-tasks", (_event, listId: string) => {
    return fetchAllTasks(parseInt(listId))
})
ipcMain.handle("get-task", (_event, id: string) => {
    return fetchOneTask(parseInt(id))
})
ipcMain.handle("add-task", (_event, task: Tasks) => {
    return insertTask(task)
})
ipcMain.handle("update-task", (_event, task: Tasks) => {
    return updateTask(task)
})
ipcMain.handle("update-task-list-position", (_event, taskId: string, newCollectionId: string, newPosition: string) => {
    return updateTaskPosition(parseInt(taskId), parseInt(newCollectionId), parseInt(newPosition))
})
ipcMain.handle("delete-task", (_event, task: string) => {
    return deleteTask(parseInt(task))
})

// I18n

ipcMain.handle("i18n-translate", (_event, key: string) => {
    return i18n.t(key);
})

ipcMain.handle("i18n-translate-with-var", (_event, key: string, variable) => {
    return i18n.t(key, variable);
})

ipcMain.handle("change-language", (_event, lng: string) => {
    i18n.changeLanguage(lng);
    return i18n.language;
})

// App Version
ipcMain.handle("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
    return app.getVersion();
})

// Printer
// let win_toprint;
// ipcMain.handle("printer", async (_event, type, id) => {
//     if (type !== "") {
//       win_toprint = new BrowserWindow({
//         width: 300,
//         height: 300,
//         show: false,
//         frame: false,
//         webPreferences: {
//           sandbox: true,
//           nodeIntegration: true,
//           contextIsolation: false,
//           webSecurity: false,
//           minimumFontSize: 12,
//           defaultFontFamily: {
//             standard: "Microsoft Yauheni",
//           },
//         },
//       });
//       const printOptions = {
//         printBackground: true,
//         landscape: this.landscape,
//         pagesize: "A4",
//         scale: this.scaleFactor / 100,
//         margin: 10,
//       };
//       if (type === "list") {
//         const { link, name } = await generate_list(db, id);
//         win_toprint.loadFile(link);
//         win_toprint.on("ready-to-show", async () => {
//           const list = await database(db, "SELECT * FROM lists WHERE id = " + id);
//           const tab = await database(
//             db,
//             "SELECT * FROM tabs WHERE id = " + list[0].id,
//           );
//           let date = new Date();
//           date =
//             date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
//           printOptions.footer = {
//             height: "1cm",
//             content: function (pageNum, numPages, callback) {
//               callback(
//                 "<div title='footer'><p style='line-height: 100%; margin-top: 0.5cm; margin-bottom: 0cm'>" +
//                   tab[0].name +
//                   "<span style='background: #c0c0c0'>" +
//                   date +
//                   "</span></p></div>",
//               );
//             },
//           };
//           const data = await win_toprint.webContents.printToPDF(printOptions);
//           fs.writeFileSync(path.join(__dirname, "print.pdf"), data);
//           const pdf_link = "file://" + path.join(__dirname, "print.pdf");
//           let pdf_name = name + "_" + date + ".pdf";
//           win.webContents.send("pdfLink", pdf_link, pdf_name);
//           win_toprint.close();
//         });
//         // startPrint({ htmlString : fs.readFileSync(await generate_list(db, id)) },undefined)
//       } else if (type === "tab") {
//         const { link, name } = await generate_tab(db, id);
//         setTimeout(async function () {
//           win_toprint.loadFile(link);
//           win_toprint.on("ready-to-show", async () => {
//             const data = await win_toprint.webContents.printToPDF(printOptions);
//             fs.writeFileSync(path.join(__dirname, "print.pdf"), data);
//             const pdf_link = "file://" + path.join(__dirname, "print.pdf");
//             let date = new Date();
//             printOptions.footer = {
//               height: "1cm",
//               content: function (pageNum, numPages, callback) {
//                 callback(
//                   "<div title='footer'><p style='line-height: 100%; margin-top: 0.5cm; margin-bottom: 0cm'>" +
//                     name +
//                     "<span style='background: #c0c0c0'>" +
//                     date +
//                     "</span></p></div>",
//                 );
//               },
//             };
//             date =
//               date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
//             let pdf_name = name + "_" + date + ".pdf";
//             win.webContents.send("pdfLink", pdf_link, pdf_name);
//             win_toprint.close();
//           });
//         }, 600);
//         // startPrint({ htmlString : fs.readFileSync(await generate_tab(db, id)) },undefined)
//       }
//     }
//     // startPrint({htmlString :html},undefined)
//   });
  
// Config Window
// ipcMain.handle("config-window", (_event) => {
//     let win2;
//     win2 = new BrowserWindow({
//       width: 660,
//       height: 600,
//       minimizable: false,
//       resizable: false,
//       icon: path.join(__dirname, "build/icon.ico"),
//       autoHideMenuBar: true,
//       webPreferences: {
//         preload: path.join(__dirname, "preload.js"),
//         nodeIntegration: true,
//         nodeIntegrationInWorker: true,
//         contextIsolation: false,
//       },
//     });
//     ipcMain.on("select-dirs", async (_event, arg) => {
//       const result = await dialog.showOpenDialog(win2, {
//         properties: ["openDirectory"],
//       });
//       if (result.canceled) {
//         return null;
//       } else {
//         const dir = path.join(result.filePaths[0], "Yapuka_Data");
//         fs.mkdirSync(dir);
//         fs.copyFileSync(
//           path.join(get_link(), "Database.db"),
//           path.join(dir, "Database.db"),
//           fs.constants.COPYFILE_EXCL,
//         );
//         fs.writeFileSync(
//           path.join(__dirname, "utils", "Yapuka_Data", "db.json"),
//           JSON.stringify({ link: dir }),
//         );
//         reload = false;
//         app.relaunch();
//         app.exit();
//       }
//     });
//     win2.on("closed", function () {
//       win2 = null;
//       if (reload === true) {
//         win.webContents.reload();
//       }
//     });
//     win2.webContents.setWindowOpenHandler(({ url }) => {
//       if (url.startsWith("file://")) {
//         return { action: "allow" };
//       }
//       // open url in a browser and prevent default
//       shell.openExternal(url);
//       return { action: "deny" };
//     });
//     win2.loadFile("window/config/config.html");
//   });
