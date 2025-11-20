const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // node-fetch for making HTTP requests

const app = express();
const PORT = 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY"; // Get API key from environment or use placeholder

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON body

// Proxy endpoint for TMDB API
app.get('/api/tmdb/:mediaType/:type', async (req, res) => {
  const { mediaType, type } = req.params;
  const { query } = req.query;

  let url = '';
  if (query) {
    url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${TMDB_API_KEY}&query=${query}`;
  } else if (type === 'popular') {
    url = `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${TMDB_API_KEY}`;
  } else if (type === 'trending') {
    url = `https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${TMDB_API_KEY}`;
  } else {
    url = `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${TMDB_API_KEY}`; // Default to popular
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB API error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying TMDB request:', error);
    res.status(500).json({ message: 'Error fetching data from TMDB', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
