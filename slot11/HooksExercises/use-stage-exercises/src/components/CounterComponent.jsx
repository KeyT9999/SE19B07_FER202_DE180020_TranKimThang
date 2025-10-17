/*
 * COMPONENT: CounterComponent.jsx
 * MỤC ĐÍCH: Minh họa cách sử dụng useState hook cơ bản với React Bootstrap
 * 
 * LUỒNG CHUẨN SỬ DỤNG useState:
 * 1. Import useState từ React
 * 2. Import React Bootstrap component cần thiết
 * 3. Khởi tạo state với giá trị ban đầu
 * 4. Tạo các function để update state
 * 5. Render UI với event handlers
 */

// Import React và useState hook - hook cơ bản nhất để quản lý state
import React, { useState } from 'react';
// Import Button component từ React Bootstrap - thay thế cho HTML button với styling Bootstrap
import Button from 'react-bootstrap/Button';

function CounterComponent () {
    /*
     * KHỞI TẠO STATE với useState hook:
     * - count: giá trị hiện tại (number)
     * - setCount: function để update count
     * - 0: giá trị khởi tạo ban đầu
     * 
     * PATTERN: const [state, setState] = useState(initialValue)
     */
    const [count, setCount] = useState(0);
    
    /*
     * CÁC FUNCTION XỬ LÝ EVENT:
     * Mỗi function gọi setCount với giá trị mới
     * React sẽ tự động re-render component khi state thay đổi
     */
    const increment = () => setCount(count + 1);    // Tăng count lên 1
    const decrement = () => setCount(count - 1);    // Giảm count xuống 1  
    const reset = () => setCount(0);                // Reset count về 0
    
    /*
     * STYLING OBJECT:
     * Có thể dùng inline style object hoặc CSS classes
     * Ở đây dùng inline style để customize React Bootstrap Button
     */
    const buttonStyle = {
        margin: '5px',           // Khoảng cách giữa các button
        padding: '10px 20px',    // Padding trong button
        borderRadius: '6px',     // Bo góc button
        border: 'none',          // Bỏ border mặc định
        cursor: 'pointer',       // Con trở chuột dạng pointer
        fontWeight: 'bold',      // Chữ đậm
        fontSize: '16px'         // Kích thước chữ
    };
    /*
     * RETURN JSX:
     * Component trả về JSX để render UI
     * Sử dụng React Bootstrap Button với custom styling
     */
    return (
       <div style={{ padding: '20px', border: '1px solid #ccc' }}>
          <h2>Bộ Đếm Đa Năng</h2>
          {/* 
           * HIỂN THỊ STATE:
           * Sử dụng {count} để hiển thị giá trị state hiện tại
           * Khi count thay đổi, React tự động cập nhật UI
           */}
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Giá trị hiện tại: {count}</p>
          
          {/* 
           * REACT BOOTSTRAP BUTTONS:
           * - onClick: event handler khi click button
           * - style: kết hợp buttonStyle với màu sắc riêng
           * - ...buttonStyle: spread operator để copy tất cả properties
           */}
          <Button
            onClick={increment}    // Gọi function increment khi click
            style={{ ...buttonStyle, background: '#007bff', color: 'white' }}  // Màu xanh
          >
            Tăng (+1)
          </Button>
          <Button
            onClick={decrement}    // Gọi function decrement khi click
            style={{ ...buttonStyle, background: '#ffc107', color: '#333' }}  // Màu vàng
          >
            Giảm (-1)
          </Button>
          <Button
            onClick={reset}        // Gọi function reset khi click
            style={{ ...buttonStyle, background: 'red', color: 'white' }}    // Màu đỏ
          >
            Reset
          </Button>
        </div>
    );
}
export default CounterComponent;