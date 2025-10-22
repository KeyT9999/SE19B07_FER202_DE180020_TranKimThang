// Import React và hook useReducer để quản lý state phức tạp
import React, { useReducer, useRef } from 'react';
// Import các component UI từ react-bootstrap
import { Button, Form, Card, Alert } from 'react-bootstrap';
// Import ConfirmModal component
import ConfirmModalComponent from './ConfirmModalComponent';
// Import ToastSignup component
import ToastSignup from './ToastSignup';

// 1. Khởi tạo trạng thái ban đầu
// initialState: lưu trữ các giá trị của form đăng nhập và trạng thái đăng nhập
const initialState = {
  username: '',      // Tên đăng nhập
  password: '',      // Mật khẩu
  isLoading: false,  // Đang xử lý đăng nhập hay không
  error: '',         // Thông báo lỗi
  isLoggedIn: false  // Đã đăng nhập thành công chưa
};

// 2. Định nghĩa hàm reducer
// loginReducer: xử lý các action để cập nhật state
function loginReducer(state, action) {
  switch (action.type) {
    case 'SET_USERNAME':
      // Khi người dùng nhập username, cập nhật state.username
      return { ...state, username: action.payload, error: '' };
    case 'SET_PASSWORD':
      // Khi người dùng nhập password, cập nhật state.password
      return { ...state, password: action.payload, error: '' };
    case 'LOGIN_START':
      // Bắt đầu quá trình đăng nhập, bật loading
      return { ...state, isLoading: true, error: '' };
    case 'LOGIN_SUCCESS':
      // Đăng nhập thành công, đặt isLoggedIn=true, tắt loading, xóa thông tin form
      return { 
        ...state, 
        isLoading: false, 
        isLoggedIn: true, 
        error: '',
        username: '',
        password: ''
      };
    case 'LOGIN_ERROR':
      // Đăng nhập thất bại, hiển thị thông báo lỗi
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      // Đăng xuất, đặt lại trạng thái liên quan
      return { 
        ...state, 
        isLoggedIn: false, 
        username: '', 
        password: '', 
        error: '' 
      };
    case 'RESET':
      // Đặt lại toàn bộ state về giá trị ban đầu
      return initialState;
    default:
      // Nếu action không hợp lệ, giữ nguyên state
      return state;
  }
}

function LoginForm() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  // useReducer trả về [state, dispatch]:
  //   - state: trạng thái hiện tại của form
  //   - dispatch: hàm gửi action để cập nhật state
  const [state, dispatch] = useReducer(loginReducer, initialState);
  
  // Ref cho ConfirmModal và ToastSignup
  const confirmModalRef = useRef();
  const toastRef = useRef();

  // Xử lý khi người dùng thay đổi username
  const handleUsernameChange = (e) => {
    dispatch({ type: 'SET_USERNAME', payload: e.target.value });
  };

  // Xử lý khi người dùng thay đổi password
  const handlePasswordChange = (e) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  // Xử lý khi người dùng nhấn nút đăng nhập với confirm modal
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    
    // Kiểm tra nhập đủ thông tin chưa
    if (!state.username || !state.password) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Vui lòng nhập đầy đủ thông tin!' });
      return;
    }

    // Hiển thị confirm modal
    confirmModalRef.current.showConfirm({
      title: 'Xác nhận đăng nhập',
      message: `Bạn có chắc chắn muốn đăng nhập với tài khoản: ${state.username}?`,
      confirmText: 'Đăng nhập',
      cancelText: 'Hủy',
      variant: 'primary',
      type: 'confirm'
    });
  };

  // Hàm xác nhận đăng nhập
  const handleConfirmLogin = async () => {
    dispatch({ type: 'LOGIN_START' }); // Bắt đầu loading

    // Giả lập gọi API đăng nhập (chờ 1 giây)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kiểm tra thông tin đăng nhập (giả lập)
      if (state.username === 'admin' && state.password === '123456') {
        dispatch({ type: 'LOGIN_SUCCESS' }); // Thành công
        
        // Hiển thị success toast
        toastRef.current.showSuccess({
          message: 'Đăng nhập thành công! Chào mừng bạn quay trở lại.',
          title: 'Đăng nhập thành công',
          delay: 4000
        });
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: 'Tên đăng nhập hoặc mật khẩu không đúng!' }); // Sai thông tin
        
        // Hiển thị error toast
        toastRef.current.showError({
          message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
          title: 'Đăng nhập thất bại',
          delay: 4000
        });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Có lỗi xảy ra khi đăng nhập!' }); // Lỗi hệ thống
      
      toastRef.current.showError({
        message: 'Có lỗi xảy ra khi đăng nhập!',
        title: 'Lỗi hệ thống',
        delay: 4000
      });
    }
  };

  // Xử lý khi người dùng nhấn nút đăng xuất với confirm
  const handleLogout = () => {
    confirmModalRef.current.showWarning({
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      confirmText: 'Đăng xuất',
      cancelText: 'Hủy'
    });
  };

  const handleConfirmLogout = () => {
    dispatch({ type: 'LOGOUT' });
    
    // Hiển thị info toast
    toastRef.current.showInfo({
      message: 'Bạn đã đăng xuất thành công.',
      title: 'Đăng xuất',
      delay: 3000
    });
  };

  // Xử lý khi người dùng nhấn nút reset
  const handleReset = () => {
    dispatch({ type: 'RESET' });
    
    // Hiển thị info toast
    toastRef.current.showInfo({
      message: 'Form đã được reset về trạng thái ban đầu.',
      title: 'Reset thành công',
      delay: 3000
    });
  };

  // Nếu đã đăng nhập thành công, hiển thị giao diện chào mừng
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
          {/* Nút đăng xuất và reset form */}
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

  // Nếu chưa đăng nhập, hiển thị form đăng nhập
  return (
    <>
      <Card style={{ padding: '20px', margin: '20px auto', maxWidth: '400px' }}>
        <Card.Header>
          <h2>Form Đăng Nhập</h2>
        </Card.Header>
        <Card.Body>
          {/* Form nhập thông tin đăng nhập */}
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

            {/* Hiển thị lỗi nếu có */}
            {state.error && (
              <Alert variant="danger" className="mb-3">
                {state.error}
              </Alert>
            )}

            {/* Nhóm nút đăng nhập và reset */}
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
          
          {/* Thông tin test tài khoản */}
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p><strong>Thông tin test:</strong></p>
            <p>Tên đăng nhập: admin</p>
            <p>Mật khẩu: 123456</p>
          </div>
        </Card.Body>
      </Card>

      {/* ToastSignup Component */}
      <ToastSignup ref={toastRef} />

      {/* ConfirmModal Component */}
      <ConfirmModalComponent
        ref={confirmModalRef}
        onConfirm={handleConfirmLogin}
        onCancel={handleConfirmLogout}
      />
    </>
  );
}

// Export component để dùng ở file khác
export default LoginForm;