//ConfirmModal.jsx - Reusable confirmation modal component
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * ConfirmModal - Component tái sử dụng cho các dialog xác nhận
 * 
 * Props:
 * @param {boolean} show - Hiển thị/ẩn modal
 * @param {function} onHide - Function được gọi khi đóng modal
 * @param {function} onConfirm - Function được gọi khi xác nhận
 * @param {string} title - Tiêu đề modal
 * @param {string} message - Nội dung thông báo
 * @param {string} confirmText - Text cho button xác nhận (default: "Xác nhận")
 * @param {string} cancelText - Text cho button hủy (default: "Hủy")
 * @param {string} variant - Variant cho button xác nhận (default: "primary")
 * @param {boolean} loading - Trạng thái loading cho button xác nhận
 */
function ConfirmModal({
    show,
    onHide,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "primary",
    loading = false
}) {
    // Handle confirm action
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        if (onHide) {
            onHide();
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <p className="mb-0">{message}</p>
            </Modal.Body>
            
            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                
                <Button 
                    variant={variant} 
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        confirmText
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;
