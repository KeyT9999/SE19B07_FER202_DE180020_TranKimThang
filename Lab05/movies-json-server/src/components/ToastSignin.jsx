//ToastSignin.jsx - Reusable toast notification component
import React, { useState, useEffect, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

/**
 * ToastSignin - Component tái sử dụng cho toast notifications
 * 
 * Props:
 * @param {boolean} show - Hiển thị/ẩn toast
 * @param {function} onClose - Function được gọi khi đóng toast
 * @param {string} title - Tiêu đề toast
 * @param {string} message - Nội dung thông báo
 * @param {string} variant - Variant của toast (success, danger, warning, info)
 * @param {number} delay - Thời gian tự động đóng (ms, default: 5000)
 * @param {string} position - Vị trí hiển thị (top-end, top-start, bottom-end, bottom-start)
 */
function ToastSignin({
    show = false,
    onClose,
    title = "Thông báo",
    message = "",
    variant = "success",
    delay = 5000,
    position = "top-end"
}) {
    const [showToast, setShowToast] = useState(show);

    // Sync internal state with prop
    useEffect(() => {
        setShowToast(show);
    }, [show]);

    // Handle close
    const handleClose = useCallback(() => {
        setShowToast(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // Auto hide after delay
    useEffect(() => {
        if (showToast && delay > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [showToast, delay, handleClose]);

    // Get icon based on variant
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return '✅';
            case 'danger':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📢';
        }
    };

    // Get background color based on variant
    const getBgColor = () => {
        switch (variant) {
            case 'success':
                return 'bg-success';
            case 'danger':
                return 'bg-danger';
            case 'warning':
                return 'bg-warning';
            case 'info':
                return 'bg-info';
            default:
                return 'bg-primary';
        }
    };

    return (
        <ToastContainer position={position} className="p-3">
            <Toast 
                show={showToast} 
                onClose={handleClose}
                className={getBgColor()}
                style={{ minWidth: '300px' }}
            >
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">
                        {getIcon()} {title}
                    </strong>
                    <small className="text-muted">vừa xong</small>
                </Toast.Header>
                
                <Toast.Body className="text-white">
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

// Custom hook để sử dụng toast dễ dàng hơn
export const useToast = () => {
    const [toastConfig, setToastConfig] = useState({
        show: false,
        title: '',
        message: '',
        variant: 'success'
    });

    const showToast = (title, message, variant = 'success') => {
        setToastConfig({
            show: true,
            title,
            message,
            variant
        });
    };

    const hideToast = () => {
        setToastConfig(prev => ({
            ...prev,
            show: false
        }));
    };

    const ToastComponent = () => (
        <ToastSignin
            show={toastConfig.show}
            onClose={hideToast}
            title={toastConfig.title}
            message={toastConfig.message}
            variant={toastConfig.variant}
        />
    );

    return {
        showToast,
        hideToast,
        ToastComponent
    };
};

export default ToastSignin;
