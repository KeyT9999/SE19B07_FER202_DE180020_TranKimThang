import React from 'react';
import { Container } from 'react-bootstrap';
import MovieForm from '../components/MovieForm';
import MovieTable from '../components/MovieTable';
import FilterBar from '../components/FilterBar';

const MovieManager = () => {
  // Compose the movie management page: form -> filters -> table.
  return (
    <Container className="main-content">
      <h1 className="section-title text-center mb-5">🎬 Trung tâm Quản lý Phim</h1>
      <MovieForm />
      <FilterBar />
      <MovieTable />
    </Container>
  );
};

export default MovieManager;
