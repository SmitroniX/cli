import React, { useState } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import HeroSection from './components/HeroSection'; // Import HeroSection
import ContentRow from './components/ContentRow'; // Import ContentRow
import WatchPage from './components/WatchPage'; // Import WatchPage
import useFetchMovies from './hooks/useFetchMovies'; // Import the custom hook
import './App.css'; // Import custom styles

// Placeholder Components
const HomePage = ({ popularMovies, trendingMovies, loading, error }) => {
  const featuredMovie = popularMovies[0]; // Take the first popular movie as featured

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
      <div className="mt-5"> {/* Adjusted margin for content below hero */}
        <ContentRow title="Popular on StreamPlex" movies={popularMovies} />
        <ContentRow title="Trending Now" movies={trendingMovies} />
        {/* Add more content rows as needed */}
      </div>
    </>
  );
};

const MoviesPage = ({ popularMovies, loading, error }) => {
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
      <ContentRow title="All Movies" movies={popularMovies} />
    </Container>
  );
};
const WebSeriesPage = ({ popularSeries, loading, error }) => {
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading web series...</p>
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
      <h1>Web Series</h1>
      <p>Explore all web series here.</p>
      <ContentRow title="Popular Web Series" movies={popularSeries} />
    </Container>
  );
};


const DetailPage = ({ allMovies }) => {
  const { id } = useParams();
  // Ensure unique movies by ID before finding
  const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
  const movie = uniqueMovies.find(m => m.id === parseInt(id));

  if (!movie) {
    return (
      <Container className="mt-4">
        <h1>Movie Not Found</h1>
        <p>The movie you are looking for does not exist.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          <img src={movie.poster} alt={movie.title} className="img-fluid" />
        </Col>
        <Col md={8}>
          <h1>{movie.title}</h1>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : 'N/A'}</p>
          <div className="mt-3">
            <Button variant="danger" as={Link} to={`/watch/${movie.id}`} className="me-2">Watch Now</Button>
            <Button variant="outline-light" onClick={() => alert('Download functionality coming soon!')}>Download (Placeholder)</Button>
          </div>
          {/* Additional details can be added here */}
        </Col>
      </Row>
    </Container>
  );
};


function App() {
  const TMDB_API_KEY = ""; // API Key is now handled by the backend
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  // Fetch popular movies for homepage and general browsing
  const { movies: popularMovies, loading: popularLoading, error: popularError } = useFetchMovies(TMDB_API_KEY, '', 'popular', 'movie');
  // Fetch trending movies (for a different row)
  const { movies: trendingMovies, loading: trendingLoading, error: trendingError } = useFetchMovies(TMDB_API_KEY, '', 'trending', 'movie');
  // Fetch popular series for web series page
  const { movies: popularSeries, loading: seriesLoading, error: seriesError } = useFetchMovies(TMDB_API_KEY, '', 'popular', 'tv');
  // Fetch search results
  const { movies: searchMovies, loading: searchLoading, error: searchError } = useFetchMovies(TMDB_API_KEY, currentSearch, 'search', 'movie'); // Default to movie search

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentSearch(searchQuery);
  };

  // Combine loading and error states for HomePage
  const loading = popularLoading || trendingLoading || searchLoading;
  const error = popularError || trendingError || searchError;


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
      {/* Add a div with padding-top to prevent content from hiding behind fixed navbar */}
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<HomePage popularMovies={popularMovies} trendingMovies={trendingMovies} loading={loading} error={error} />} />
          <Route path="/movies" element={<MoviesPage popularMovies={popularMovies} loading={loading} error={error}/>} />
          <Route path="/series" element={<WebSeriesPage popularSeries={popularSeries} loading={seriesLoading} error={seriesError}/>} />
          <Route path="/details/:id" element={<DetailPage allMovies={[...popularMovies, ...trendingMovies, ...searchMovies, ...popularSeries]} />} /> {/* Pass all movies for detail page lookup */}
          <Route path="/watch/:id" element={<WatchPage movies={[...popularMovies, ...trendingMovies, ...searchMovies, ...popularSeries]} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


