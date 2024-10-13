// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin du fichier de base de données
const dbPath = path.resolve(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  } else {
    console.log('Connecté à la base de données SQLite');
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
