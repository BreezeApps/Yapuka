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
    names TEXT NOT NULL,
    color TEXT,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    collection_id INTEGER,
    task_order INTEGER NOT NULL,
    names TEXT,
    descriptions TEXT,
    due_date TEXT,
    status TEXT,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON UPDATE CASCADE ON DELETE CASCADE
);
