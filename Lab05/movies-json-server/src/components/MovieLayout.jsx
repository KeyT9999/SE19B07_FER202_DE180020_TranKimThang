import React from 'react';
import { Outlet } from 'react-router-dom';
import { MovieProvider } from '../contexts/MovieContext';

// Wraps movie-related routes with a single provider instance so state is shared.
const MovieLayout = () => (
  <MovieProvider>
    <Outlet />
  </MovieProvider>
);

export default MovieLayout;
