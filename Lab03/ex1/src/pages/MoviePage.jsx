import React, { useState, useMemo } from "react";
import Filter from "../components/Filter/Filter";
import MovieCard from '../components/Movie/MovieCard';
// REACT BOOTSTRAP GRID IMPORTS - Individual imports để tree-shaking tốt hơn
// Row: Flexbox row container
// Col: Flexbox column với responsive breakpoints
// Container: Responsive container với max-width
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { movies, allGenres } from '../data/movies.js';
 
export default function MoviePage({ searchQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filterYear, setFilterYear] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Update search term khi nhận searchQuery từ props
  React.useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(movie => {
        switch (filterYear) {
          case 'old': return movie.year <= 2000;
          case 'medium': return movie.year >= 2001 && movie.year <= 2015;
          case 'new': return movie.year > 2015;
          default: return true;
        }
      });
    }

    // Sort movies
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'year-asc': return a.year - b.year;
          case 'year-desc': return b.year - a.year;
          case 'title-asc': return a.title.localeCompare(b.title);
          case 'title-desc': return b.title.localeCompare(a.title);
          case 'duration-asc': return a.duration - b.duration;
          case 'duration-desc': return b.duration - a.duration;
          default: return 0;
        }
      });
    }

    return filtered;
  }, [searchTerm, filterYear, sortBy]);

  return (
    <div>
      <Container className="mt-4">
        <h2 className='mb-3'>Bộ Sưu Tập Phim Detective Conan</h2>
        
        <Filter 
          onSearch={setSearchTerm}
          onFilter={setFilterYear}
          onSort={setSortBy}
        />
        
        <Row xs={1} md={2} lg={3} className="g-4"> 
          {filteredAndSortedMovies.map((movie) => (
            <Col key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>

        {filteredAndSortedMovies.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">No movies found matching your criteria</h5>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </Container>
    </div>
  );
}
