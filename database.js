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
        FOREIGN KEY (list_id) REFERENCES lists(id)
      )
    `);
  });

module.exports = db;
