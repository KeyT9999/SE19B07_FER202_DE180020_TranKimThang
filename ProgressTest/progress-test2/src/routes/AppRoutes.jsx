//AppRoutes.js định nghĩa các route cho ứng dụng sử dụng React Router
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage'; 
import AddPaymentPage from '../pages/AddPaymentPage.jsx';
import PaymentDetailsPage from '../pages/PaymentDetailsPage.jsx';
import UserListPage from '../pages/UserListPage';
import AccessDeniedPage from '../pages/AccessDeniedPage';

// Component để bảo vệ các route cần xác thực
const PrivateRoute = ({ children }) => {
    // Lấy trực tiếp isAuthenticated từ useAuth()
    const { isAuthenticated } = useAuth(); 
    
    // Nếu chưa đăng nhập, chuyển hướng đến /login
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Component để bảo vệ các route cần quyền admin và status active
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    
    // Nếu chưa đăng nhập, chuyển hướng đến /login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    // Nếu không phải admin hoặc status không active
    if (user && (user.role !== 'admin' || user.status !== 'active')) {
        return <Navigate to="/access-denied" />;
    }
    
    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* 1. Trang mặc định: Chuyển hướng đến /home nếu đã đăng nhập, ngược lại là /login */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                {/* 2. Trang Đăng nhập */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 3. Định nghĩa route bảo vệ cho Trang Chủ/Dashboard (yêu cầu: /home ) */}
                <Route 
                    path="/home" 
                    element={
                        <AdminRoute>
                            {/* Component Trang chủ/Dashboard */}
                            <DashboardPage /> 
                        </AdminRoute>
                    } 
                />

                {/* 4. Route thêm mới thanh toán */}
                <Route 
                    path="/payments/new" 
                    element={
                        <PrivateRoute>
                            <AddPaymentPage />
                        </PrivateRoute>
                    } 
                />

                {/* 5. Route chỉnh sửa thanh toán */}
                <Route 
                    path="/payments/:paymentId/edit" 
                    element={
                        <PrivateRoute>
                            <AddPaymentPage />
                        </PrivateRoute>
                    } 
                />

                {/* 6. Route xem chi tiết thanh toán */}
                <Route 
                    path="/payments/:paymentId" 
                    element={
                        <PrivateRoute>
                            <PaymentDetailsPage />
                        </PrivateRoute>
                    } 
                />

                {/* 7. Route quản lý người dùng - yêu cầu admin */}
                <Route 
                    path="/users" 
                    element={
                        <AdminRoute>
                            <UserListPage />
                        </AdminRoute>
                    } 
                />

                {/* 8. Route từ chối truy cập */}
                <Route 
                    path="/access-denied" 
                    element={<AccessDeniedPage />} 
                />
                
                {/* 9. Xử lý tất cả các đường dẫn không xác định: Chuyển hướng đến /home */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
