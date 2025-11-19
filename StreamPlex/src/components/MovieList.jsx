import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MovieCard from './MovieCard';

const MovieList = ({ movies }) => {
  return (
    <Container>
      <Row>
        {movies.map((movie) => (
          <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MovieList;
