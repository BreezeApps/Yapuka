const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater")
const shell = require("electron").shell;
const path = require("path");
const { db } = require("./database.js");
const fs = require("fs");

let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    icon: path.join(__dirname, 'build/icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
    },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("file://")) {
      return { action: "allow" };
    }
    // open url in a browser and prevent default
    shell.openExternal(url);
    return { action: "deny" };
  });
  win.loadFile("index.html");
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
  }
});

app.once('ready-to-show', () => {
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.handle("download_update", (event) => {
  autoUpdater.downloadUpdate()
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle("get-config-variable", async (event, name) => {
  const response_db = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM configs WHERE name = ?", [name], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  const response = {
    name: response_db[0].name,
    description: response_db[0].description,
    value: response_db[0].value,
  };
  return response;
});

ipcMain.handle("set-config-variable", (event, name, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE config SET value = ? WHERE name = ?",
      [value, name],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      },
    );
  });
});

ipcMain.handle("remove-config-variable", (event, name) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM configs WHERE name = ?", [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
});

// Gestion des événements IPC pour la base de données
ipcMain.handle("get-lists", (event) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM lists", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("get-list", (event, listId) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM lists WHERE id = ?", [listId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("get-tasks", (event, listId) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM tasks WHERE list_id = ? ORDER BY position",
      [listId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
});

ipcMain.handle("get-tasks-withId", (event, taskId) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks WHERE id = ?", [taskId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("add-list", (event, listName, color) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO lists (name, color) VALUES (?, ?)",
      [listName, color],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      },
    );
  });
});

ipcMain.handle("update-list", (event, id, listName, color) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE lists SET name = ?, color = ? WHERE id = ?",
      [listName, color, id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      },
    );
  });
});

ipcMain.handle("add-task", (event, listId, description, date, taskName) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS count FROM tasks WHERE list_id = ?",
      [listId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const position = row.count;
          db.run(
            "INSERT INTO tasks (list_id, name, description, position, date) VALUES (?, ?, ?, ?, ?)",
            [listId, taskName, description, position, date],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve({ id: this.lastID });
              }
            },
          );
        }
      },
    );
  });
});

ipcMain.handle("update-task", (event, taskId, description, date, taskName) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE tasks SET description = ?, date = ?, name = ? WHERE id = ?",
      [description, date, taskName, taskId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      },
    );
  });
});

// Suppression de liste
ipcMain.handle("delete-list", (event, listId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM lists WHERE id = ?", [listId], function (err) {
      if (err) {
        reject(err);
      } else {
        db.run(
          "DELETE FROM tasks WHERE list_id = ?",
          [listId],
          function (taskErr) {
            if (taskErr) {
              reject(taskErr);
            } else {
              resolve();
            }
          },
        );
      }
    });
  });
});

// Suppression de tâche
ipcMain.handle("delete-task", (event, taskId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// Mise à jour de la position et du list_id des tâches après réorganisation
ipcMain.handle(
  "update-task-list-and-position",
  (event, taskId, newListId, newPosition) => {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tasks SET list_id = ?, position = ? WHERE id = ?",
        [newListId, newPosition, taskId],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  },
);

ipcMain.handle("update-blur", (event, blur) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE configs SET value = ? WHERE id = 2", [blur], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("get-blur", (event) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT value FROM configs WHERE id = 2", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle(
  "print",
  (event, arg, link = path.join(__dirname, "/printme.html")) => {
    let win = new BrowserWindow({ width: 302, height: 793, show: false });
    win.once("ready-to-show", () => win.hide());
    fs.writeFile(link, arg, function () {
      win.loadURL(`file://${link}`);
      win.webContents.on("did-finish-load", () => {
        // Finding Default Printer name
        // let printersInfo = win.webContents.getPrinters();
        // let printer = printersInfo.filter(printer => printer.isDefault === true)[0];

        const options = {
          silent: false,
          printBackground: false,
          color: false,
          margin: {
            marginType: "printableArea",
          },
          landscape: false,
          pagesPerSheet: 1,
          collate: false,
          copies: 1,
          header: "Header of the Page",
          footer: "Footer of the Page",
        };

        win.webContents.print(options, (success, failureReason) => {
          if (!success) console.log(failureReason);
          console.log("Print Initiated");
        });
      });
    });

    event.returnValue = true;
  },
);

ipcMain.handle("config-window", (event) => {
  let win2;
  win2 = new BrowserWindow({
    width: 660,
    height: 600,
    minimizable: false,
    resizable: false,
    icon: path.join(__dirname, 'build/icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
    },
  });
  ipcMain.on("select-dirs", async (event, arg) => {
    const result = await dialog.showOpenDialog(win2, {
      properties: ["openDirectory"],
    });
    if (result.canceled) {
      return null;
    } else {
      const dir = path.join(result.filePaths[0], "Yapuka_Data");
      fs.writeFileSync(path.join(__dirname, "Yapuka_Data", "db.json"), JSON.stringify({ link: dir }))
    }
  });
  win2.on("closed", function () {
    win2 = null;
    win.webContents.reload();
  });
  win2.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("file://")) {
      return { action: "allow" };
    }
    // open url in a browser and prevent default
    shell.openExternal(url);
    return { action: "deny" };
  });
  win2.loadFile("config.html");
});

ipcMain.handle("get-theme", (event) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT value FROM configs WHERE id = 1", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("update-theme", (event, theme) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE configs SET value = ? WHERE id = 1",
      [theme],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
});

ipcMain.handle('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});