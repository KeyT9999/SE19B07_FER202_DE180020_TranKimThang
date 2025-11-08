/**
 * ConfirmModal.jsx - Component modal xác nhận hành động
 * 
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị modal xác nhận trước khi thực hiện hành động
 * - Có thể hiển thị thông báo, xác nhận, hoặc thông tin chi tiết
 * - Hỗ trợ nút "Xác nhận" và "Hủy"
 * - Có thể tùy chỉnh text của các nút
 * 
 * CÁC TRƯỜNG HỢP SỬ DỤNG:
 * 1. Xác nhận ban/unban user (UserTable)
 * 2. Xác nhận xóa dữ liệu
 * 3. Hiển thị thông báo thành công (LoginForm)
 * 4. Hiển thị thông tin chi tiết (UserTable - View Details)
 * 
 * LUỒNG XỬ LÝ:
 * 1. Parent component set show = true → Modal hiển thị
 * 2. User click "Xác nhận" → onConfirm() được gọi
 * 3. User click "Hủy" hoặc nút X → onHide() được gọi
 * 4. Parent component set show = false → Modal đóng
 */

// Import React
import React from 'react';

// Import Bootstrap components để tạo UI
import { Modal, Button } from 'react-bootstrap';

/**
 * ConfirmModal - Component modal xác nhận
 * 
 * PROPS:
 * - show: boolean - Hiển thị modal hay không
 * - title: string - Tiêu đề của modal
 * - message: string | JSX.Element - Nội dung của modal (có thể là string hoặc JSX)
 * - onConfirm: function - Function được gọi khi user click "Xác nhận"
 * - onHide: function - Function được gọi khi user click "Hủy" hoặc nút X
 * - confirmText: string - Text của nút "Xác nhận" (mặc định: 'Xác nhận')
 * - cancelText: string - Text của nút "Hủy" (mặc định: 'Hủy')
 * - showCancel: boolean - Hiển thị nút "Hủy" hay không (mặc định: true)
 */
const ConfirmModal = ({ 
    show,  // Hiển thị modal hay không
    title,  // Tiêu đề của modal
    message,  // Nội dung của modal (có thể là string hoặc JSX.Element)
    onConfirm,  // Function được gọi khi user click "Xác nhận"
    onHide,  // Function được gọi khi user click "Hủy" hoặc nút X
    confirmText = 'Xác nhận',  // Text của nút "Xác nhận" (mặc định)
    cancelText = 'Hủy',  // Text của nút "Hủy" (mặc định)
    showCancel = true  // Hiển thị nút "Hủy" hay không (mặc định: true)
}) => {
    // ==========================================
    // RENDER
    // ==========================================

    return (
        // Modal: Component modal của Bootstrap
        // show: Hiển thị modal hay không
        // onHide: Function được gọi khi user click nút X hoặc bên ngoài modal
        // centered: Căn giữa modal trên màn hình
        <Modal show={show} onHide={onHide} centered>
            {/* Modal.Header: Header của modal
                closeButton: Hiển thị nút X để đóng modal */}
            <Modal.Header closeButton>
                {/* Modal.Title: Tiêu đề của modal */}
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            
            {/* Modal.Body: Body của modal (nội dung chính) */}
            <Modal.Body>
                {/* Hiển thị message (có thể là string hoặc JSX.Element) */}
                {message}
            </Modal.Body>
            
            {/* Modal.Footer: Footer của modal (chứa các nút) */}
            <Modal.Footer>
                {/* Nút "Hủy" - Chỉ hiển thị nếu showCancel = true */}
                {showCancel && (
                    // Button: Nút "Hủy"
                    // variant="secondary": Màu xám
                    // onClick: Xử lý khi click (gọi onHide hoặc onConfirm)
                    <Button 
                        variant="secondary" 
                        onClick={onHide || onConfirm}
                    >
                        {/* Text của nút "Hủy" */}
                        {cancelText}
                    </Button>
                )}
                
                {/* Button: Nút "Xác nhận"
                    variant="primary": Màu xanh dương
                    onClick: Xử lý khi click (gọi onConfirm) */}
                <Button 
                    variant="primary" 
                    onClick={onConfirm}
                >
                    {/* Text của nút "Xác nhận" */}
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Export component để có thể import ở file khác
export default ConfirmModal;
