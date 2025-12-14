const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../whatsapp_tracker.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDb() {
    // Table to track imports
    db.exec(`
        CREATE TABLE IF NOT EXISTS imports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            imported_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Table to store chat messages
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            import_id INTEGER,
            sender TEXT,
            content TEXT,
            timestamp TEXT,
            has_media INTEGER DEFAULT 0,
            FOREIGN KEY (import_id) REFERENCES imports(id) ON DELETE CASCADE
        )
    `);

    // Table to store media files
    db.exec(`
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            import_id INTEGER,
            message_id INTEGER,
            filename TEXT,
            gofile_download_page TEXT,
            gofile_direct_link TEXT,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (import_id) REFERENCES imports(id) ON DELETE CASCADE,
            FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
        )
    `);
    
    console.log('Database initialized');
}

module.exports = {
    db,
    initDb
};
