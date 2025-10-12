import React, { useState, useMemo } from "react";
import HomeCarousel from "../components/home/HomeCarousel";
import Filter from "../components/Filter/Filter";
import { movies } from "../data/movies";
// REACT BOOTSTRAP GRID IMPORTS
// Container: Responsive container với max-width
// Row: Flexbox row container
// Col: Flexbox column với responsive breakpoints
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../components/Movie/MovieCard";

export default function HomePage() {
  // React state hooks để quản lý filter và search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortBy, setSortBy] = useState('');

  // useMemo để tối ưu performance - chỉ tính toán lại khi dependencies thay đổi
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    // Filter by search term - tìm kiếm theo title và description
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year - lọc theo khoảng năm
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

    // Sort movies - sắp xếp theo các tiêu chí khác nhau
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
      <HomeCarousel />

      {/* REACT BOOTSTRAP CONTAINER
          Container: Responsive container với max-width và auto margins
          className="mt-4": Margin top (có thể thay bằng mt-1, mt-2, mt-3, mt-5)
          Lý do dùng Container: Cung cấp responsive width và centering
          Có thể thay bằng: <div className="container mt-4"> hoặc <div className="container-fluid mt-4"> */}
      <Container className="mt-4">
        {/* Filter Component - React Bootstrap components bên trong */}
        <Filter 
          onSearch={setSearchTerm}
          onFilter={setFilterYear}
          onSort={setSortBy}
        />
        
        {/* Page Content */}
        <h4 className="mb-3">Bộ Sưu Tập Phim Detective Conan</h4>
        <p className="text-secondary mb-4">
          Khám phá những bộ phim hay nhất của Thám Tử Lừng Danh Conan. Sử dụng bộ lọc để tìm chính xác những gì bạn đang tìm kiếm.
        </p>
        
        {/* REACT BOOTSTRAP GRID SYSTEM
            Row: Flexbox row container
            className="g-3": Gap giữa các columns (có thể thay bằng g-1, g-2, g-4, g-5)
            Lý do dùng Row: Proper flexbox layout cho grid system
            Có thể thay bằng: <div className="row g-3"> */}
        <Row className="g-3">
          {/* Map qua danh sách movies đã filter */}
          {filteredAndSortedMovies.map((m) => (
            /* REACT BOOTSTRAP COLUMN
               Col: Flexbox column với responsive breakpoints
               xs={12}: Full width trên extra small screens
               md={6}: Half width trên medium screens (có thể thay bằng md={4}, md={8})
               lg={4}: One third width trên large screens (có thể thay bằng lg={3}, lg={6})
               Lý do dùng Col: Responsive grid system với proper breakpoints
               Có thể thay bằng: <div className="col-12 col-md-6 col-lg-4"> */
            <Col key={m.id} xs={12} md={6} lg={4}>
              <MovieCard movie={m} />
            </Col>
          ))}
        </Row>

        {/* Empty State - khi không có kết quả */}
        {filteredAndSortedMovies.length === 0 && (
          /* Bootstrap utility classes
             text-center: Text alignment center
             py-5: Padding top và bottom (có thể thay bằng py-3, py-4)
             text-muted: Muted text color (có thể thay bằng text-secondary, text-light) */
          <div className="text-center py-5">
            <h5 className="text-muted">No movies found matching your criteria</h5>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </Container>
    </div>
  );
}
