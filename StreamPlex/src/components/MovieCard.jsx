import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Img variant="top" src={movie.poster} alt={movie.title} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          {movie.overview.substring(0, 100)}...
        </Card.Text>
        {movie.release_date && <Card.Text>Release Date: {movie.release_date}</Card.Text>}
        {movie.vote_average && <Card.Text>Rating: {movie.vote_average}/10</Card.Text>}
        <Button variant="primary" as={Link} to={`/details/${movie.id}`} className="me-2">View Details</Button>
        <Button variant="danger" as={Link} to={`/watch/${movie.id}`}>Watch Now</Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
