const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const { url, method = 'get', headers, data } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Forward the request to the specified URL
        const response = await axios({
            url,
            method,
            headers,
            data,
        });

        // Return the response from the target API
        res.status(response.status).headers(response.headers).json(response.data);
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({
            error: error.message,
            details: error.response ? error.response.data : null,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
