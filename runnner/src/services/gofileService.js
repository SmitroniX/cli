const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Get the best available server from GoFile
 */
async function getServer() {
    try {
        const response = await axios.get('https://api.gofile.io/getServer');
        if (response.data.status === 'ok') {
            return response.data.data.server;
        } else {
            throw new Error('Could not get GoFile server');
        }
    } catch (error) {
        console.error('Error getting GoFile server:', error.message);
        throw error;
    }
}

/**
 * Upload a file to GoFile
 * @param {string} filePath - Path to the file on local disk
 * @returns {Promise<object>} - The upload result containing the download page and direct link (if available)
 */
async function uploadFile(filePath) {
    try {
        const server = await getServer();
        const uploadUrl = `https://${server}.gofile.io/uploadFile`;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // You can add a folderId or token if the user provides one, but for now we keep it anonymous/guest
        // formData.append('token', 'YOUR_TOKEN'); 
        // formData.append('folderId', 'YOUR_FOLDER_ID');

        const response = await axios.post(uploadUrl, formData, {
            headers: {
                ...formData.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data.status === 'ok') {
            return response.data.data;
        } else {
            throw new Error(`GoFile upload failed: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.error('Error uploading to GoFile:', error.message);
        throw error;
    }
}

module.exports = {
    uploadFile
};
