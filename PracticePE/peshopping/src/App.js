/**
 * FILE: App.js
 * TÁC DỤNG: Component chính của ứng dụng, định nghĩa routing và layout
 * 
 * CẤU TRÚC GIAO DIỆN:
 * ┌─────────────────────────────┐
 * │   HeaderComponent (Navbar)  │ ← Header (điều hướng)
 * ├─────────────────────────────┤
 * │                             │
 * │   Routes (Nội dung chính)   │ ← Nội dung thay đổi theo route
 * │   - HomePage (/)             │
 * │   - StorePage (/store)       │
 * │                             │
 * ├─────────────────────────────┤
 * │   FooterComponent            │ ← Footer (chân trang)
 * └─────────────────────────────┘
 * 
 * MAPPING ROUTES:
 * - "/" → HomePage (trang chủ với carousel)
 * - "/store" → StorePage (trang hiển thị danh sách sản phẩm)
 */

// Import BrowserRouter, Routes, Route từ react-router-dom để định nghĩa routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import CSS cho App component
import "./App.css";

// Import Bootstrap CSS (framework CSS để styling)
import "bootstrap/dist/css/bootstrap.min.css";

// Import các components
import HeaderComponent from "./components/HeaderComponent"; // Header có navigation bar
import HomePage from "./pages/HomePage"; // Trang chủ
import FooterComponent from "./components/FooterComponent"; // Footer
import StorePage from "./pages/StorePage"; // Trang cửa hàng

/**
 * App Component - Component chính của ứng dụng
 * @returns {JSX.Element} - JSX chứa routing và layout
 */
function App() {
  return (
    // BrowserRouter: Bật routing cho ứng dụng (cho phép dùng URL để điều hướng)
    <BrowserRouter>
      {/* HeaderComponent: Hiển thị ở trên cùng mọi trang */}
      {/* Giao diện: Navbar với logo "Fresh Food Mart" và menu Home/Store/Login */}
      <HeaderComponent />
      
      {/* Container: Bootstrap class để căn giữa và giới hạn chiều rộng */}
      {/* mt-4: margin-top để tạo khoảng cách với header */}
      <div className="container mt-4">
        {/* Routes: Định nghĩa các route (đường dẫn URL) */}
        <Routes>
          {/* Route "/": Khi URL = "/" hoặc "/" → hiển thị HomePage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route "/store": Khi URL = "/store" → hiển thị StorePage */}
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </div>
      
      {/* FooterComponent: Hiển thị ở dưới cùng mọi trang */}
      {/* Giao diện: Footer màu đen với copyright text */}
      <FooterComponent />
    </BrowserRouter>
  );
}

// Export App để index.js có thể import
export default App;
