import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MovieCard from './MovieCard';
import Slider from 'react-slick'; // Will need to install react-slick

const ContentRow = ({ title, movies }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="content-row mt-4">
      <h2>{title}</h2>
      {movies.length > 0 ? (
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      ) : (
        <p>No movies to display in this category.</p>
      )}
    </div>
  );
};

export default ContentRow;
