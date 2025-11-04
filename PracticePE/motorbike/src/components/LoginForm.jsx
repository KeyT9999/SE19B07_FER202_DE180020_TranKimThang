/**
 * LoginForm.jsx - Component form đăng nhập
 * 
 * Mục đích:
 * - Hiển thị form đăng nhập với username/email và password
 * - Validate input từ người dùng
 * - Gọi AuthContext.login() để xử lý đăng nhập
 * - Hiển thị modal thành công và chuyển hướng đến trang danh sách xe máy
 * 
 * Luồng hoạt động:
 * 1. User nhập username/email và password
 * 2. handleChange() validate real-time và cập nhật state qua LoginFormReducer
 * 3. User click "Login" → handleSubmit() được gọi
 * 4. validateForm() kiểm tra lại tất cả fields
 * 5. Gọi AuthContext.login() để xác thực
 * 6. Nếu thành công → hiển thị modal "Welcome" → navigate đến /motorbikes
 * 7. Nếu thất bại → hiển thị error từ AuthContext
 * 
 * Dependencies:
 * - AuthContext: Cung cấp login(), error, loading, user
 * - LoginFormReducer: Quản lý state của form (identifier, password, errors, showSuccessModal)
 * - ConfirmModal: Hiển thị modal thông báo thành công
 * - React Router: useNavigate để chuyển trang
 */

import React, { useReducer } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";              // Context quản lý authentication
import { loginFormReducer, initialFormState } from "../reducers/LoginFormReducer"; // Reducer quản lý form state
import { useNavigate } from "react-router-dom";                 // Hook để điều hướng
import { ConfirmModal } from "./ConfirmModal";                  // Component modal thông báo

