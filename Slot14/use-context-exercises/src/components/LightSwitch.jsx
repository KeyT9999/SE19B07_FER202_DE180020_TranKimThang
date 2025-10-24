//LightSwitch.jsx is a functional component that uses the useReducer hook to manage a light switch state.
import React, { useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext'; // Import custom hook useTheme

// 1. Khởi tạo trạng thái ban đầu
const initialState = { isOn: false };
// 2. Định nghĩa hàm reducer
function reducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return { isOn: !state.isOn };
    case 'turnOn':
      return { isOn: true };
    case 'turnOff':
      return { isOn: false };
    default:
      return state;
  }
}

function LightSwitch() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  const [state, dispatch] = useReducer(reducer, initialState);  

    //Sử dụng ThemeContext
    const { theme, toggleTheme } = useTheme(); //Lấy giá trị theme từ context

    //action handlers
    const toggle = () => dispatch({ type: 'toggle' });
    const turnOn = () => dispatch({ type: 'turnOn' });
    const turnOff = () => dispatch({ type: 'turnOff' });
    // Style chung cho các button
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
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Công Tắc Đèn</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Đèn hiện đang: {state.isOn ? 'Bật' : 'Tắt'}</p>   
      <Button 
      onClick={toggleTheme}
      style={{
        ...buttonStyle,
        background: theme === 'light' ? '#6c757d' : '#f8f9fa',
        color: theme === 'light' ? '#ffffff' : '#000000'
      }}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </Button>
       
        <Button
        onClick={toggle}
        style={{ ...buttonStyle, background: '#007bff', color: 'white' }}
      >
        Chuyển Đổi
      </Button>
      <Button
        onClick={turnOn}
        style={{ ...buttonStyle, background: '#28a745', color: 'white' }}
      > 
        Bật Đèn
      </Button>
      <Button
        onClick={turnOff}
        style={{ ...buttonStyle, background: '#dc3545', color: 'white' }}
      >
        Tắt Đèn
        </Button>
    </div>
  );
}   
export default LightSwitch;