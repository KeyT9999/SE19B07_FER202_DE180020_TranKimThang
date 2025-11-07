/**
 * LoginForm.jsx - Component form đăng nhập
 * 
 * MỤC ĐÍCH:
 * - Hiển thị form đăng nhập cho user
 * - Nhận input: email/username và password
 * - Xử lý submit và hiển thị lỗi nếu có
 * - Link đến trang đăng ký
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. User nhập email/username và password
 * 2. User click nút "Login"
 * 3. handleSubmit() được gọi:
 *    a. Validate form (check required fields)
 *    b. Gọi login(email, password) từ AuthContext
 *    c. Nếu success: Form tự động redirect (do navigate trong AuthContext)
 *    d. Nếu fail: Hiển thị error message
 * 
 * STATE:
 * - email: Email hoặc username user nhập
 * - password: Password user nhập
 * - generalError: Thông báo lỗi từ server
 * - showPassword: Boolean - hiển thị/ẩn password
 * - validated: Boolean - đánh dấu form đã được validate
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - LoginPage.jsx: Render LoginForm
 * 
 * CONTEXTS SỬ DỤNG:
 * - AuthContext: login() function
 */

// src/components/auth/LoginForm.js

import React, { useState, useContext } from "react";
import { Form, Button, Card, InputGroup, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * LoginForm - Component form đăng nhập
 */
const LoginForm = () => {
  // State quản lý input email/username
  const [email, setEmail] = useState("");
  
  // State quản lý input password
  const [password, setPassword] = useState("");
  
  // State quản lý thông báo lỗi từ server
  const [generalError, setGeneralError] = useState("");
  
  // State quản lý hiển thị/ẩn password (toggle show/hide)
  const [showPassword, setShowPassword] = useState(false);
  
  // Lấy hàm login từ AuthContext
  const { login } = useContext(AuthContext);
  
  // State đánh dấu form đã được validate (dùng cho Bootstrap validation)
  const [validated, setValidated] = useState(false);

  /**
   * handleSubmit - Xử lý khi user submit form
   * 
   * @param {Event} e - Event object từ form submit
   * 
   * Logic:
   * 1. preventDefault() để tránh form submit mặc định
   * 2. Validate form (check required fields)
   * 3. Nếu form không hợp lệ → return (không gọi API)
   * 4. Xóa error cũ (setGeneralError(""))
   * 5. Gọi login(email, password) từ AuthContext
   * 6. Nếu login thất bại → Hiển thị error message
   * 7. Nếu login thành công → Tự động redirect (do navigate trong AuthContext)
   */
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    
    // Ngăn chặn form submit mặc định
    e.preventDefault();
    e.stopPropagation();

    // Đánh dấu form đã được validate (để hiển thị validation feedback)
    setValidated(true);

    // Kiểm tra form có hợp lệ không (required fields đã điền)
    if (form.checkValidity() === false) {
      return;  // Nếu không hợp lệ → dừng lại, không gọi API
    }

    // Xóa error message cũ
    setGeneralError("");
    
    // Gọi hàm login từ AuthContext
    // login() sẽ:
    // - Fetch accounts từ API
    // - Tìm user khớp với email/username và password
    // - Lưu user vào state và sessionStorage
    // - Navigate về redirectPath
    // - Return { success: true } hoặc { success: false, message: "..." }
    const result = await login(email, password);
    
    // Nếu login thất bại → hiển thị error message
    if (!result.success) {
      setGeneralError(result.message);
    }
    // Nếu login thành công → không cần làm gì thêm vì AuthContext đã tự động navigate
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">Welcome Back!</h2>

        {/* Hiển thị error message nếu có */}
        {generalError && <Alert variant="danger">{generalError}</Alert>}

        {/* Form đăng nhập với Bootstrap validation */}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Input email/username */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Cập nhật state khi user nhập
              required  // Bắt buộc phải điền
            />
            <Form.Control.Feedback type="invalid">
              Username or Email is required.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Input password với toggle show/hide */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}  // Hiển thị text hoặc password dựa vào showPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}  // Cập nhật state khi user nhập
                required  // Bắt buộc phải điền
              />
              {/* Nút toggle show/hide password */}
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}  // Toggle showPassword state
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Icon thay đổi dựa vào showPassword */}
              </Button>
              <Form.Control.Feedback type="invalid">
                Password is required.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Nút submit */}
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>

        {/* Link đến trang đăng ký */}
        <div className="mt-3 text-center">
          Don't have account? <Link to="/register">Sign Up</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
