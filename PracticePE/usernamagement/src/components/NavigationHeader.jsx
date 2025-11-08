/**
 * NavigationHeader.jsx - Component thanh điều hướng (navbar)
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Hiển thị thông tin user đang đăng nhập
 * 2. Hiển thị nút logout
 * 3. Điều hướng giữa các trang
 * 
 * LUỒNG XỬ LÝ LOGOUT:
 * 1. User click "Logout" → handleLogout() được gọi
 * 2. Gọi logout() từ AuthContext → Xóa user khỏi localStorage và reset state
 * 3. Navigate đến /login → Chuyển hướng đến trang đăng nhập
 * 
 * TỐI ƯU PERFORMANCE:
 * - useMemo: Memoize fullName để tránh tính toán lại không cần thiết
 * - useCallback: Memoize handleLogout để tránh re-render không cần thiết
 */

// Import React hooks để tối ưu performance
import React, { useMemo, useCallback } from 'react';

// Import Bootstrap components để tạo UI
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

// Import AuthContext để lấy thông tin user và function logout
import { useAuth } from '../contexts/AuthContext.jsx';

// Import React Router để điều hướng
import { useNavigate } from 'react-router-dom';

/**
 * NavigationHeader - Component thanh điều hướng
 * 
 * CHỨC NĂNG:
 * - Hiển thị brand name và logo
 * - Hiển thị thông tin user đang đăng nhập
 * - Hiển thị nút logout
 * - Điều hướng giữa các trang
 */
const NavigationHeader = () => {
    // ==========================================
    // CONTEXT & HOOKS
    // ==========================================

    /**
     * user - Thông tin user hiện tại đang đăng nhập
     * logout - Function để đăng xuất
     * Được lấy từ: AuthContext (thông qua useAuth hook)
     */
    const { user, logout } = useAuth();

    /**
     * navigate - Function để điều hướng giữa các trang
     * Được lấy từ: React Router (useNavigate hook)
     */
    const navigate = useNavigate();

    // ==========================================
    // COMPUTED VALUES - TÍNH TOÁN GIÁ TRỊ
    // ==========================================

    /**
     * fullName - Tên đầy đủ của user để hiển thị
     * 
     * LUỒNG XỬ LÝ:
     * 1. Ưu tiên: user.fullName
     * 2. Nếu không có: user.username
     * 3. Nếu không có: 'Student' (mặc định)
     * 
     * Sử dụng useMemo để chỉ tính toán lại khi user thay đổi
     * (tối ưu performance)
     */
    const fullName = useMemo(() => 
        user?.fullName || user?.username || 'Student', 
        [user]
    );

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    /**
     * handleLogout() - Xử lý khi user click nút "Logout"
     * 
     * LUỒNG XỬ LÝ:
     * 1. User click "Logout" → handleLogout() được gọi
     * 2. Gọi logout() từ AuthContext:
     *    - Xóa user khỏi localStorage
     *    - Reset authentication state (isAuthenticated = false, user = null)
     * 3. Navigate đến /login:
     *    - Chuyển hướng user đến trang đăng nhập
     * 
     * Sử dụng useCallback để memoize function
     * (tối ưu performance - tránh tạo function mới mỗi lần render)
     */
    const handleLogout = useCallback(() => {
        // Bước 1: Gọi logout() từ AuthContext
        // - Xóa user khỏi localStorage
        // - Reset authentication state
        logout();
        
        // Bước 2: Chuyển hướng đến trang đăng nhập
        navigate('/login');
    }, [logout, navigate]); // Dependency: logout, navigate (đã được memoize ở AuthContext)

    // ==========================================
    // RENDER
    // ==========================================

    return (
        // Navbar: Component thanh điều hướng của Bootstrap
        // bg="primary": Màu nền primary (xanh dương)
        // variant="dark": Chữ màu trắng (tối)
        // expand="lg": Mở rộng trên màn hình lớn
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
            {/* Container: Wrapper để căn giữa nội dung */}
            <Container>
                {/* Navbar.Brand: Logo/Brand name của ứng dụng
                    href="/users": Link đến trang users khi click */}
                <Navbar.Brand href="/users">User Management</Navbar.Brand>
                
                {/* Navbar.Toggle: Nút toggle để mở/đóng menu trên mobile
                    aria-controls: ID của element được điều khiển */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                {/* Navbar.Collapse: Container chứa menu items
                    id="basic-navbar-nav": ID để Navbar.Toggle điều khiển */}
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Nav: Container cho các menu items bên trái
                        className="me-auto": Margin end auto (đẩy các items bên phải về cuối) */}
                    <Nav className="me-auto">
                        {/* Nav.Link: Menu item "User Management"
                            onClick: Xử lý khi click (navigate đến /users)
                            style: Inline style để set màu trắng và cursor pointer */}
                        <Nav.Link 
                            onClick={() => navigate('/users')} 
                            style={{ color: 'white', cursor: 'pointer' }}
                        >
                            User Management
                        </Nav.Link>
                    </Nav>
                    
                    {/* Nav: Container cho các menu items bên phải
                        className="ms-auto": Margin start auto (đẩy các items bên trái về đầu) */}
                    <Nav className="ms-auto">
                        {/* Navbar.Text: Text hiển thị thông tin user
                            className="me-3": Margin end 3 (khoảng cách bên phải) */}
                        <Navbar.Text className="me-3">
                            {/* Hiển thị "Signed in as: [fullName]" */}
                            Signed in as: <strong>{fullName}</strong>
                        </Navbar.Text>
                        
                        {/* Button: Nút "Logout"
                            variant="outline-light": Style outline với viền trắng
                            onClick: Xử lý khi click (gọi handleLogout) */}
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

// Export component để có thể import ở file khác
export default NavigationHeader;
