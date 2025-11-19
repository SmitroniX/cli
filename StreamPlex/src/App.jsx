import React, { useState } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import MovieList from './components/MovieList';
import NotFoundPage from './components/NotFoundPage';
import HeroSection from './components/HeroSection'; // Import HeroSection
import useFetchMovies from './hooks/useFetchMovies'; // Import the custom hook
import './App.css'; // Import custom styles

// Placeholder Components
const HomePage = ({ movies, loading, error }) => {
  const featuredMovie = movies[0]; // Take the first movie as featured

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading movies...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <HeroSection movie={featuredMovie} />
      <Container className="mt-5"> {/* Added mt-5 here */}
        <h1>Welcome to StreamPlex</h1>
        <p>Your one-stop destination for movies and web series.</p>
        <MovieList movies={movies} />
      </Container>
    </>
  );
};

const MoviesPage = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading movies...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }
  return (
    <Container className="mt-4">
      <h1>Movies</h1>
      <p>Explore all movies here.</p>
      <MovieList movies={movies} />
    </Container>
  );
};
const WebSeriesPage = () => (
  <Container className="mt-4">
    <h1>Web Series</h1>
    <p>Explore all web series here.</p>
    {/* MovieList component will go here later */}
  </Container>
);

const DetailPage = ({ movies }) => {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));

  if (!movie) {
    return (
      <Container className="mt-4">
        <h1>Movie Not Found</h1>
        <p>The movie you are looking for does not exist.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} style={{ maxWidth: '300px', float: 'left', marginRight: '20px' }} />
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : 'N/A'}</p>
      {/* Additional details can be added here */}
    </Container>
  );
};


function App() {
  const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // Placeholder for API Key. Replace with your actual TMDB API key.
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  const { movies, loading, error } = useFetchMovies(TMDB_API_KEY, currentSearch);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentSearch(searchQuery);
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">StreamPlex</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              <Nav.Link as={Link} to="/series">Web Series</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<HomePage movies={movies} loading={loading} error={error} />} />
        <Route path="/movies" element={<MoviesPage movies={movies} loading={loading} error={error}/>} />
        <Route path="/series" element={<WebSeriesPage />} />
        <Route path="/details/:id" element={<DetailPage movies={movies} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

