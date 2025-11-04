/**
 * App.js - Component chính của ứng dụng
 * 
 * Mục đích:
 * - Cấu hình React Router với các routes
 * - Wrap toàn bộ app với các Context Providers (AuthProvider, CartProvider)
 * - Định nghĩa cấu trúc điều hướng của ứng dụng
 * 
 * Luồng hoạt động:
 * 1. index.js render App component
 * 2. App component khởi tạo BrowserRouter, AuthProvider, CartProvider
 * 3. Routes định nghĩa các trang sẽ hiển thị tương ứng với URL
 * 
 * Routes:
 * - / → LoginForm (trang đăng nhập)
 * - /motorbikes → MotobikesList (danh sách xe máy)
 * - /view/:id → ViewMotorbike (chi tiết một xe máy, id là parameter)
 * - /cart → CartPage (trang giỏ hàng)
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Context Providers - Quản lý state toàn cục
import { AuthProvider } from "./contexts/AuthContext";      // Quản lý authentication (login/logout)
import { CartProvider } from "./contexts/CartContext";      // Quản lý giỏ hàng (add/remove/update)

// Import các components (pages)
import LoginForm from "./components/LoginForm";              // Trang đăng nhập
import MotobikesList from "./components/MotobikesList";      // Trang danh sách xe máy
import ViewMotorbike from "./components/ViewMotorbike";      // Trang chi tiết xe máy
import CartPage from "./components/CartPage";                // Trang giỏ hàng

function App() {
  return (
    // BrowserRouter: Cung cấp routing cho toàn bộ ứng dụng
    <BrowserRouter>
      {/* AuthProvider: Cung cấp authentication context cho toàn bộ app
          Tất cả components bên trong có thể sử dụng useAuth() để truy cập auth state */}
      <AuthProvider>
        {/* CartProvider: Cung cấp cart context cho toàn bộ app
            Tất cả components bên trong có thể sử dụng useCart() để truy cập cart state
            CartProvider nằm trong AuthProvider để có thể sử dụng auth nếu cần */}
        <CartProvider>
          {/* Container Bootstrap để tạo layout responsive */}
          <div className="container mt-4">
            {/* Routes: Định nghĩa các routes và component tương ứng */}
            <Routes>
              {/* Route mặc định - Trang đăng nhập */}
              <Route path="/" element={<LoginForm />} />
              
              {/* Route danh sách xe máy - Sau khi đăng nhập thành công sẽ chuyển đến đây */}
              <Route path="/motorbikes" element={<MotobikesList />} />
              
              {/* Route chi tiết xe máy - :id là dynamic parameter
                  Ví dụ: /view/1 → id = "1", /view/2 → id = "2"
                  Component ViewMotorbike sẽ lấy id này bằng useParams() */}
              <Route path="/view/:id" element={<ViewMotorbike />} />
              
              {/* Route giỏ hàng */}
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;