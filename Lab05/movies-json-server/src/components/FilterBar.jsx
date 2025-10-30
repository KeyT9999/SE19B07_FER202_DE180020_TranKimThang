import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useMovieDispatch, useMovieState } from '../contexts/MovieContext';

const FilterBar = () => {
  const { filters, genres } = useMovieState();
  const { updateFilters, resetFilters } = useMovieDispatch();

  const handleChange = event => {
    const { name, value } = event.target;
    // Push the change into context so the table recalculates the filtered list.
    updateFilters({ [name]: value });
  };

  return (
    <Card className="card-elevated filter-bar mb-5">
      <Card.Body className="px-4 py-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h4 className="mb-1">🔍 Bộ lọc nâng cao</h4>
            <small className="text-muted">
              Lọc nhanh phim theo thể loại, thời lượng hoặc sắp xếp tên.
            </small>
          </div>
          <Button variant="outline-secondary" size="sm" className="pill-button" onClick={resetFilters}>
            Xóa toàn bộ bộ lọc
          </Button>
        </div>
        <Form>
          <Row className="g-4">
            <Col md={4}>
              <Form.Group controlId="filterSearch">
                <Form.Label className="fw-semibold text-uppercase small text-muted">Tìm kiếm</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Nhập tên phim..."
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  size="lg"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filterGenre">
                <Form.Label className="fw-semibold text-uppercase small text-muted">Thể loại</Form.Label>
                <Form.Select name="genreId" value={filters.genreId} onChange={handleChange} size="lg">
                  <option value="">Tất cả</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={String(genre.id)}>
                      {genre.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filterDuration">
                <Form.Label className="fw-semibold text-uppercase small text-muted">Thời lượng</Form.Label>
                <Form.Select name="duration" value={filters.duration} onChange={handleChange} size="lg">
                  <option value="">Tất cả</option>
                  <option value="lt90">Dưới 90 phút</option>
                  <option value="90-120">90 - 120 phút</option>
                  <option value="gt120">Trên 120 phút</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="filterSort">
                <Form.Label className="fw-semibold text-uppercase small text-muted">Sắp xếp</Form.Label>
                <Form.Select name="sort" value={filters.sort} onChange={handleChange} size="lg">
                  <option value="title-asc">Tên A → Z</option>
                  <option value="title-desc">Tên Z → A</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FilterBar;
