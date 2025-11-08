import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
            <p>Ứng dụng gặp sự cố. Vui lòng thử lại hoặc liên hệ quản trị viên.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                <summary>Chi tiết lỗi (chế độ phát triển)</summary>
                <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <hr />
            <Button variant="outline-danger" onClick={this.handleReset}>
              Quay lại trang đăng nhập
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

