const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { initDb, db } = require('./database/db');
const { processZip } = require('./services/parserService');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database Init
initDb();

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Routes

// Upload Endpoint
app.post('/api/upload', upload.single('backup'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const importName = req.body.name || 'Import ' + new Date().toLocaleString();
        const result = await processZip(req.file.path, importName);
        
        // Cleanup uploaded zip
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Processing failed: ' + error.message });
    }
});

// Get Imports
app.get('/api/imports', (req, res) => {
    try {
        const imports = db.prepare('SELECT * FROM imports ORDER BY imported_at DESC').all();
        res.json(imports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Messages for Import
app.get('/api/imports/:id/messages', (req, res) => {
    try {
        const messages = db.prepare(`
            SELECT m.*, med.gofile_download_page, med.gofile_direct_link, med.filename as media_filename
            FROM messages m
            LEFT JOIN media med ON m.id = med.message_id
            WHERE m.import_id = ?
            ORDER BY m.id ASC
        `).all(req.params.id);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
