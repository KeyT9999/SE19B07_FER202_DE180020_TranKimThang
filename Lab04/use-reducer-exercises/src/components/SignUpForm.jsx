// Import React và các hook cần thiết
import React, { useReducer, useMemo, useRef } from 'react';
// Import các component UI từ react-bootstrap
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
// Import ConfirmModal component
import ConfirmModalComponent from './ConfirmModalComponent';
// Import ToastSignup component
import ToastSignup from './ToastSignup';

// Các hàm kiểm tra hợp lệ cho từng trường
const isEmail = (v) => /\S+@\S+\.[A-Za-z]{2,}/.test(v); // kiểm tra định dạng email
const isUsername = (v) => /^[A-Za-z0-9._]{3,}$/.test(v.trim()); // username ≥3 ký tự, chỉ chữ/số/._
const isStrongPassword = (v) =>
  /[A-Z]/.test(v) &&        // có chữ hoa
  /[a-z]/.test(v) &&        // có chữ thường
  /\d/.test(v) &&           // có số
  /[^A-Za-z0-9]/.test(v) && // có ký tự đặc biệt
  v.length >= 8;            // độ dài tối thiểu 8

// 1. Khởi tạo trạng thái ban đầu cho form
const initialState = {
  form: {
    username: '', // tên đăng nhập
    email: '',    // email
    password: '', // mật khẩu
    confirm: '',  // xác nhận mật khẩu
  },
  errors: {},        // lưu lỗi từng trường
  showModal: false,  // hiển thị modal kết quả
  showToast: false,  // hiển thị toast thông báo
  isLoading: false,  // trạng thái đang submit
  success: false     // trạng thái submit thành công
};

// 2. Định nghĩa reducer quản lý mọi thay đổi trạng thái của form
function signUpReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      // Cập nhật giá trị trường form và xóa lỗi trường đó
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERRORS':
      // Cập nhật toàn bộ lỗi
      return { ...state, errors: action.payload };
    case 'SET_FIELD_ERROR':
      // Cập nhật lỗi cho một trường
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    case 'SUBMIT_START':
      // Bắt đầu submit (hiện loading)
      return { ...state, isLoading: true };
    case 'SUBMIT_SUCCESS':
      // Submit thành công, hiện toast và modal
      return {
        ...state,
        isLoading: false,
        success: true,
        showToast: true,
        showModal: true
      };
    case 'SUBMIT_ERROR':
      // Submit lỗi, cập nhật lỗi
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      };
    case 'SHOW_TOAST':
      // Hiện/tắt toast
      return { ...state, showToast: action.payload };
    case 'SHOW_MODAL':
      // Hiện/tắt modal
      return { ...state, showModal: action.payload };
    case 'RESET':
      // Đặt lại toàn bộ form
      return initialState;
    default:
      // Action không hợp lệ, giữ nguyên state
      return state;
  }
}

