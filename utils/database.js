const fs = require("fs");
const { console } = require("inspector");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function get_link() {
  const file = JSON.parse(fs.readFileSync("Yapuka_Data/db.json", 'utf8'))
  if (file.link === "Yapuka_Data") {
    file.link = path.join(__dirname, "Yapuka_Data")
  }
  return file.link
}

// Chemin du fichier de base de données
// const dbPath = path.resolve(__dirname, 'tasks.db');
if (!fs.existsSync("Yapuka_Data/db.json")) {
  if(!fs.existsSync("Yapuka_Data")) {
    fs.mkdirSync("Yapuka_Data")
  }
  fs.writeFileSync("Yapuka_Data/db.json", JSON.stringify({ link: "Yapuka_Data" }))
}
const file = get_link()
if (!fs.existsSync(path.join(file, "Database.db"))) {
  try {
    fs.mkdirSync(file)
  } catch (error) {
    file.path = "Database.db"
  }
}
const dbPath = path.join(file, "Database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  }
});

// Créer les tables si elles n'existent pas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tabs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL
    )
  `);
    db.run(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tab_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        color TEXT NOT NULL DEFAULT '#FFFFFF',
        FOREIGN KEY (tab_id) REFERENCES tabs(id)
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL DEFAULT NULL,
        position INTEGER NOT NULL DEFAULT 0,
        date DATETIME NULL,
        FOREIGN KEY (list_id) REFERENCES lists(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NULL DEFAULT NULL,
        value TEXT NULL,
        UNIQUE (name)
      )
    `);

    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [0, "languages", "Languages of the app", "system"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [1, "theme", "Theme of the app", "system"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [2, "blur", "Blur of the app", "1"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [3, "screen-width", "", ""])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [4, "screen-height", "", ""])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [5, "screen-x", "", "0"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [6, "screen-y", "", "0"])
    db.run('INSERT OR IGNORE INTO tabs (id, name) VALUES (?, ?)', [0, "Premier Onglet"])
  });

/**
 * The function `make_backup` creates a backup of a database file with the current date appended to the
 * backup file name.
 */
function make_backup(returnElement) {
  const file = path.join(get_link(), "Database.db")

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;

  const name = "database_backup_" + today + ".db"

  const dest = path.join(get_link(), name)
  fs.copyFileSync(file, dest)

  if (returnElement === true) {
    const element = document.createElement("a")
    element.href = "file://" + dest
    element.setAttribute("target", "_blank");
    element.download = name
    element.classList.add("rounded-lg", "bg-blue-700", "px-5", "py-2.5", "text-center", "text-sm", "font-medium", "text-white", "hover:bg-blue-800", "focus:outline-none", "focus:ring-4", "focus:ring-blue-300", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
    element.setAttribute("data-i18n", "Download_Backup")
    return element
  }
  return dest
}

function getDays(milli){
  return Math.round(Math.round(Math.floor(milli / 60000) / 60) / 24);
};

function get_latest_backup(returnElement) {
  // const file = path.join(get_link(), "Database.db")
  let files = Array()
  let filenames = fs.readdirSync(get_link());
  filenames.forEach((file) => {
      if (file.split("_")[0] === "database" && file.split("_")[1] === "backup") {
        files.push(file)
      }
  });
  if (files.length === 0) {
    return false
  }
  const today = new Date()

  let lastFile;
  files.forEach((backup) => {
    let date = backup.split("_")[2].split(".")[0]
    date = date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0]
    const fileDate = new Date(date)
    const diff = today.getTime() - fileDate.getTime()
    if(lastFile !== undefined){
      if(lastFile.diff > diff) {
        lastFile = { diff: diff, date: fileDate, name: backup}
      }
    } else {
      lastFile = { diff: diff, date: fileDate, name: backup}
    }
  })

  const diff = getDays(lastFile.diff)

  if (returnElement === true) {
    const element = document.createElement("a")
    element.href = "file://" + path.join(get_link(), lastFile.name)
    element.setAttribute("target", "_blank");
    element.download = lastFile.name
    element.classList.add("rounded-lg", "bg-blue-700", "px-5", "py-2.5", "text-center", "text-sm", "font-medium", "text-white", "hover:bg-blue-800", "focus:outline-none", "focus:ring-4", "focus:ring-blue-300", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
    element.setAttribute("data-i18n", "Download_Backup")
    element.setAttribute("data-i18n-var", diff)
    element.innerText = ""
    return element
  }
  return lastFile
}

// Fonction pour récupérer les configurations d'un plugin
function getConfigs(pluginName) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM configs WHERE name LIKE ?`,
      [`plugin.${pluginName}.%`],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Transformer les rows en un objet clé-valeur
          const configs = {};
          rows.forEach(row => {
            const configKey = row.name.replace(`plugin.${pluginName}.`, '');
            configs[configKey] = {
              description: row.description,
              value: row.value
            };
          });
          resolve(configs);
        }
      }
    );
  });
}

// Fonction pour définir une configuration pour un plugin
function setConfig(pluginName, key, description, value) {
  return new Promise((resolve, reject) => {
    const nom = `plugin.${pluginName}.${key}`;
    db.run(
      `INSERT OR REPLACE INTO configs (name, description, value) VALUES (?, ?, ?)`,
      [nom, description, value],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = { db, make_backup, get_latest_backup, get_link, getConfigs, setConfig };
