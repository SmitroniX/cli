import { useState, useEffect } from 'react';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const useFetchMovies = (apiKey, query = '') => {
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
          url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${query}`;
        } else {
          url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const formattedMovies = data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Poster',
          backdrop_path: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : 'https://via.placeholder.com/1280x720?text=No+Backdrop',
          // Add more metadata as needed
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }));
        setMovies(formattedMovies);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey, query]);

  return { movies, loading, error };
};

export default useFetchMovies;
