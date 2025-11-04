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

// Import Navbar, Nav, Container từ react-bootstrap
// react-bootstrap: Thư viện Bootstrap components cho React
import { Navbar, Nav, Container } from "react-bootstrap";

/**
 * HeaderComponent - Component hiển thị navigation bar
 * @returns {JSX.Element} - JSX chứa navbar
 */
function HeaderComponent() {
  return (
    // Navbar: Bootstrap navbar component
    // bg="primary": Màu nền xanh (Bootstrap primary color)
    // data-bs-theme="dark": Theme tối (text màu trắng)
    <Navbar bg="primary" data-bs-theme="dark">
      {/* Container: Bootstrap container để căn giữa nội dung */}
      <Container>
        {/* Navbar.Brand: Logo/tên thương hiệu ở góc trái */}
        {/* href="#home": Link khi click vào logo */}
        <Navbar.Brand href="#home">Fresh Food Mart</Navbar.Brand>
        
        {/* Nav: Container chứa các menu items */}
        {/* className="me-auto": margin-end auto (đẩy sang phải) */}
        <Nav className="me-auto">
          {/* Nav.Link: Menu item "Home" */}
          {/* href="/": Link đến trang chủ */}
          <Nav.Link href="/">Home</Nav.Link>
          
          {/* Nav.Link: Menu item "Store" */}
          {/* href="/store": Link đến trang cửa hàng */}
          <Nav.Link href="/store">Store</Nav.Link>
        </Nav>
        
        {/* Navbar.Collapse: Container cho phần menu bên phải */}
        {/* className="justify-content-end": Căn phải */}
        <Navbar.Collapse className="justify-content-end">
          {/* Nav.Link: Menu item "Login" */}
          {/* href="": Link trống (chưa có trang login) */}
          {/* className="text-white": Text màu trắng */}
          <Nav.Link href="" className="text-white">Login</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Export component để các file khác có thể import
export default HeaderComponent;
