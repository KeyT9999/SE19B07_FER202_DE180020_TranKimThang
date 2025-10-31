import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useMovieState } from '../contexts/MovieContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies, genres, loading } = useMovieState();

  const genreMap = useMemo(() => {
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }, [genres]);

  const movie = useMemo(
    () => movies.find(item => String(item.id) === String(id)),
    [movies, id]
  );

  const handleBack = () => {
    navigate('/movies');
  };

  if (loading && !movie) {
    return (
      <Container className="main-content text-center py-5">
        <Spinner animation="border" role="status" className="mb-3" />
        <div>Đang tải chi tiết phim...</div>
        <Button variant="outline-secondary" className="mt-4" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="main-content text-center py-5">
        <h3 className="mb-3">Không tìm thấy phim</h3>
        <p className="text-muted">Có thể phim đã bị xóa hoặc đường dẫn không chính xác.</p>
        <Button variant="primary" onClick={handleBack}>
          Trở về danh sách phim
        </Button>
      </Container>
    );
  }

  const genreName = genreMap[movie.genreId] || 'Chưa xác định';

  return (
    <Container className="main-content my-4">
      <Button variant="outline-secondary" onClick={handleBack}>
        ← Back to list
      </Button>
      <Card className="card-elevated mt-4">
        <Card.Body>
          <Row className="g-4">
            <Col md={4}>
              <Image
                src={movie.avatar}
                alt={movie.title}
                rounded
                fluid
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
              />
            </Col>
            <Col md={8}>
              <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
                <div>
                  <h2 className="mb-1">{movie.title}</h2>
                  <div className="text-muted">Năm phát hành: {movie.year || 'Chưa cập nhật'}</div>
                </div>
                <Badge bg="primary" className="fs-6 align-self-start">
                  {genreName}
                </Badge>
              </div>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Thời lượng:</strong> {movie.duration || 'N/A'} phút
                  </p>
                  <p className="mb-2">
                    <strong>Quốc gia:</strong> {movie.country || 'Chưa cập nhật'}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Mã phim:</strong> #{movie.id}
                  </p>
                </Col>
              </Row>
              <div>
                <h5 className="mb-3">Mô tả</h5>
                <p className="mb-0">
                  {movie.description || 'Chưa có mô tả cho bộ phim này.'}
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieDetails;
