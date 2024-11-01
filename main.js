const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const shell = require("electron").shell;
const path = require("path");
const { db } = require("./database.js");
const fs = require("fs");
const { generate_list, generate_tab } = require("./print_template/generate_file.js");
const { startPrint } = require("./printer/index.js");

let win;
let reload = true;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "build/icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webviewTag: true,
    },
  });
  win.on("closed", function () {
    reload = false;
    if (process.platform !== "darwin") {
      app.quit();
    } else {
      i18nextBackend.clearMainBindings(ipcMain);
    }
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
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
  }
});

app.once("ready-to-show", () => {
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipcMain.handle("download_update", (event) => {
  autoUpdater.downloadUpdate();
});

ipcMain.handle("restart_app", (event) => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle("check-update", (event) => {
  autoUpdater.autoDownload = false;
  const check = autoUpdater.checkForUpdates();
  return check;
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
ipcMain.handle("get-lists", (event, tab) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM lists WHERE tab_id = ?", [tab], (err, rows) => {
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

ipcMain.handle("add-list", (event, tab, listName, color) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO lists (tab_id, name, color) VALUES (?, ?, ?)",
      [tab, listName, color],
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

ipcMain.handle("printer", (event, link = path.join(__dirname, "/printme.html")) => {
    // const html = fs.readFileSync(link)
    // generate_tab(db, 0)
    // startPrint({htmlString :html},undefined)
  },
);

ipcMain.handle("config-window", (event) => {
  let win2;
  win2 = new BrowserWindow({
    width: 660,
    height: 600,
    minimizable: false,
    resizable: false,
    icon: path.join(__dirname, "build/icon.ico"),
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
      fs.writeFileSync(
        path.join(__dirname, "Yapuka_Data", "db.json"),
        JSON.stringify({ link: dir }),
      );
      reload = false;
      app.relaunch();
      app.exit();
    }
  });
  win2.on("closed", function () {
    win2 = null;
    if (reload === true) {
      win.webContents.reload();
    }
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

ipcMain.handle("get-tabs", (event) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tabs", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("get-tab", (event, id) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tabs WHERE id = ?", [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("add-tab", (event, name) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS count FROM tabs WHERE name = ?",
      [name],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const position = row.count;
          db.run("INSERT INTO tabs (name) VALUES (?)", [name], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID });
            }
          });
        }
      },
    );
  });
});

ipcMain.handle("update-tab", (event, name, id) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE tabs SET name = ? WHERE id = ?", [name, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("delete-tab", (event, tabId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM tabs WHERE id = ?", [tabId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
  return app.getVersion();
});