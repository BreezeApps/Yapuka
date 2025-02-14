PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY,
    board_id INTEGER,
    name TEXT NOT NULL,
    color TEXT,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    collection_id INTEGER,
    "order" INTEGER NOT NULL,
    name TEXT,
    description TEXT,
    due_date TEXT,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON UPDATE CASCADE ON DELETE CASCADE
);
