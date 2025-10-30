// src/components/MovieForm.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal, Image, Card, Stack } from 'react-bootstrap';
import { useMovieState, useMovieDispatch } from '../contexts/MovieContext';
import { initialMovieState } from '../reducers/movieReducers';

// Reusable chunk that renders both create form fields and edit modal fields.
const MovieFields = ({ currentMovie, handleInputChange, handleFileChange, imagePreview, genres, errors = {}, validated = false }) => (
  <>
    <Row className="g-4">
      <Col lg={5}>
        <Form.Group controlId="formAvatar" className="mb-4">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Ảnh Avatar Phim
          </Form.Label>
          <Stack gap={3}>
            <Form.Control
              type="file"
              name="avatarFile"
              accept="image/*"
              onChange={handleFileChange}
              size="lg"
            />
            <Form.Control
              type="text"
              name="avatar"
              value={currentMovie.avatar || ''}
              onChange={handleInputChange}
              placeholder="Hoặc nhập URL hình ảnh"
              size="lg"
              isInvalid={validated && errors.avatar}
            />
          </Stack>
          <Form.Control.Feedback type="invalid" className="d-block">
            {errors.avatar}
          </Form.Control.Feedback>
          {imagePreview && (
            <div className="mt-3">
              <Image src={imagePreview} alt="Preview" className="avatar-preview" />
            </div>
          )}
        </Form.Group>
      </Col>
      <Col lg={7}>
        <Form.Group controlId="formTitle" className="mb-4">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Tên Phim <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={currentMovie.title || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Galactic Wars"
            size="lg"
            required
            isInvalid={validated && errors.title}
            isValid={validated && !errors.title && currentMovie.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-0">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Mô tả <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="description"
            value={currentMovie.description || ''}
            onChange={handleInputChange}
            placeholder="Tóm tắt nội dung chính, điểm nhấn đặc sắc..."
            required
            isInvalid={validated && errors.description}
            isValid={validated && !errors.description && currentMovie.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>

    <div className="form-section-divider mt-5">Thông tin chi tiết</div>

    <Row className="g-4">
      <Col lg={3}>
        <Form.Group controlId="formGenre">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Thể loại <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="genreId"
            value={currentMovie.genreId || ''}
            onChange={handleInputChange}
            required
            size="lg"
            isInvalid={validated && errors.genreId}
            isValid={validated && !errors.genreId && currentMovie.genreId}
          >
            <option value="">Chọn thể loại</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.genreId}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col lg={3}>
        <Form.Group controlId="formDuration">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Thời lượng (phút) <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="duration"
            value={currentMovie.duration || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 120"
            required
            min="1"
            max="600"
            size="lg"
            isInvalid={validated && errors.duration}
            isValid={validated && !errors.duration && currentMovie.duration}
          />
          <Form.Control.Feedback type="invalid">
            {errors.duration}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col lg={3}>
        <Form.Group controlId="formYear">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Năm <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="year"
            value={currentMovie.year || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 2024"
            required
            min="1900"
            max="2030"
            size="lg"
            isInvalid={validated && errors.year}
            isValid={validated && !errors.year && currentMovie.year}
          />
          <Form.Control.Feedback type="invalid">
            {errors.year}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col lg={3}>
        <Form.Group controlId="formCountry">
          <Form.Label className="fw-semibold text-uppercase small text-muted">
            Quốc gia <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={currentMovie.country || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Việt Nam"
            required
            size="lg"
            isInvalid={validated && errors.country}
            isValid={validated && !errors.country && currentMovie.country}
          />
          <Form.Control.Feedback type="invalid">
            {errors.country}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  </>
);

const MovieForm = () => {
  const state = useMovieState();
  const { dispatch, handleCreateOrUpdate } = useMovieDispatch();
  const { currentMovie, isEditing, showEditModal, genres } = state;
  const [imagePreview, setImagePreview] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Feed every keystroke back into the reducer so UI stays in sync.
    dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL preview cho ảnh
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreview(imageUrl);
        // Cập nhật avatar trong state với base64 string
        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'avatar', value: imageUrl } });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCloseEditModal = () => {
      dispatch({ type: 'CLOSE_EDIT_MODAL' });
      setImagePreview(''); // Reset preview khi đóng modal
      setValidated(false);
      setErrors({});
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!currentMovie.title?.trim()) {
      newErrors.title = 'Tên phim không được để trống';
    } else if (currentMovie.title.length < 2) {
      newErrors.title = 'Tên phim phải có ít nhất 2 ký tự';
    }
    
    if (!currentMovie.description?.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    } else if (currentMovie.description.length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }
    
    if (!currentMovie.genreId) {
      newErrors.genreId = 'Vui lòng chọn thể loại';
    }
    
    if (!currentMovie.duration) {
      newErrors.duration = 'Thời lượng không được để trống';
    } else if (currentMovie.duration < 1 || currentMovie.duration > 600) {
      newErrors.duration = 'Thời lượng phải từ 1 đến 600 phút';
    }
    
    if (!currentMovie.year) {
      newErrors.year = 'Năm không được để trống';
    } else if (currentMovie.year < 1900 || currentMovie.year > 2030) {
      newErrors.year = 'Năm phải từ 1900 đến 2030';
    }
    
    if (!currentMovie.country?.trim()) {
      newErrors.country = 'Quốc gia không được để trống';
    }
    
    if (!currentMovie.avatar?.trim()) {
      newErrors.avatar = 'Vui lòng chọn ảnh hoặc nhập URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setValidated(true);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Chuẩn hóa dữ liệu trước khi gửi đi
    const dataToSend = {
      ...currentMovie,
      duration: parseInt(currentMovie.duration || 0),
      year: parseInt(currentMovie.year || 0),
      genreId: parseInt(currentMovie.genreId || 1)
    };
    
    // Gọi hàm CRUD từ Context
    const success = await handleCreateOrUpdate(dataToSend, isEditing !== null, isEditing);
    
    // Reset form nếu thành công
    if (success) {
      if (isEditing === null) {
        // Reset form khi thêm mới thành công
        setImagePreview('');
        setValidated(false);
        setErrors({});
      } else {
        // Đóng modal khi sửa thành công
        handleCloseEditModal();
      }
    }
  };

  // Logic cho Form Thêm mới (khi isEditing là null)
  const isCreating = isEditing === null; 
  const createFormProps = {
    currentMovie: isCreating ? currentMovie : initialMovieState.currentMovie, 
    handleInputChange: isCreating ? handleInputChange : () => {},
    handleFileChange: isCreating ? handleFileChange : () => {},
    imagePreview: isCreating ? imagePreview : currentMovie.avatar,
    genres: genres,
    errors: isCreating ? errors : {},
    validated: isCreating ? validated : false
  };

  return (
    <>
      <Card className="card-elevated mb-5">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="mb-1">📽️ Thêm Phim Mới</h3>
              <small className="d-block text-light opacity-75">
                Điền thông tin chi tiết để bổ sung phim vào thư viện
              </small>
            </div>
            <div className="badge-soft badge-soft-info text-uppercase small">
              Form quản trị
            </div>
          </div>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <MovieFields {...createFormProps} />
            <div className="d-flex justify-content-end mt-5">
              <Button variant="success" size="lg" type="submit" className="pill-button d-flex align-items-center gap-2">
                <span className="fs-5">➕</span>
                Thêm Phim
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {/* MODAL CHỈNH SỬA (Chỉ hiện khi showEditModal là true) */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa Phim ID: {isEditing}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body className="px-4 py-3">
            <MovieFields 
              currentMovie={currentMovie} 
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              imagePreview={currentMovie.avatar}
              genres={genres}
              errors={errors}
              validated={validated}
            />
          </Modal.Body>
          <Modal.Footer className="px-4">
            <Button variant="outline-secondary" onClick={handleCloseEditModal} className="pill-button">
              Hủy
            </Button>
            <Button variant="warning" type="submit" className="pill-button">
              Lưu Thay Đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default MovieForm;