function LoginForm() {
  // useNavigate: Hook từ React Router để chuyển trang
  const navigate = useNavigate();
  
  // useReducer: Quản lý state của form (identifier, password, errors, showSuccessModal)
  // LoginFormReducer xử lý các action: SET_FIELD, SET_ERROR, CLEAR_ERROR, RESET_FORM, SHOW_SUCCESS_MODAL
  const [formState, dispatch] = useReducer(loginFormReducer, initialFormState);
  
  // useAuth: Hook từ AuthContext để truy cập login function, error, loading, user
  // login(identifier, password): Gọi để đăng nhập
  // error: Lỗi từ AuthContext (nếu login thất bại)
  // loading: Trạng thái loading khi đang đăng nhập
  // user: User đã đăng nhập thành công
  const { login, loading, error, clearError, user } = useAuth();

  // Validation helpers
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regex để validate email format
  const isEmail = (v) => v.includes("@");         // Kiểm tra xem giá trị có phải email không

  /**
   * handleChange: Xử lý khi user nhập vào input
   * - Cập nhật giá trị field vào state qua LoginFormReducer
   * - Clear error từ AuthContext khi user bắt đầu nhập
   * - Validate real-time và hiển thị lỗi ngay lập tức
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật giá trị field vào state
    // Action SET_FIELD: Cập nhật giá trị của field (identifier hoặc password)
    dispatch({ type: "SET_FIELD", field: name, value });
    
    // Clear auth error khi user nhập để không còn hiển thị lỗi cũ
    clearError();
    
    // Validation real-time cho identifier (username hoặc email)
    if (name === "identifier") {
      if (!value.trim()) {
        // Nếu rỗng → hiển thị lỗi "required"
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Username or Email is required.",
        });
      } else if (isEmail(value) && !emailRe.test(value)) {
        // Nếu có @ nhưng không đúng format email → hiển thị lỗi "invalid email"
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Email is invalid format.",
        });
      } else {
        // Hợp lệ → clear error
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }

    // Validation real-time cho password
    if (name === "password") {
      if (!value.trim()) {
        // Nếu rỗng → hiển thị lỗi "required"
        dispatch({
          type: "SET_ERROR",
          field: name,
          message: "Password is required.",
        });
      } else {
        // Có giá trị → clear error
        dispatch({ type: "CLEAR_ERROR", field: name });
      }
    }
  };

  /**
   * validateForm: Validate toàn bộ form trước khi submit
   * @returns {Object} errors - Object chứa các lỗi (rỗng nếu không có lỗi)
   */
  const validateForm = () => {
    const errors = {};
    
    // Validate identifier
    if (!formState.identifier.trim()) {
      errors.identifier = "Username or Email is required.";
    } else if (
      isEmail(formState.identifier) &&
      !emailRe.test(formState.identifier)
    ) {
      errors.identifier = "Email is invalid format.";
    }
    
    // Validate password
    if (!formState.password.trim()) {
      errors.password = "Password is required.";
    }
    
    return errors;
  };

  /**
   * handleSubmit: Xử lý khi user submit form (click button "Login")
   * 1. Ngăn chặn default form submission
   * 2. Validate form
   * 3. Nếu có lỗi → hiển thị lỗi và return
   * 4. Gọi AuthContext.login() để xác thực
   * 5. Nếu thành công → hiển thị modal → navigate đến /motorbikes
   * 6. Nếu thất bại → error từ AuthContext sẽ được hiển thị tự động
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Ngăn chặn form submit mặc định (reload page)
    clearError();        // Clear error cũ trước khi validate
    
    // Validate form và lấy danh sách lỗi
    const validationErrors = validateForm();
    
    // Lưu lỗi vào state để hiển thị dưới input fields
    dispatch({ type: "SET_ERRORS", errors: validationErrors });
    
    // Nếu có lỗi validation → dừng lại, không gọi login
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    try {
      // Gọi login từ AuthContext
      // login() sẽ:
      // 1. Fetch danh sách users từ JSON Server (đã được fetch khi AuthProvider mount)
      // 2. Tìm user khớp với identifier (username hoặc email) và password
      // 3. Kiểm tra status (không được "locked")
      // 4. Dispatch LOGIN_SUCCESS hoặc LOGIN_FAILURE
      const result = await login(
        formState.identifier.trim(),  // Trim để loại bỏ khoảng trắng
        formState.password
      );
      
      // Nếu login thành công
      if (result.ok) {
        // Hiển thị modal thành công
        // Action SHOW_SUCCESS_MODAL: Set showSuccessModal = true
        dispatch({ type: "SHOW_SUCCESS_MODAL" });
        
        // Sau 2 giây → chuyển đến trang danh sách xe máy
        setTimeout(() => {
          navigate("/motorbikes");
        }, 2000);
      }
      // Nếu login thất bại → error từ AuthContext sẽ được hiển thị tự động qua {error && <Alert>}
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  
  /**
   * handleReset: Xử lý khi user click button "Reset"
   * - Reset form về trạng thái ban đầu (empty fields, no errors)
   * - Clear error từ AuthContext
   */
  const handleReset = () => {
    // Action RESET_FORM: Reset về initialFormState (identifier: "", password: "", errors: {}, showSuccessModal: false)
    dispatch({ type: "RESET_FORM" });
    clearError();  // Clear error từ AuthContext
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center mb-0">Login</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate>
                {/* Username/Email Input */}
                <Form.Group controlId="identifier" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="identifier"
                    value={formState.identifier}
                    onChange={handleChange}
                    isInvalid={!!formState.errors.identifier}  // Hiển thị validation error nếu có
                    placeholder="Enter username"
                    disabled={loading}  // Disable khi đang đăng nhập
                  />
                  {/* Hiển thị lỗi validation dưới input */}
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Input */}
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                    isInvalid={!!formState.errors.password}
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Login Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  
                  {/* Reset Button */}
                  <Button
                    variant="secondary"
                    type="button"
                    style={{ flex: 1 }}
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>

                {/* Hiển thị lỗi từ AuthContext (ví dụ: "Invalid credentials.") */}
                {error && (
                  <Alert
                    variant="danger"
                    className="mt-3"
                    onClose={clearError}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal thông báo thành công khi đăng nhập thành công */}
      {/* ConfirmModal hiển thị khi showSuccessModal = true */}
      <ConfirmModal
        show={formState.showSuccessModal}
        title="Login Successful"
        message={`Welcome, ${user?.username} login successful!`}  // user được lấy từ AuthContext sau khi login thành công
      />
    </Container>
  );
}

export default LoginForm;