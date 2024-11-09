const { app, BrowserWindow, screen, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const shell = require("electron").shell;
const path = require("path");
const { db, get_link, getConfigs, setConfig } = require("./utils/database.js");
const fs = require("fs");
const {
  generate_list,
  generate_tab,
} = require("./print_template/generate_file.js");
const { startPrint } = require("./printer/index.js");
const AdmZip = require('adm-zip');
const axios = require('axios');

let win;
let pluginWindow
let reload = true;

// Fonction pour charger le contenu d'un fichier renderer.js
function loadRendererScript(pluginPath) {
  const rendererPath = path.join(pluginPath, "renderer.js");
  if (fs.existsSync(rendererPath)) {
    return fs.readFileSync(rendererPath, "utf-8");
  }
  return null;
}

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const saved_width = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM configs WHERE name = ?",
      ["screen-width"],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
  const saved_height = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM configs WHERE name = ?",
      ["screen-height"],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
  const saved_x = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM configs WHERE name = ?",
      ["screen-x"],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
  const saved_y = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM configs WHERE name = ?",
      ["screen-y"],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
  const defaultWidth = Math.floor(width * 0.8);
  const defaultHeight = Math.floor(height * 0.8);
  win = new BrowserWindow({
    width: parseInt(saved_width[0].value) || defaultWidth,
    height: parseInt(saved_height[0].value) || defaultHeight,
    x: parseInt(saved_x[0].value),
    y: parseInt(saved_y[0].value),
    icon: path.join(__dirname, "build/icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "utils", "preload.js"),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webviewTag: true,
    },
  });
  win.on("close", async function () {
    reload = false;
    const bounds = win.getBounds();
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE configs SET value = ? WHERE name = ?",
        [bounds.x, "screen-x"],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        },
      );
    });
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE configs SET value = ? WHERE name = ?",
        [bounds.y, "screen-y"],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        },
      );
    });
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE configs SET value = ? WHERE name = ?",
        [bounds.width, "screen-width"],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        },
      );
    });
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE configs SET value = ? WHERE name = ?",
        [bounds.height, "screen-height"],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        },
      );
    });
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
  win.loadFile("window/main/index.html");
  win.webContents.on("did-finish-load", () => {
    loadPlugins();
  });
  // win.webContents.openDevTools();
}

function openPluginWindow() {
  pluginWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      contextIsolation: true
    }
  });

  pluginWindow.loadFile('window/plugin/pluginWindow.html');
}

// Gestionnaire de fonctions backend
const backendFunctions = {
  calculate: (x, y) => x + y,
};

// Fonction pour permettre aux plugins de remplacer des fonctions backend
function overrideFunction(name, newFunction) {
  if (backendFunctions[name]) {
    backendFunctions[name] = newFunction;
  } else {
    console.error(`Fonction ${name} non trouvée pour le remplacement.`);
  }
}

