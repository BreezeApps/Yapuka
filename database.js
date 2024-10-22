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

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin du fichier de base de données
const dbPath = path.resolve(__dirname, 'tasks.db');
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
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#FFFFFF'
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER NOT NULL,
        name TEXT NOT NULL,
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

    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [0, "mysql_db", "Using of mysql database", "false"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [1, "db_host", "The host of mysql database", "127.0.0.1"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [2, "db_port", "The port of mysql database", "3306"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [3, "db_user", "The user credentials of mysql database", "root"])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [4, "db_password", "The password credentials of mysql database", ""])
    db.run('INSERT OR IGNORE INTO configs (id, name, description, value) VALUES (?, ?, ?, ?)', [5, "languages", "Languages of th app", "system"])
  });

module.exports = db;
