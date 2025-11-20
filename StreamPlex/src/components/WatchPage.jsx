import React from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Container, Alert } from 'react-bootstrap';

const WatchPage = ({ movies }) => {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));

  // Placeholder for a streaming URL. In a real application, this would come from a backend or a content delivery network.
  // For demonstration, using a public domain video.
  const placeholderVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up (Placeholder)
  // const placeholderVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // Public domain video

  if (!movie) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Movie not found for streaming.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5" style={{ padding: '0' }}>
      <h1 className="text-center my-4">{movie.title}</h1>
      <div className='player-wrapper' style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <ReactPlayer
          className='react-player'
          url={placeholderVideoUrl}
          controls
          playing
          width='100%'
          height='100%'
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      <Container className="my-4">
        <h2>Overview</h2>
        <p>{movie.overview}</p>
        {movie.release_date && <p><strong>Release Date:</strong> {movie.release_date}</p>}
        {movie.vote_average && <p><strong>Rating:</strong> {movie.vote_average}/10</p>}
      </Container>
    </Container>
  );
};

export default WatchPage;
