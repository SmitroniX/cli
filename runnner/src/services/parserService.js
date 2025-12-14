const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { db } = require('../database/db');
const { uploadFile } = require('./gofileService');

/**
 * Process a WhatsApp export zip file
 * @param {string} zipFilePath - Path to the uploaded zip file
 * @param {string} importName - Name for this import session
 */
async function processZip(zipFilePath, importName) {
    const extractPath = path.join(path.dirname(zipFilePath), 'extracted_' + Date.now());
    
    try {
        // 1. Unzip
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractPath, true);

        // 2. Create Import Record
        const insertImport = db.prepare('INSERT INTO imports (name) VALUES (?)');
        const importResult = insertImport.run(importName);
        const importId = importResult.lastInsertRowid;

        // 3. Scan for files
        const files = fs.readdirSync(extractPath);
        const chatFile = files.find(f => f.endsWith('.txt') && f.includes('chat')); // usually _chat.txt
        const mediaFiles = files.filter(f => !f.endsWith('.txt') && !f.startsWith('.'));

        // 4. Upload Media to GoFile
        const mediaMap = new Map(); // filename -> { downloadPage, directLink }
        
        console.log(`Found ${mediaFiles.length} media files. Uploading to GoFile...`);
        
        for (const file of mediaFiles) {
            const fullPath = path.join(extractPath, file);
            try {
                console.log(`Uploading ${file}...`);
                const uploadResult = await uploadFile(fullPath);
                mediaMap.set(file, {
                    downloadPage: uploadResult.downloadPage,
                    directLink: uploadResult.directLink || '' // directLink might not always be available depending on account tier
                });
            } catch (err) {
                console.error(`Failed to upload ${file}:`, err.message);
            }
        }

        // 5. Parse Chat
        if (chatFile) {
            const chatContent = fs.readFileSync(path.join(extractPath, chatFile), 'utf8');
            const lines = chatContent.split('\n');
            
            const insertMessage = db.prepare(`
                INSERT INTO messages (import_id, sender, content, timestamp, has_media)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            const insertMedia = db.prepare(`
                INSERT INTO media (import_id, message_id, filename, gofile_download_page, gofile_direct_link)
                VALUES (?, ?, ?, ?, ?)
            `);

            // Regex for "[date, time] Sender: Message" or "date, time - Sender: Message"
            // This is a simplified regex and might need adjustment for specific locales
            const msgRegex = /^\[?([^\]]+)\]? (?:- )?([^:]+): (.*)$/;

            db.transaction(() => {
                for (const line of lines) {
                    const match = line.match(msgRegex);
                    if (match) {
                        const timestamp = match[1];
                        const sender = match[2];
                        const content = match[3].trim();
                        
                        // Check if content contains any of the media filenames
                        // This is a heuristic. WhatsApp usually puts the filename in the message or "image omitted"
                        let hasMedia = 0;
                        let matchedMediaFile = null;

                        for (const [filename, links] of mediaMap.entries()) {
                            if (content.includes(filename) || (content.includes('attached') && content.includes(path.parse(filename).name))) {
                                hasMedia = 1;
                                matchedMediaFile = filename;
                                break;
                            }
                        }

                        const msgResult = insertMessage.run(importId, sender, content, timestamp, hasMedia);
                        
                        if (matchedMediaFile) {
                            const links = mediaMap.get(matchedMediaFile);
                            insertMedia.run(importId, msgResult.lastInsertRowid, matchedMediaFile, links.downloadPage, links.directLink);
                        }
                    } else {
                        // Handle system messages or continuations (simplified)
                        // For now, we skip lines that don't match the standard message format
                    }
                }
            })();
        }

        return { success: true, importId, mediaCount: mediaMap.size };

    } catch (error) {
        console.error('Error processing zip:', error);
        throw error;
    } finally {
        // Cleanup extracted files
        try {
            fs.rmSync(extractPath, { recursive: true, force: true });
        } catch (e) {
            console.error('Error cleaning up:', e);
        }
    }
}

module.exports = {
    processZip
};
