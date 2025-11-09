import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Context Providers - Quản lý state toàn cục
import { AuthProvider } from "./contexts/AuthContext";      // Quản lý authentication (login/logout)
 
// Import các components (pages)
import LoginForm from "./components/LoginForm";              // Trang đăng nhập

function App() {
  return (
    // BrowserRouter: Cung cấp routing cho toàn bộ ứng dụng
    <BrowserRouter>
      {/* AuthProvider: Cung cấp authentication context cho toàn bộ app
          Tất cả components bên trong có thể sử dụng useAuth() để truy cập auth state */}
      <AuthProvider>
        {/* Routes: Container chứa tất cả các route definitions */}
        <Routes>
          {/* Route: Trang đăng nhập */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;