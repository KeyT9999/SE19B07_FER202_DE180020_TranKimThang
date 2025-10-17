//CounterComponent.jsx is a functional component that uses the useReducer hook to manage a counter state.
import React, { useReducer } from 'react';
import { Button, Card } from 'react-bootstrap';

// 1. Khởi tạo trạng thái ban đầu
const initialState = { count: 0 };

// 2. Định nghĩa hàm reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

function CounterComponent() {
  // 3. Sử dụng useReducer để quản lý trạng thái
  const [state, dispatch] = useReducer(reducer, initialState);

  //action handlers
  const increment = () => dispatch({ type: 'increment' });
  const decrement = () => dispatch({ type: 'decrement' });
  const reset = () => dispatch({ type: 'reset' });
   
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
           <Card style={{ padding: '20px', margin: '20px auto' }}>
          <Card.Header>
            <h2>Bộ Đếm Đa Năng</h2>
          </Card.Header>
          <Card.Body>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Giá trị hiện tại: {state.count}</p>
            
            <Button
              onClick={increment}
              style={{ ...buttonStyle, background: '#007bff', color: 'white' }}
            >
              Tăng (+1)
            </Button>
            <Button
              onClick={decrement}
              style={{ ...buttonStyle, background: '#ffc107', color: '#333' }}
            >
              Giảm (-1)
            </Button>
            <Button
              onClick={reset}
              style={{ ...buttonStyle, background: 'red', color: 'white' }}
            >
              Reset
            </Button>
          </Card.Body>
        </Card>
        );
}

export default CounterComponent;
