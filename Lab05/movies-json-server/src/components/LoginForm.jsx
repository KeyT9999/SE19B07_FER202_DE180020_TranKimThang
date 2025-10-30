//LoginForm.jsx is a functional component that uses the useReducer hook to manage form state and AuthContext for authentication.
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from './ConfirmModal';
import { useToast } from './ToastSignin';

// 1. Khởi tạo trạng thái ban đầu cho form
const initialState = {
    username: '',
    password: '',
    errors: {},
    isSubmitting: false
};

// 2. Định nghĩa hàm reducer
function formReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
                errors: {
                    ...state.errors,
                    [action.field]: '' // Clear error when field changes
                }
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.errors
            };
        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.isSubmitting
            };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
}

function LoginForm() {
    // 3. Sử dụng useReducer để quản lý trạng thái form
    const [state, dispatch] = useReducer(formReducer, initialState);

    // Router helpers for redirect after successful login.
    const navigate = useNavigate();
    const location = useLocation();

    // Sử dụng AuthContext
    const { login, logout, isAuthenticated, user, error: authError } = useAuth();

    // Sử dụng Toast hook
    const { showToast, ToastComponent } = useToast();

    // State cho ConfirmModal
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Validation function
    const validateForm = () => {
        const errors = {};
        
        if (!state.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập!';
        }
        
        if (!state.password.trim()) {
            errors.password = 'Vui lòng nhập mật khẩu!';
        } else if (state.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
        }

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            dispatch({ type: 'SET_ERRORS', errors });
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
        
        // Thêm độ trễ nhỏ để người dùng thấy trạng thái loading.
        setTimeout(async () => {
            const result = await login(state.username, state.password);
            dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
            
            if (result?.ok) {
                dispatch({ type: 'RESET_FORM' });
                showToast(
                    'Đăng nhập thành công!',
                    result.message || `Chào mừng ${state.username}!`,
                    'success'
                );
            } else {
                const errorMessage = result?.message || authError || 'Có lỗi xảy ra';
                showToast('Đăng nhập thất bại!', errorMessage, 'danger');
            }
        }, 400);
    };

    // Handle field changes
    const handleFieldChange = (field) => (e) => {
        dispatch({ 
            type: 'SET_FIELD', 
            field, 
            value: e.target.value 
        });
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        showToast('Đăng xuất thành công!', 'Hẹn gặp lại!', 'info');
    };

    // Handle logout confirmation
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    // Handle logout confirmation
    const handleConfirmLogout = () => {
        handleLogout();
        setShowLogoutModal(false);
    };

    // Style cho form
    const formStyle = {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px'
    };

    const buttonStyle = {
        width: '100%',
        marginTop: '10px'
    };

    // Điều hướng tới trang được bảo vệ ngay khi đăng nhập thành công.
    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectTo = location.state?.from?.pathname || '/movies';
            const timer = setTimeout(() => {
                navigate(redirectTo, { replace: true });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, user, navigate, location]);

    // Nếu đã đăng nhập, hiển thị thông tin user
    if (isAuthenticated && user) {
        return (
            <>
                <Card style={formStyle}>
                    <Card.Header>
                        <h3>Đăng nhập thành công!</h3>
                    </Card.Header>
                    <Card.Body>
                        <p><strong>Tên đăng nhập:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Vai trò:</strong> {user.role}</p>
                        <p><strong>Trạng thái:</strong> {user.status || 'active'}</p>
                        <Button 
                            variant="danger" 
                            onClick={handleLogoutClick}
                            style={buttonStyle}
                        >
                            Đăng xuất
                        </Button>
                    </Card.Body>
                </Card>

                {/* Confirm Modal */}
                <ConfirmModal
                    show={showLogoutModal}
                    onHide={() => setShowLogoutModal(false)}
                    onConfirm={handleConfirmLogout}
                    title="Xác nhận đăng xuất"
                    message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
                    confirmText="Đăng xuất"
                    cancelText="Hủy"
                    variant="danger"
                />

                {/* Toast Component */}
                <ToastComponent />
            </>
        );
    }

    return (
        <>
            <Card style={formStyle}>
                <Card.Header>
                    <h3>Đăng nhập hệ thống</h3>
                    <small className="text-muted">Chỉ admin mới được phép đăng nhập</small>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Hiển thị lỗi từ AuthContext */}
                        {authError && (
                            <Alert variant="danger">
                                {authError}
                            </Alert>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={state.username}
                                onChange={handleFieldChange('username')}
                                isInvalid={!!state.errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {state.errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={state.password}
                                onChange={handleFieldChange('password')}
                                isInvalid={!!state.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {state.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={state.isSubmitting}
                            style={buttonStyle}
                        >
                            {state.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </Form>

                    <div className="mt-3">
                        <small className="text-muted">
                            <strong>Tài khoản demo:</strong><br/>
                            Username: admin<br/>
                            Password: 123456
                        </small>
                    </div>
                </Card.Body>
            </Card>

            {/* Toast Component */}
            <ToastComponent />
        </>
    );
}

export default LoginForm;
