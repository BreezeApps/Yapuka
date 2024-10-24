// const { ipcRenderer } = require('electron');

// async function get_config_mysql() {
//   const mysql_config = await ipcRenderer.invoke('get-config-variable', 'mysql_database');
//   return mysql_config
// }

// if(get_config_mysql()) {
//   load_mysql()
// }

// async function load_mysql() {
//   const mysql = require('mysql')

//   const host = await ipcRenderer.invoke('get-config-variable', 'database.host') + ":" + await ipcRenderer.invoke('get-config-variable', 'database.port');
//   const user = await ipcRenderer.invoke('get-config-variable', 'database.user');
//   const password = await ipcRenderer.invoke('get-config-variable', 'database.password');

//   const con = mysql.createConnection({
//     host: host,
//     user: user,
//     password: password
//   });
//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
// }

const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin du fichier de base de données
// const dbPath = path.resolve(__dirname, 'tasks.db');
if (!fs.existsSync("db.json")) {
  fs.writeFileSync("db.json", JSON.stringify({ link: "tasks.db" }))
}
const file = JSON.parse(fs.readFileSync("db.json", 'utf8'))
if (!fs.existsSync(path.join(file.link, "Database.db"))) {
  try {
    fs.mkdirSync(file.link)
  } catch (error) {
    file.path = "Database.db"
  }
}
const dbPath = path.join(file.link, "Database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  }
});

// Créer les tables si elles n'existent pas
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        color TEXT NOT NULL DEFAULT '#FFFFFF'
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
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [2, "blur", "Blur of the app", "true"])
  });

module.exports = db;
