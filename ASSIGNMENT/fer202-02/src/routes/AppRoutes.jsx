//AppRoutes.js định nghĩa các route cho ứng dụng sử dụng React Router
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage'; 
import AddExpensePage from '../pages/AddExpensePage.jsx';
import ExpenseDetailsPage from '../pages/ExpenseDetailsPage.jsx';

// Component để bảo vệ các route cần xác thực
const PrivateRoute = ({ children }) => {
    // Lấy trực tiếp isAuthenticated từ useAuth()
    const { isAuthenticated } = useAuth(); 
    
    // Nếu chưa đăng nhập, chuyển hướng đến /login
    return isAuthenticated ? children : <Navigate to="/login" />;
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
                        <PrivateRoute>
                            {/* Component Trang chủ/Dashboard */}
                            <DashboardPage /> 
                        </PrivateRoute>
                    } 
                />

                {/* 4. Route thêm mới thanh toán */}
                <Route 
                    path="/expenses/new" 
                    element={
                        <PrivateRoute>
                            <AddExpensePage />
                        </PrivateRoute>
                    } 
                />

                {/* 5. Route chỉnh sửa thanh toán */}
                <Route 
                    path="/expenses/:expenseId/edit" 
                    element={
                        <PrivateRoute>
                            <AddExpensePage />
                        </PrivateRoute>
                    } 
                />

                {/* 6. Route xem chi tiết thanh toán */}
                <Route 
                    path="/expenses/:expenseId" 
                    element={
                        <PrivateRoute>
                            <ExpenseDetailsPage />
                        </PrivateRoute>
                    } 
                />
                
                {/* 7. Xử lý tất cả các đường dẫn không xác định: Chuyển hướng đến /home */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
