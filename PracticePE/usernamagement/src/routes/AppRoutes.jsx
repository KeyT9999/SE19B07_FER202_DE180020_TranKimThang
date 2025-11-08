/**
 * AppRoutes.jsx - Quản lý routing và điều hướng của ứng dụng
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Định nghĩa các route (đường dẫn) của ứng dụng
 * 2. Bảo vệ các route cần authentication và quyền admin
 * 3. Điều hướng giữa các trang
 * 
 * CÁC ROUTE:
 * - / (root): Redirect đến /users
 * - /login: Trang đăng nhập (public)
 * - /users: Trang quản lý users (yêu cầu admin, được bảo vệ bởi AdminRoute)
 * - /access-denied: Trang từ chối truy cập (public)
 * - * (404): Redirect đến /users
 * 
 * LUỒNG XỬ LÝ:
 * 1. User truy cập URL → Router kiểm tra route khớp
 * 2. Nếu route được bảo vệ (AdminRoute):
 *    - Kiểm tra isAuthenticated (đã đăng nhập chưa)
 *    - Nếu chưa đăng nhập: Redirect đến /login
 *    - Kiểm tra role và status (phải là admin và active)
 *    - Nếu không phải admin hoặc không active: Redirect đến /access-denied
 *    - Nếu hợp lệ: Hiển thị component tương ứng
 * 3. Nếu route public: Hiển thị component tương ứng
 */

// Import React
import React from 'react';

// Import React Router components để quản lý routing
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import AuthContext để kiểm tra authentication và quyền
import { useAuth } from '../contexts/AuthContext.jsx';

// Import các pages (components)
import LoginPage from '../pages/LoginPage';  // Trang đăng nhập
import UserListPage from '../pages/UserListPage';  // Trang quản lý users
import AccessDeniedPage from '../pages/AccessDeniedPage';  // Trang từ chối truy cập

// ==========================================
// PROTECTED ROUTE COMPONENTS
// ==========================================

/**
 * AdminRoute - Component bảo vệ route yêu cầu quyền admin
 * 
 * LUỒNG XỬ LÝ:
 * 1. Lấy isAuthenticated và user từ AuthContext
 * 2. Kiểm tra isAuthenticated:
 *    - Nếu false: Redirect đến /login
 * 3. Kiểm tra role và status:
 *    - Nếu user.role !== 'admin' hoặc user.status !== 'active': Redirect đến /access-denied
 * 4. Nếu hợp lệ: Hiển thị children (component được bảo vệ)
 * 
 * @param {React.ReactNode} children - Component cần được bảo vệ (ví dụ: UserListPage)
 * @returns {JSX.Element} Component children nếu hợp lệ, hoặc Navigate component để redirect
 */
const AdminRoute = ({ children }) => {
    // Lấy thông tin authentication từ AuthContext
    const { isAuthenticated, user } = useAuth();
    
    // Bước 1: Kiểm tra đã đăng nhập chưa
    // Nếu chưa đăng nhập, redirect đến trang đăng nhập
    if (!isAuthenticated) {
        // Navigate component tự động redirect đến /login
        return <Navigate to="/login" />;
    }
    
    // Bước 2: Kiểm tra quyền admin và status active
    // Chỉ cho phép user có role = 'admin' và status = 'active' truy cập
    if (user && (user.role !== 'admin' || user.status !== 'active')) {
        // Nếu không phải admin hoặc không active, redirect đến trang từ chối truy cập
        return <Navigate to="/access-denied" />;
    }
    
    // Bước 3: Nếu hợp lệ, hiển thị component được bảo vệ
    return children;
};

// ==========================================
// MAIN ROUTES COMPONENT
// ==========================================

/**
 * AppRoutes - Component chính quản lý routing
 * 
 * LUỒNG XỬ LÝ:
 * 1. BrowserRouter: Bọc tất cả routes để quản lý URL và navigation
 * 2. Routes: Container chứa các Route components
 * 3. Route: Định nghĩa từng route và component tương ứng
 * 4. Navigate: Component để redirect đến route khác
 */
const AppRoutes = () => {
    return (
        // BrowserRouter: Cung cấp routing context cho tất cả components con
        // Sử dụng HTML5 History API để quản lý URL
        <Router>
            {/* Routes: Container chứa tất cả các route definitions */}
            <Routes>
                {/* 
                    Route 1: Trang mặc định (root path "/")
                    - Khi user truy cập "/", tự động redirect đến "/users"
                    - replace: Thay thế history entry (không thêm vào history stack)
                */}
                <Route path="/" element={<Navigate to="/users" replace />} />
                
                {/* 
                    Route 2: Trang đăng nhập
                    - Path: /login
                    - Component: LoginPage (trang đăng nhập)
                    - Public route: Không cần authentication
                */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 
                    Route 3: Trang quản lý users
                    - Path: /users
                    - Component: UserListPage (trang quản lý users)
                    - Protected route: Yêu cầu admin và active status
                    - Được bảo vệ bởi AdminRoute component
                */}
                <Route 
                    path="/users" 
                    element={
                        // AdminRoute: Bảo vệ route, chỉ cho phép admin và active user truy cập
                        <AdminRoute>
                            {/* UserListPage: Component hiển thị danh sách users */}
                            <UserListPage />
                        </AdminRoute>
                    } 
                />

                {/* 
                    Route 4: Trang từ chối truy cập
                    - Path: /access-denied
                    - Component: AccessDeniedPage (trang từ chối truy cập)
                    - Public route: Không cần authentication
                    - Hiển thị khi user không có quyền truy cập
                */}
                <Route 
                    path="/access-denied" 
                    element={<AccessDeniedPage />} 
                />
                
                {/* 
                    Route 5: Route catch-all (404)
                    - Path: * (bất kỳ path nào không khớp với routes trên)
                    - Component: Navigate đến /users
                    - Xử lý các đường dẫn không xác định
                */}
                <Route path="*" element={<Navigate to="/users" replace />} />
            </Routes>
        </Router>
    );
};

// Export component để có thể import ở file khác
export default AppRoutes;
