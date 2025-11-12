import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
    const navigate = useNavigate();
    
    return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Tài khoản bị khóa, bạn không có quyền truy cập...</Alert.Heading>
                <p>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.</p>
                <hr />
                <Button variant="outline-danger" onClick={() => navigate('/login')}>
                    Quay lại trang đăng nhập
                </Button>
            </Alert>
        </Container>
    );
};

export default AccessDeniedPage;

