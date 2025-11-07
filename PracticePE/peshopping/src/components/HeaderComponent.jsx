/**
 * FILE: HeaderComponent.jsx
 * TÁC DỤNG: Component hiển thị header/navbar ở trên cùng mọi trang
 * FOLDER: src/components/ - Chứa các components tái sử dụng được
 * 
 * GIAO DIỆN:
 * ┌─────────────────────────────────────────────┐
 * │ [Fresh Food Mart] [Home] [Store]    [Login] │ ← Navbar màu xanh
 * └─────────────────────────────────────────────┘
 * 
 * MAPPING:
 * App.js → HeaderComponent → hiển thị ở trên cùng mọi trang
 */

// Import React (bắt buộc cho JSX)
import React from "react";

// Import Navbar, Nav, Container, NavDropdown từ react-bootstrap
// react-bootstrap: Thư viện Bootstrap components cho React
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

// Import Link từ react-router-dom để điều hướng
import { Link, useNavigate } from "react-router-dom";

// Import useAuth từ AuthContext để lấy thông tin user và authentication
import { useAuth } from "../context/AuthContext";

/**
 * HeaderComponent - Component hiển thị navigation bar
 * @returns {JSX.Element} - JSX chứa navbar
 */
function HeaderComponent() {
  // useAuth: Lấy thông tin authentication từ AuthContext
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // handleLogout: Xử lý khi user click nút Logout
  const handleLogout = () => {
    logout(); // Gọi logout từ AuthContext
    navigate("/"); // Chuyển về trang chủ
  };

  return (
    // Navbar: Bootstrap navbar component
    // bg="primary": Màu nền xanh (Bootstrap primary color)
    // data-bs-theme="dark": Theme tối (text màu trắng)
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      {/* Container: Bootstrap container để căn giữa nội dung */}
      <Container>
        {/* Navbar.Brand: Logo/tên thương hiệu ở góc trái */}
        {/* as={Link} to="/": Link khi click vào logo, dùng React Router Link */}
        <Navbar.Brand as={Link} to="/">Fresh Food Mart</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav: Container chứa các menu items */}
          {/* className="me-auto": margin-end auto (đẩy sang phải) */}
          <Nav className="me-auto">
            {/* Nav.Link: Menu item "Home" */}
            {/* as={Link} to="/": Link đến trang chủ, dùng React Router Link */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {/* Nav.Link: Menu item "Store" */}
            {/* as={Link} to="/store": Link đến trang cửa hàng, dùng React Router Link */}
            <Nav.Link as={Link} to="/store">Store</Nav.Link>
          </Nav>
          
          {/* Nav: Container cho phần menu bên phải */}
          <Nav className="ms-auto">
            {/* Nếu chưa đăng nhập: Hiển thị nút Login */}
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="text-white">
                Login
              </Nav.Link>
            )}
            
            {/* Nếu đã đăng nhập: Hiển thị dropdown với user info và Logout */}
            {isAuthenticated && user && (
              <NavDropdown title={`👤 ${user.username}`} id="user-dropdown" align="end">
                <NavDropdown.ItemText>
                  <small>{user.email}</small>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>🚪 Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Export component để các file khác có thể import
export default HeaderComponent;