function SignUpForm() {
  // 3. Sử dụng useReducer để quản lý trạng thái form
  // state: trạng thái hiện tại, dispatch: hàm gửi action
  const [state, dispatch] = useReducer(signUpReducer, initialState);
  // Destructure các biến state cho dễ dùng
  const { form, errors, isLoading } = state;
  
  // Ref cho ConfirmModal và ToastSignup
  const confirmModalRef = useRef();
  const toastRef = useRef();

  // Hàm kiểm tra hợp lệ cho từng trường (trả về chuỗi lỗi nếu có)
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

  // Memo hóa lỗi cho toàn bộ form (tối ưu hiệu năng)
  const formErrors = useMemo(() => {
    const e = {};
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field]);
      if (err) e[field] = err;
    });
    return e;
  }, [form, validate]);

  // Form hợp lệ khi không có lỗi nào
  const isValid = Object.keys(formErrors).length === 0;

  // Xử lý thay đổi input: cập nhật state và validate ngay
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
    // Validate ngay lập tức
    const error = validate(name, value);
    if (error) {
      dispatch({ type: 'SET_FIELD_ERROR', field: name, error });
    }
  };

  // Xử lý submit form với confirm modal
  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra lại toàn bộ lỗi trước khi submit
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field]);
      if (err) newErrors[field] = err;
    });
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    
    // Nếu không có lỗi thì hiển thị confirm modal
    if (Object.keys(newErrors).length === 0) {
      confirmModalRef.current.showConfirm({
        title: 'Xác nhận đăng ký',
        message: `Bạn có chắc chắn muốn đăng ký với thông tin:\n- Username: ${form.username}\n- Email: ${form.email}`,
        confirmText: 'Đăng ký',
        cancelText: 'Hủy',
        variant: 'primary',
        type: 'confirm'
      });
    }
  };

  // Hàm xác nhận submit
  const handleConfirmSubmit = async () => {
    dispatch({ type: 'SUBMIT_START' });
    
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch({ type: 'SUBMIT_SUCCESS' });
    
    // Hiển thị success toast
    toastRef.current.showSuccess({
      message: 'Đăng ký thành công! Chào mừng bạn đến với hệ thống.',
      title: 'Đăng ký thành công',
      delay: 4000
    });
  };

  // Xử lý reset form với confirm
  const handleCancel = () => {
    confirmModalRef.current.showWarning({
      message: 'Bạn có chắc chắn muốn hủy và xóa tất cả thông tin đã nhập?',
      confirmText: 'Xóa',
      cancelText: 'Giữ lại'
    });
  };

  const handleConfirmReset = () => {
    dispatch({ type: 'RESET' });
    
    // Hiển thị info toast
    toastRef.current.showInfo({
      message: 'Form đã được reset về trạng thái ban đầu.',
      title: 'Reset thành công',
      delay: 3000
    });
  };

  // Đóng toast thông báo (không cần thiết nữa vì dùng ToastSignup)
  // const handleCloseToast = () => {
  //   dispatch({ type: 'SHOW_TOAST', payload: false });
  // };

  // Đóng modal kết quả (không cần thiết nữa vì dùng ConfirmModal)
  // const handleCloseModal = () => {
  //   dispatch({ type: 'SHOW_MODAL', payload: false });
  // };

  // Luồng hoạt động:
  // 1) Người dùng nhập liệu, thay đổi input → handleChange → dispatch SET_FIELD
  // 2) Khi submit, kiểm tra lỗi toàn bộ → nếu hợp lệ thì dispatch SUBMIT_START, giả lập API call
  // 3) Khi submit thành công, dispatch SUBMIT_SUCCESS → hiện toast và modal
  // 4) Có thể reset form về ban đầu bằng Cancel
  return (
  // Container bọc ngoài, căn giữa form
  <Container className="mt-5">
  {/* Row căn giữa form */}
  <Row className="justify-content-md-center">
  {/* Col định kích thước form */}
  <Col md={7}>
          {/* Card chứa form đăng ký */}
          <Card>
            <Card.Header>
              <h3 className="text-center">Sign Up</h3>
            </Card.Header>
            <Card.Body>
              {/* Form đăng ký */}
              <Form onSubmit={handleSubmit}>
                {/* Nhóm input username */}
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange} // gọi handleChange khi thay đổi
                    isInvalid={!!errors.username} // hiển thị lỗi nếu có
                    placeholder="Enter username"
                    disabled={isLoading}
                  />
                  {/* Hiển thị lỗi username nếu có */}
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Nhóm input email */}
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
                  {/* Hiển thị lỗi email nếu có */}
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Nhóm input password */}
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
                  {/* Hiển thị lỗi password nếu có */}
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Nhóm input xác nhận password */}
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
                  {/* Hiển thị lỗi xác nhận password nếu có */}
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Nhóm nút Submit và Cancel */}
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
      
      {/* ToastSignup Component */}
      <ToastSignup ref={toastRef} />
      
      {/* ConfirmModal Component */}
      <ConfirmModalComponent
        ref={confirmModalRef}
        onConfirm={handleConfirmSubmit}
        onCancel={handleConfirmReset}
      />
    </Container>
  );
}

// Export component để dùng ở file khác
export default SignUpForm;