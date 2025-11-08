/**
 * LoginPage.jsx - Trang đăng nhập
 * 
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị form đăng nhập cho user
 * - Wrapper component cho LoginForm
 * 
 * LUỒNG XỬ LÝ:
 * 1. User truy cập /login → LoginPage được render
 * 2. LoginPage render LoginForm component
 * 3. LoginForm xử lý logic đăng nhập (validation, submit, etc.)
 * 
 * CẤU TRÚC:
 * - Component đơn giản, chỉ render LoginForm
 * - Không có logic phức tạp, chỉ là wrapper
 */

// Import React
import React from 'react';

// Import LoginForm component để hiển thị form đăng nhập
import LoginForm from '../components/LoginForm';

/**
 * LoginPage - Component trang đăng nhập
 * 
 * CHỨC NĂNG:
 * - Render LoginForm component
 * - Không có logic phức tạp, chỉ là wrapper
 * 
 * @returns {JSX.Element} LoginForm component
 */
const LoginPage = () => {
    return (
        // Render LoginForm component
        // LoginForm sẽ xử lý tất cả logic đăng nhập (validation, submit, error handling)
        <LoginForm />
    );
};

// Export component để có thể import ở file khác (AppRoutes.jsx)
export default LoginPage;
