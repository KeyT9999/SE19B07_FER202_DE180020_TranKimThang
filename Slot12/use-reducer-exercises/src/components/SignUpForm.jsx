import React, { useReducer, useMemo } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal, Toast } from 'react-bootstrap';

// Regex helpers
const isEmail = (v) => /\S+@\S+\.[A-Za-z]{2,}/.test(v);
const isUsername = (v) => /^[A-Za-z0-9._]{3,}$/.test(v.trim());
const isStrongPassword = (v) =>
  /[A-Z]/.test(v) &&        // có chữ hoa
  /[a-z]/.test(v) &&        // có chữ thường
  /\d/.test(v) &&           // có số
  /[^A-Za-z0-9]/.test(v) && // có ký tự đặc biệt
  v.length >= 8;            // độ dài

// 1. Khởi tạo trạng thái ban đầu
const initialState = {
  form: {
    username: '',
    email: '',
    password: '',
    confirm: '',
  },
  errors: {},
  showModal: false,
  showToast: false,
  isLoading: false,
  success: false
};

// 2. Định nghĩa hàm reducer
function signUpReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }
      };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    
    case 'SUBMIT_START':
      return { ...state, isLoading: true };
    
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        success: true,
        showToast: true,
        showModal: true
      };
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      };
    
    case 'SHOW_TOAST':
      return { ...state, showToast: action.payload };
    
    case 'SHOW_MODAL':
      return { ...state, showModal: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

function SignUpForm() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  const [state, dispatch] = useReducer(signUpReducer, initialState);
  const { form, errors, showModal, showToast, isLoading, success } = state;

  // Validate từng trường
  const validate = (field, value) => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (!isUsername(value)) return '≥ 3 chars, letters/numbers/._ only, no spaces';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!isEmail(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (!isStrongPassword(value)) return '≥8 chars, upper, lower, number, special';
        return '';
      case 'confirm':
        if (!value) return 'Please confirm password';
        if (value !== form.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  // Memo hóa lỗi cho toàn bộ form
  const formErrors = useMemo(() => {
    const e = {};
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field]);
      if (err) e[field] = err;
    });
    return e;
  }, [form]);

  // Form hợp lệ khi không có lỗi
  const isValid = Object.keys(formErrors).length === 0;

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
    
    // Validate ngay lập tức
    const error = validate(name, value);
    if (error) {
      dispatch({ type: 'SET_FIELD_ERROR', field: name, error });
    }
  };

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra lại toàn bộ lỗi
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field]);
      if (err) newErrors[field] = err;
    });
    
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    
    if (Object.keys(newErrors).length === 0) {
      dispatch({ type: 'SUBMIT_START' });
      
      // Giả lập API call
      setTimeout(() => {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      }, 1000);
    }
  };

  // Xử lý reset form
  const handleCancel = () => {
    dispatch({ type: 'RESET' });
  };

  const handleCloseToast = () => {
    dispatch({ type: 'SHOW_TOAST', payload: false });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'SHOW_MODAL', payload: false });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={7}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Sign Up</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Enter username"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group controlId="confirm" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    isInvalid={!!errors.confirm}
                    placeholder="Confirm password"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={!isValid || isLoading} 
                    className="w-100"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    type="button" 
                    onClick={handleCancel} 
                    className="w-100"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Toast thông báo submit thành công */}
      <Toast
        show={showToast}
        onClose={handleCloseToast}
        delay={2000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: 220,
          zIndex: 9999,
        }}
      >
        <Toast.Header>
          <strong className="me-auto text-success">Success</strong>
        </Toast.Header>
        <Toast.Body>Submitted successfully!</Toast.Body>
      </Toast>
      
      {/* Modal hiển thị thông tin đã submit */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <p><strong>Username:</strong> {form.username}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Password:</strong> {form.password}</p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SignUpForm;