function loadPlugins() {
  const pluginsDir = path.join(__dirname, "plugins");

  fs.readdirSync(pluginsDir).forEach((pluginFolder) => {
    const pluginPath = path.join(pluginsDir, pluginFolder);
    const packagePath = path.join(pluginPath, "package.json");

    if (fs.existsSync(packagePath)) {
      try {
        // Charger les informations du plugin depuis le package.json
        const packageInfo = require(packagePath);
        const mainFilePath = path.join(
          pluginPath,
          packageInfo.main || "index.js",
        );

        if (fs.existsSync(mainFilePath)) {
          const plugin = require(mainFilePath);

          // Vérifier si le plugin a une fonction d'activation
          if (typeof plugin.activate === "function") {
            plugin.activate({
              win,
              app,
              overrideFunction,
              getConfigs: (pluginName) => getConfigs(pluginName),
              setConfig: (pluginName, key, description, value) =>
                setConfig(pluginName, key, description, value),
            });

            const rendererScript = loadRendererScript(pluginPath);
            if (rendererScript) {
              console.log(typeof rendererScript)
              win.webContents.send("inject-code", rendererScript);
            }
          }
        } else {
          console.error(
            `Fichier principal du plugin introuvable pour ${packageInfo.name}`,
          );
        }
      } catch (error) {
        console.error(`Échec du chargement du plugin ${pluginFolder}:`, error);
      }
    } else {
      console.warn(
        `Le plugin ${pluginFolder} n'a pas de package.json et a été ignoré.`,
      );
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
  openPluginWindow()
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

ipcMain.handle('get-plugins-list', async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Marvideo2009/Yapuka/refs/heads/master/plugins.json');
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des plugins:", error);
    return [];
  }
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
      "UPDATE configs SET value = ? WHERE name = ?",
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

async function database(db1, command) {
  return await new Promise((resolve, reject) => {
    db1.all(command, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

let win_toprint;
const saveFile = require("electron-save-file");
ipcMain.handle("printer", async (event, type, id) => {
  if (type !== "") {
    win_toprint = new BrowserWindow({
      width: 300,
      height: 300,
      show: false,
      frame: false,
      webPreferences: {
        sandbox: true,
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        minimumFontSize: 12,
        defaultFontFamily: {
          standard: "Microsoft Yauheni",
        },
      },
    });
    const printOptions = {
      printBackground: true,
      landscape: this.landscape,
      pagesize: "A4",
      scale: this.scaleFactor / 100,
      margin: 10,
    };
    if (type === "list") {
      const { link, name } = await generate_list(db, id);
      win_toprint.loadFile(link);
      win_toprint.on("ready-to-show", async () => {
        const list = await database(db, "SELECT * FROM lists WHERE id = " + id);
        const tab = await database(
          db,
          "SELECT * FROM tabs WHERE id = " + list[0].id,
        );
        let date = new Date();
        date =
          date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        printOptions.footer = {
          height: "1cm",
          content: function (pageNum, numPages, callback) {
            callback(
              "<div title='footer'><p style='line-height: 100%; margin-top: 0.5cm; margin-bottom: 0cm'>" +
                tab[0].name +
                "<span style='background: #c0c0c0'>" +
                date +
                "</span></p></div>",
            );
          },
        };
        const data = await win_toprint.webContents.printToPDF(printOptions);
        fs.writeFileSync(path.join(__dirname, "print.pdf"), data);
        const pdf_link = "file://" + path.join(__dirname, "print.pdf");
        date =
          date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        let pdf_name = name + "_" + date + ".pdf";
        win.webContents.send("pdfLink", pdf_link, pdf_name);
        win_toprint.close();
      });
      // startPrint({ htmlString : fs.readFileSync(await generate_list(db, id)) },undefined)
    } else if (type === "tab") {
      const { link, name } = await generate_tab(db, id);
      win_toprint.loadFile(link);
      win_toprint.on("ready-to-show", async () => {
        const data = await win_toprint.webContents.printToPDF(printOptions);
        fs.writeFileSync(path.join(__dirname, "print.pdf"), data);
        const pdf_link = "file://" + path.join(__dirname, "print.pdf");
        let date = new Date();
        date =
          date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        let pdf_name = name + "_" + date + ".pdf";
        win.webContents.send("pdfLink", pdf_link, pdf_name);
        win_toprint.close();
      });
      // startPrint({ htmlString : fs.readFileSync(await generate_tab(db, id)) },undefined)
    }
  }
  // startPrint({htmlString :html},undefined)
});

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
      fs.mkdirSync(dir);
      fs.copyFileSync(
        path.join(get_link(), "Database.db"),
        path.join(dir, "Database.db"),
        fs.constants.COPYFILE_EXCL,
      );
      fs.writeFileSync(
        path.join(__dirname, "utils", "Yapuka_Data", "db.json"),
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
  win2.loadFile("window/config/config.html");
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

ipcMain.handle('install-plugin', async (event, githubUrl) => {
  try {
    const zipUrl = `${githubUrl}/archive/refs/heads/main.zip`;
    const response = await axios.get(zipUrl, { responseType: 'arraybuffer' });

    const zipPath = path.join(__dirname, 'temp.zip');
    fs.writeFileSync(zipPath, response.data);

    const zip = new AdmZip(zipPath);
    const pluginDir = path.join(__dirname, 'plugins');
    zip.extractAllTo(pluginDir, true);
    fs.unlinkSync(zipPath); // Supprimer le fichier ZIP temporaire

    console.log(`Plugin téléchargé depuis ${githubUrl}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'installation du plugin:', error);
    return false;
  }
});