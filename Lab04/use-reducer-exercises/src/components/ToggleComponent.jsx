// Import React và hook useReducer để quản lý state dạng reducer
import React, { useReducer } from 'react';
// Import các component Button, Card từ thư viện react-bootstrap để dùng UI đẹp
import { Button, Card } from 'react-bootstrap';

// 1. Khởi tạo trạng thái ban đầu
// initialState: trạng thái mặc định, ở đây chỉ có thuộc tính isOn (true/false)
const initialState = { isOn: false };

// 2. Định nghĩa hàm reducer
// reducer: hàm xử lý logic chuyển đổi trạng thái dựa trên action
function toggleReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      // Nếu action là 'toggle', đảo ngược trạng thái isOn
      return { isOn: !state.isOn };
    case 'turn_on':
      // Nếu action là 'turn_on', đặt isOn thành true
      return { isOn: true };
    case 'turn_off':
      // Nếu action là 'turn_off', đặt isOn thành false
      return { isOn: false };
    default:
      // Nếu action không hợp lệ, trả về state hiện tại
      return state;
  }
}

function ToggleComponent() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  // useReducer trả về [state, dispatch]:
  //   - state: trạng thái hiện tại
  //   - dispatch: hàm gửi action để cập nhật state
  const [state, dispatch] = useReducer(toggleReducer, initialState);

  // Các hàm xử lý action: gọi dispatch với type tương ứng
  const toggle = () => dispatch({ type: 'toggle' }); // Đảo trạng thái
  const turnOn = () => dispatch({ type: 'turn_on' }); // Bật
  const turnOff = () => dispatch({ type: 'turn_off' }); // Tắt

  // Định nghĩa style cho các nút để dùng chung
  const buttonStyle = {
    margin: '5px',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  };

  // Luồng hoạt động:
  // 1) Người dùng nhấn nút (toggle/bật/tắt)
  // 2) Hàm handler gọi dispatch gửi action
  // 3) useReducer gọi toggleReducer để tính state mới
  // 4) Nếu state thay đổi, component re-render và UI cập nhật
  return (
    // Card: khung chứa UI, dùng style đẹp của react-bootstrap
    <Card style={{ padding: '20px', margin: '20px auto' }}>
      <Card.Header>
        <h2>Bật/Tắt Trạng Thái</h2> {/* Tiêu đề */}
      </Card.Header>
      <Card.Body>
        {/* Hiển thị trạng thái hiện tại với màu nền khác nhau */}
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          padding: '20px',
          backgroundColor: state.isOn ? '#28a745' : '#dc3545', // Xanh nếu bật, đỏ nếu tắt
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {/* Hiển thị icon và chữ theo trạng thái */}
          {state.isOn ? '🟢 BẬT' : '🔴 TẮT'}
        </div>
        
        {/* Nhóm nút điều khiển trạng thái */}
        <div>
          {/* Nút chuyển đổi trạng thái */}
          <Button
            onClick={toggle}
            style={{ ...buttonStyle, background: '#007bff', color: 'white' }}
          >
            Chuyển đổi
          </Button>
          {/* Nút bật */}
          <Button
            onClick={turnOn}
            style={{ ...buttonStyle, background: '#28a745', color: 'white' }}
          >
            Bật
          </Button>
          {/* Nút tắt */}
          <Button
            onClick={turnOff}
            style={{ ...buttonStyle, background: '#dc3545', color: 'white' }}
          >
            Tắt
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// Export component để dùng ở file khác
export default ToggleComponent;