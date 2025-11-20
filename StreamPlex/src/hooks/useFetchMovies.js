import { useState, useEffect } from 'react';

const BACKEND_BASE_URL = 'http://localhost:3001/api/tmdb';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const useFetchMovies = (apiKey, query = '', type = 'popular', mediaType = 'movie') => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!apiKey) {
        setError("API Key is not provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let url = '';
        if (query) {
          url = `${BACKEND_BASE_URL}/${mediaType}/${type}?query=${query}`; // Query to backend
        } else {
          url = `${BACKEND_BASE_URL}/${mediaType}/${type}`; // Popular/trending to backend
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const formattedMovies = data.results.map(item => ({
          id: item.id,
          title: item.title || item.name,
          overview: item.overview,
          poster: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Poster',
          backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : 'https://via.placeholder.com/1280x720?text=No+Backdrop',
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          media_type: item.media_type || mediaType,
        }));
        setMovies(formattedMovies);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey, query, type, mediaType]);

  return { movies, loading, error };
};

export default useFetchMovies;
