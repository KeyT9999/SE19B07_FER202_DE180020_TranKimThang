/**
 * App.js - Component gốc của ứng dụng
 * 
 * LUỒNG XỬ LÝ:
 * 1. Component này là entry point của ứng dụng
 * 2. Bọc toàn bộ app trong ErrorBoundary để bắt lỗi
 * 3. Bọc trong AuthProvider để cung cấp context authentication cho tất cả components
 * 4. AppRoutes quản lý routing và điều hướng giữa các trang
 */

// Import React - thư viện chính để xây dựng UI
import React from 'react';

// Import CSS của Bootstrap - framework UI để tạo giao diện đẹp
import 'bootstrap/dist/css/bootstrap.min.css';

// Import CSS tùy chỉnh của ứng dụng
import './App.css';

// Import AuthProvider - Component cung cấp context authentication (login, logout, user state)
import { AuthProvider } from './contexts/AuthContext.jsx';

// Import AppRoutes - Component quản lý routing (điều hướng giữa các trang)
import AppRoutes from './routes/AppRoutes.jsx';

// Import ErrorBoundary - Component bắt lỗi để hiển thị thông báo lỗi thân thiện thay vì crash app
import ErrorBoundary from './components/ErrorBoundary.jsx';

/**
 * Component App - Component chính của ứng dụng
 * 
 * CẤU TRÚC:
 * - ErrorBoundary: Bọc ngoài cùng để bắt mọi lỗi trong app
 *   - AuthProvider: Cung cấp authentication context cho tất cả components bên trong
 *     - AppRoutes: Quản lý routing và hiển thị trang tương ứng với URL
 */
function App() {
  return (
    // ErrorBoundary: Nếu có lỗi xảy ra ở bất kỳ đâu trong app, hiển thị trang lỗi thay vì crash
    <ErrorBoundary>
      {/* AuthProvider: Cung cấp authentication state và functions (login, logout, user) 
          cho tất cả components con thông qua Context API */}
      <AuthProvider>
        {/* AppRoutes: Quản lý routing, định nghĩa các route và điều hướng giữa các trang
            - /login: Trang đăng nhập
            - /users: Trang quản lý users (yêu cầu admin)
            - /access-denied: Trang từ chối truy cập */}
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Export component App để có thể import ở file khác (thường là index.js)
export default App;
