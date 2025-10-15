//component CounterComponent.jsx use State to create a counter with increment and decrement, reset buttons  
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

function CounterComponent () {
    //Khởi tạo state: count là số nguyên, khởi tạo giá trị ban đầu là 0, setCount là hàm để cập nhật count
    const [count, setCount] = useState(0);
    //Hàm để tăng, giảm, reset count
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
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
      <h2>Bộ Đếm Đa Năng</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Giá trị hiện tại: {count}</p>
      
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
    </div>
    );
}
export default CounterComponent;