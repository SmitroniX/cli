import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroSection = ({ movie }) => {
  if (!movie) {
    return null; // Or a placeholder hero if no movie is provided
  }

  return (
    <div 
      className="hero-section" 
      style={{ backgroundImage: `url(${movie.backdrop_path})` }}
    >
      <div className="overlay"></div>
      <Container className="hero-content">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <div className="hero-buttons">
          <Button variant="play" className="btn-play">
            <i className="bi bi-play-fill"></i> Play
          </Button>
          <Button variant="info" className="btn-more-info" as={Link} to={`/details/${movie.id}`}>
            <i className="bi bi-info-circle"></i> More Info
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
