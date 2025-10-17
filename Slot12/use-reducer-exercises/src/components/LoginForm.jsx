import React, { useReducer } from 'react';
import { Button, Form, Card, Alert } from 'react-bootstrap';

// 1. Khởi tạo trạng thái ban đầu
const initialState = {
  username: '',
  password: '',
  isLoading: false,
  error: '',
  isLoggedIn: false
};

// 2. Định nghĩa hàm reducer
function loginReducer(state, action) {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload, error: '' };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload, error: '' };
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: '' };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        isLoggedIn: true, 
        error: '',
        username: '',
        password: ''
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isLoggedIn: false, 
        username: '', 
        password: '', 
        error: '' 
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function LoginForm() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleUsernameChange = (e) => {
    dispatch({ type: 'SET_USERNAME', payload: e.target.value });
  };

  const handlePasswordChange = (e) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!state.username || !state.password) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Vui lòng nhập đầy đủ thông tin!' });
      return;
    }

    dispatch({ type: 'LOGIN_START' });

    // Giả lập API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kiểm tra thông tin đăng nhập (giả lập)
      if (state.username === 'admin' && state.password === '123456') {
        dispatch({ type: 'LOGIN_SUCCESS' });
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Có lỗi xảy ra khi đăng nhập!' });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  if (state.isLoggedIn) {
    return (
      <Card style={{ padding: '20px', margin: '20px auto', maxWidth: '400px' }}>
        <Card.Header>
          <h2>Đăng nhập thành công!</h2>
        </Card.Header>
        <Card.Body>
          <Alert variant="success">
            Chào mừng bạn đã đăng nhập thành công! 🎉
          </Alert>
          <Button 
            variant="danger" 
            onClick={handleLogout}
            style={{ marginRight: '10px' }}
          >
            Đăng xuất
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleReset}
          >
            Reset Form
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ padding: '20px', margin: '20px auto', maxWidth: '400px' }}>
      <Card.Header>
        <h2>Form Đăng Nhập</h2>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập:</Form.Label>
            <Form.Control
              type="text"
              value={state.username}
              onChange={handleUsernameChange}
              placeholder="Nhập tên đăng nhập"
              disabled={state.isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu:</Form.Label>
            <Form.Control
              type="password"
              value={state.password}
              onChange={handlePasswordChange}
              placeholder="Nhập mật khẩu"
              disabled={state.isLoading}
            />
          </Form.Group>

          {state.error && (
            <Alert variant="danger" className="mb-3">
              {state.error}
            </Alert>
          )}

          <div>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={state.isLoading}
              style={{ marginRight: '10px' }}
            >
              {state.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <Button 
              variant="secondary" 
              type="button"
              onClick={handleReset}
              disabled={state.isLoading}
            >
              Reset
            </Button>
          </div>
        </Form>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p><strong>Thông tin test:</strong></p>
          <p>Tên đăng nhập: admin</p>
          <p>Mật khẩu: 123456</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LoginForm;
