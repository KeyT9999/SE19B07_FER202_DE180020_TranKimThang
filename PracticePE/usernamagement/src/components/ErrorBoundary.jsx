/**
 * ErrorBoundary.jsx - Component bắt lỗi (Error Boundary)
 * 
 * CHỨC NĂNG CHÍNH:
 * - Bắt lỗi JavaScript ở bất kỳ đâu trong component tree
 * - Hiển thị UI thân thiện thay vì crash app
 * - Log lỗi ra console để debug
 * - Cho phép user quay lại trang đăng nhập
 * 
 * KHI NÀO HOẠT ĐỘNG:
 * - Lỗi trong render method
 * - Lỗi trong lifecycle methods
 * - Lỗi trong constructors của components bên trong
 * 
 * KHÔNG BẮT ĐƯỢC:
 * - Lỗi trong event handlers
 * - Lỗi trong asynchronous code (setTimeout, promises)
 * - Lỗi trong server-side rendering
 * - Lỗi trong chính ErrorBoundary component
 * 
 * LUỒNG XỬ LÝ:
 * 1. Component bên trong throw error
 * 2. getDerivedStateFromError() được gọi → Cập nhật state hasError = true
 * 3. componentDidCatch() được gọi → Log lỗi ra console, lưu error và errorInfo
 * 4. render() kiểm tra hasError:
 *    - Nếu true: Hiển thị UI lỗi
 *    - Nếu false: Render children bình thường
 * 5. User click "Quay lại trang đăng nhập" → Reset state và redirect đến /login
 */

// Import React
import React from 'react';

// Import Bootstrap components để tạo UI
import { Container, Alert, Button } from 'react-bootstrap';

/**
 * ErrorBoundary - Class component để bắt lỗi
 * 
 * LÝ DO DÙNG CLASS COMPONENT:
 * - Error Boundary chỉ có thể được implement bằng class component
 * - Function components không thể implement getDerivedStateFromError và componentDidCatch
 */
class ErrorBoundary extends React.Component {
    // ==========================================
    // CONSTRUCTOR - KHỞI TẠO STATE
    // ==========================================

    /**
     * constructor - Khởi tạo component
     * 
     * STATE:
     * - hasError: false - Chưa có lỗi
     * - error: null - Không có error object
     * - errorInfo: null - Không có error info
     */
    constructor(props) {
        super(props);
        
        // Khởi tạo state
        this.state = { 
            hasError: false,  // Flag để đánh dấu có lỗi không
            error: null,  // Error object (nếu có)
            errorInfo: null  // Error info object (nếu có)
        };
    }

    // ==========================================
    // STATIC METHOD - CẬP NHẬT STATE KHI CÓ LỖI
    // ==========================================

    /**
     * getDerivedStateFromError - Static method được gọi khi có lỗi
     * 
     * LUỒNG XỬ LÝ:
     * 1. Component con throw error
     * 2. getDerivedStateFromError() được gọi với error
     * 3. Return state mới với hasError = true
     * 4. State được cập nhật → Component re-render
     * 
     * @param {Error} error - Error object được throw
     * @returns {Object} State mới với hasError = true
     */
    static getDerivedStateFromError(error) {
        // Cập nhật state để hiển thị UI lỗi
        return { hasError: true };
    }

    // ==========================================
    // LIFECYCLE METHOD - LOG LỖI
    // ==========================================

    /**
     * componentDidCatch - Lifecycle method được gọi khi có lỗi
     * 
     * LUỒNG XỬ LÝ:
     * 1. getDerivedStateFromError() được gọi trước
     * 2. componentDidCatch() được gọi sau
     * 3. Log lỗi ra console để debug
     * 4. Lưu error và errorInfo vào state
     * 
     * @param {Error} error - Error object được throw
     * @param {Object} errorInfo - Object chứa thông tin về component stack
     */
    componentDidCatch(error, errorInfo) {
        // Log lỗi ra console để debug
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Lưu error và errorInfo vào state để hiển thị trong UI (nếu cần)
        this.setState({
            error,
            errorInfo
        });
    }

    // ==========================================
    // EVENT HANDLER - RESET VÀ REDIRECT
    // ==========================================

    /**
     * handleReset - Xử lý khi user click "Quay lại trang đăng nhập"
     * 
     * LUỒNG XỬ LÝ:
     * 1. User click button → handleReset() được gọi
     * 2. Reset state về trạng thái ban đầu
     * 3. Redirect đến /login bằng window.location.href
     * 
     * LÝ DO DÙNG window.location.href:
     * - Force reload toàn bộ page
     * - Đảm bảo app được reset hoàn toàn
     */
    handleReset = () => {
        // Reset state về trạng thái ban đầu
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null 
        });
        
        // Redirect đến trang đăng nhập bằng window.location.href
        // (Force reload toàn bộ page)
        window.location.href = '/login';
    };

    // ==========================================
    // RENDER
    // ==========================================

    /**
     * render - Render component
     * 
     * LUỒNG XỬ LÝ:
     * 1. Kiểm tra hasError:
     *    - Nếu true: Hiển thị UI lỗi
     *    - Nếu false: Render children bình thường
     */
    render() {
        // Nếu có lỗi, hiển thị UI lỗi
        if (this.state.hasError) {
            return (
                // Container: Wrapper chính
                // className="mt-5": Margin top 5
                <Container className="mt-5">
                    {/* Alert: Component hiển thị thông báo lỗi
                        variant="danger": Màu đỏ */}
                    <Alert variant="danger">
                        {/* Tiêu đề thông báo */}
                        <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
                        
                        {/* Thông báo chi tiết */}
                        <p>
                            Ứng dụng gặp sự cố. Vui lòng thử lại hoặc liên hệ quản trị viên.
                        </p>
                        
                        {/* Chi tiết lỗi (chỉ hiển thị trong development mode) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            // details: Component HTML để hiển thị/thu gọn nội dung
                            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                                {/* summary: Tiêu đề có thể click để mở/đóng */}
                                <summary>Chi tiết lỗi (chế độ phát triển)</summary>
                                
                                {/* pre: Hiển thị text với định dạng giữ nguyên */}
                                <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
                                    {/* Hiển thị error message */}
                                    {this.state.error.toString()}
                                    
                                    {/* Hiển thị component stack (để biết lỗi xảy ra ở component nào) */}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        
                        {/* HR: Đường kẻ ngang */}
                        <hr />
                        
                        {/* Button: Nút "Quay lại trang đăng nhập"
                            variant="outline-danger": Style outline với viền đỏ
                            onClick: Xử lý khi click (gọi handleReset) */}
                        <Button 
                            variant="outline-danger" 
                            onClick={this.handleReset}
                        >
                            Quay lại trang đăng nhập
                        </Button>
                    </Alert>
                </Container>
            );
        }

        // Nếu không có lỗi, render children bình thường
        // (Các components bên trong ErrorBoundary)
        return this.props.children;
    }
}

// Export component để có thể import ở file khác (App.js)
export default ErrorBoundary;
