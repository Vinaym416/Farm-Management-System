const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(fileUpload()); // Middleware for handling file uploads

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const PLANT_API_KEY = 'XKZK8j1S41fV8uRXjaY92mp2KV5YY0Cnhib3JTEsdtV45pPlcL'; // New API key
const PLANT_API_URL = 'https://plant.id/api/v3'; // New API URL

// Helper function to check allowed file extensions
function allowedFile(filename) {
    const ext = path.extname(filename).toLowerCase().substring(1);
    return ALLOWED_EXTENSIONS.includes(ext);
}

// Route to identify plant from an uploaded image
app.post('/api/identify_plant_from_image', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;

    if (!allowedFile(file.name)) {
        return res.status(400).json({ error: 'Invalid file format. Only PNG, JPG, and JPEG are allowed.' });
    }

    const tempPath = path.join(__dirname, 'temp', file.name);

    try {
        // Save the file temporarily
        await file.mv(tempPath);

        // Read the file as a base64 string
        const imageBase64 = fs.readFileSync(tempPath, { encoding: 'base64' });

        // Prepare the request payload
        const payload = {
            api_key: PLANT_API_KEY,
            images: [imageBase64],
            modifiers: ["crops_fast", "similar_images"],
            plant_language: "en",
            plant_details: ["common_names", "url", "wiki_description", "taxonomy"]
        };

        // Send the request to the Plant.id API
        const response = await axios.post(`${PLANT_API_URL}/identify`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const results = response.data;

        // Clean up the temporary file
        fs.unlinkSync(tempPath);

        if (results.suggestions && results.suggestions.length > 0) {
            const plantDetails = results.suggestions.map(suggestion => ({
                name: suggestion.plant_name,
                common_names: suggestion.plant_details.common_names || [],
                description: suggestion.plant_details.wiki_description?.value || "No description available",
                url: suggestion.plant_details.url || "No URL available"
            }));

            res.json({ 'Plant Suggestions': plantDetails });
        } else {
            res.status(404).json({ error: 'No plant identified in the image.' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: `An error occurred while processing the image: ${error.message}` });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});