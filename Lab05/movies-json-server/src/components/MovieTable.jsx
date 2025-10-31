import React, { useMemo } from 'react';
import { Table, Button, Image, Modal, Spinner, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMovieState, useMovieDispatch } from '../contexts/MovieContext';

const badgeClassMap = {
  'Sci-Fi': 'badge-soft-primary',
  Comedy: 'badge-soft-warning',
  Drama: 'badge-soft-info',
  Horror: 'badge-soft-danger',
  Romance: 'badge-soft-danger',
  Action: 'badge-soft-success',
  Thriller: 'badge-soft-secondary'
};

const MovieTable = () => {
  const state = useMovieState();
  const { dispatch, confirmDelete } = useMovieDispatch();
  const navigate = useNavigate();

  const { movies, genres, loading, movieToDelete, showDeleteModal, filters } = state;

  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  // Apply search/filter/sort so only relevant rows reach the table.
  const filteredMovies = useMemo(() => {
    let result = [...movies];
    const searchTerm = filters.search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter(movie => movie.title.toLowerCase().includes(searchTerm));
    }

    if (filters.genreId) {
      result = result.filter(movie => String(movie.genreId) === String(filters.genreId));
    }

    if (filters.duration) {
      result = result.filter(movie => {
        const duration = Number(movie.duration);
        switch (filters.duration) {
          case 'lt90':
            return duration < 90;
          case '90-120':
            return duration >= 90 && duration <= 120;
          case 'gt120':
            return duration > 120;
          default:
            return true;
        }
      });
    }

    if (filters.sort === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' }));
    } else if (filters.sort === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title, 'vi', { sensitivity: 'base' }));
    }

    return result;
  }, [movies, filters]);

  const getGenreBadgeClass = genreName => badgeClassMap[genreName] || 'badge-soft-secondary';

  const handleEditClick = movie => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: movie });
  };

  const handleDeleteClick = movie => {
    dispatch({ type: 'OPEN_DELETE_MODAL', payload: movie });
  };

  const handleViewDetails = movie => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <>
      <Card className="card-elevated table-card mb-5">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">Danh sách Phim</h4>
            <small className="text-light opacity-75">
              Theo dõi và chỉnh sửa toàn bộ kho phim hiện có trong hệ thống.
            </small>
          </div>
          <div className="badge-soft badge-soft-primary text-uppercase small">
            Tổng {filteredMovies.length} phim
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && movies.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary" className="me-2" />
              <p className="text-muted mt-3 mb-0">Đang tải dữ liệu phim...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>ID</th>
                    <th>Tên Phim</th>
                    <th>Danh mục</th>
                    <th>Thời lượng (phút)</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <h5 className="fw-semibold mb-1">Không tìm thấy phim phù hợp</h5>
                          <p className="mb-0">
                            Thử điều chỉnh lại bộ lọc hoặc tìm kiếm với từ khóa khác.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMovies.map(movie => {
                      const genreName = genreMap[movie.genreId] || 'Chưa xác định';
                      return (
                        <tr key={movie.id}>
                          <td>
                            <Image
                              src={movie.avatar}
                              alt={movie.title}
                              rounded
                              style={{ width: 56, height: 56, objectFit: 'cover' }}
                            />
                          </td>
                          <td className="fw-semibold">#{movie.id}</td>
                          <td>
                            <div className="fw-semibold text-start">{movie.title}</div>
                            <small className="text-muted">({movie.year})</small>
                          </td>
                          <td>
                            <Badge bg="light" className={`badge-soft ${getGenreBadgeClass(genreName)}`}>
                              {genreName}
                            </Badge>
                          </td>
                          <td>{movie.duration} phút</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="table-action-btn"
                                onClick={() => handleViewDetails(movie)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="table-action-btn"
                                onClick={() => handleEditClick(movie)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="table-action-btn"
                                onClick={() => handleDeleteClick(movie)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận Xóa Phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa phim <strong>{movieToDelete?.title}</strong> (ID:{' '}
          {movieToDelete?.id}) khỏi hệ thống?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })} className="pill-button">
            Hủy bỏ
          </Button>
          <Button
            variant="danger"
            onClick={() => movieToDelete && confirmDelete(movieToDelete.id)}
            className="pill-button"
          >
            Xác nhận Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MovieTable;
