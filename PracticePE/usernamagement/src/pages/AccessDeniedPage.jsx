/**
 * AccessDeniedPage.jsx - Trang từ chối truy cập
 * 
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị thông báo khi user không có quyền truy cập
 * - Cho phép user quay lại trang đăng nhập
 * 
 * KHI NÀO HIỂN THỊ:
 * - User không phải admin
 * - User không có status = 'active'
 * - User cố truy cập route được bảo vệ bởi AdminRoute
 * 
 * LUỒNG XỬ LÝ:
 * 1. AdminRoute kiểm tra user không có quyền → Redirect đến /access-denied
 * 2. AccessDeniedPage hiển thị thông báo lỗi
 * 3. User click "Quay lại trang đăng nhập" → Navigate đến /login
 */

// Import React
import React from 'react';

// Import Bootstrap components để tạo UI
import { Container, Alert, Button } from 'react-bootstrap';

// Import React Router để điều hướng
import { useNavigate } from 'react-router-dom';

/**
 * AccessDeniedPage - Component trang từ chối truy cập
 * 
 * CHỨC NĂNG:
 * - Hiển thị thông báo lỗi khi user không có quyền truy cập
 * - Cung cấp nút để quay lại trang đăng nhập
 */
const AccessDeniedPage = () => {
    // ==========================================
    // HOOKS
    // ==========================================

    /**
     * navigate - Function để điều hướng giữa các trang
     * Được lấy từ: React Router (useNavigate hook)
     */
    const navigate = useNavigate();

    // ==========================================
    // RENDER
    // ==========================================

    return (
        // Container: Wrapper chính của trang
        // className="mt-5": Margin top 5 (khoảng cách phía trên)
        <Container className="mt-5">
            {/* Alert: Component hiển thị thông báo lỗi
                variant="danger": Màu đỏ (thông báo lỗi) */}
            <Alert variant="danger">
                {/* Alert.Heading: Tiêu đề của thông báo */}
                <Alert.Heading>
                    Tài khoản bị khóa, bạn không có quyền truy cập...
                </Alert.Heading>
                
                {/* Thông báo chi tiết */}
                <p>
                    Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.
                </p>
                
                {/* HR: Đường kẻ ngang để phân cách */}
                <hr />
                
                {/* Button: Nút "Quay lại trang đăng nhập"
                    variant="outline-danger": Style outline với viền đỏ
                    onClick: Xử lý khi click (navigate đến /login) */}
                <Button 
                    variant="outline-danger" 
                    onClick={() => navigate('/login')}
                >
                    Quay lại trang đăng nhập
                </Button>
            </Alert>
        </Container>
    );
};

// Export component để có thể import ở file khác (AppRoutes.jsx)
export default AccessDeniedPage;
