/*
 * COMPONENT: LoginFormComponents.jsx
 * MỤC ĐÍCH: Minh họa form validation với multiple states và React Bootstrap Form components
 * 
 * LUỒNG CHUẨN FORM VALIDATION:
 * 1. Khởi tạo multiple states (form fields + errors + modal)
 * 2. Tạo validation functions
 * 3. Handle input changes với validation
 * 4. Handle form submission với error checking
 * 5. Sử dụng React Bootstrap Form components với validation feedback
 */

// Import useState hook cho state management
import { useState } from 'react';
// Import React Bootstrap components cho form UI
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';  

function LoginForm({ onSubmit }) {
  /*
   * KHỞI TẠO MULTIPLE STATES:
   * Mỗi form field có state riêng để quản lý giá trị
   */
  const [username, setUsername] = useState('');     // State cho username input
  const [password, setPassword] = useState('');     // State cho password input
  const [errors, setErrors] = useState({});         // State cho validation errors (object)

  /*
   * MODAL STATE:
   * State để hiển thị/ẩn modal thông báo đăng nhập thành công
   */
  const [showModal, setShowModal] = useState(false);

  /*
   * INPUT CHANGE HANDLERS với REAL-TIME VALIDATION:
   * Validate ngay khi user nhập để cung cấp feedback tức thì
   */
  const handleUsernameChange = (e) => {
    // Cập nhật username state
    setUsername(e.target.value);
    
    // VALIDATION LOGIC:
    if (e.target.value.trim() === '') {
      // Nếu rỗng: thêm error vào errors object
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
    } else {
      // Nếu có giá trị: xóa error khỏi errors object
      setErrors((prev) => {
        const { username, ...rest } = prev;  // Destructuring để loại bỏ username error
        return rest;
      });
    }
  }
  // Tương tự cho password field
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim() === '') {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
    } else {
      setErrors((prev) => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  }
  /*
   * FORM SUBMISSION HANDLER:
   * Validate tất cả fields khi submit và xử lý kết quả
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn form reload trang
    
    // VALIDATE TẤT CẢ FIELDS:
    const newErrors = {};       
    if (username.trim() === '') {
      newErrors.username = 'Username is required';
    }
    if (password.trim() === '') {
      newErrors.password = 'Password is required';
    }
    
    // Cập nhật errors state
    setErrors(newErrors);
    
    // Nếu không có lỗi nào (object rỗng):
    if (Object.keys(newErrors).length === 0) {
      //onSubmit({ username, password });  // Có thể gọi callback function
      setShowModal(true); // Hiển thị modal thành công
    }
  }
  /*
   * MODAL CLOSE HANDLER:
   * Reset tất cả states khi đóng modal
   */
  const handleCloseModal = () => {
    setShowModal(false);        // Ẩn modal
    setUsername('');           // Reset username
    setPassword('');           // Reset password
    setErrors({});             // Clear errors
  }

  /*
   * RETURN JSX với REACT BOOTSTRAP COMPONENTS:
   * Sử dụng Container, Row, Col, Card, Form components
   */
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
            {/* 
             * REACT BOOTSTRAP CARD:
             * Card component để tạo container đẹp cho form
             */}
            <Card>
                <Card.Header>
                    <h3 className="text-center">Login</h3>
                </Card.Header>
                <Card.Body>
                    {/* 
                     * REACT BOOTSTRAP FORM:
                     * Form component với onSubmit handler
                     */}
                    <Form onSubmit={handleSubmit}>  
                        {/* 
                         * FORM GROUP với VALIDATION:
                         * Form.Group để nhóm label và input
                         * isInvalid prop để hiển thị error state
                         */}
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text"
                                value={username}                    // Controlled component
                                onChange={handleUsernameChange}     // Event handler
                                isInvalid={!!errors.username}      // Boolean: true nếu có error
                                placeholder="Enter username"
                            />
                            {/* 
                             * VALIDATION FEEDBACK:
                             * Form.Control.Feedback hiển thị error message
                             */}
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Tương tự cho password field */}
                        <Form.Group controlId="password" className="mb-3">  
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password"
                                value={password}
                                onChange={handlePasswordChange} 
                                isInvalid={!!errors.password}   
                                placeholder="Enter password"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>   
                        {/* 
                         * SUBMIT BUTTON:
                         * Button với variant và full width
                         */}
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
        </Row>
        {/* 
         * REACT BOOTSTRAP MODAL:
         * Modal component để hiển thị thông báo thành công
         */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome, {username}!</p>  {/* Hiển thị username từ state */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
    );
}

export default LoginForm;