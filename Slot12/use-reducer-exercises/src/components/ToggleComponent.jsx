import React, { useReducer } from 'react';
import { Button, Card } from 'react-bootstrap';

// 1. Khởi tạo trạng thái ban đầu
const initialState = { isOn: false };

// 2. Định nghĩa hàm reducer
function toggleReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return { isOn: !state.isOn };
    case 'turn_on':
      return { isOn: true };
    case 'turn_off':
      return { isOn: false };
    default:
      return state;
  }
}

function ToggleComponent() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  const [state, dispatch] = useReducer(toggleReducer, initialState);

  // Action handlers
  const toggle = () => dispatch({ type: 'toggle' });
  const turnOn = () => dispatch({ type: 'turn_on' });
  const turnOff = () => dispatch({ type: 'turn_off' });

  const buttonStyle = {
    margin: '5px',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  };

  return (
    <Card style={{ padding: '20px', margin: '20px auto' }}>
      <Card.Header>
        <h2>Bật/Tắt Trạng Thái</h2>
      </Card.Header>
      <Card.Body>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          padding: '20px',
          backgroundColor: state.isOn ? '#28a745' : '#dc3545',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {state.isOn ? '🟢 BẬT' : '🔴 TẮT'}
        </div>
        
        <div>
          <Button
            onClick={toggle}
            style={{ ...buttonStyle, background: '#007bff', color: 'white' }}
          >
            Chuyển đổi
          </Button>
          <Button
            onClick={turnOn}
            style={{ ...buttonStyle, background: '#28a745', color: 'white' }}
          >
            Bật
          </Button>
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

export default ToggleComponent;
