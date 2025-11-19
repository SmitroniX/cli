import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="mt-5 text-center">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button as={Link} to="/" variant="primary">Go to Home</Button>
    </Container>
  );
};

export default NotFoundPage;
