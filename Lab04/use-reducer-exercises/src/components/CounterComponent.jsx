import React, { useReducer } from 'react';
import { Button } from 'react-bootstrap';
// import React và hook useReducer từ React
// import Button từ react-bootstrap để sử dụng nút có style sẵn

const initialState = { count: 0 };
// initialState: trạng thái khởi tạo cho reducer, ở đây chỉ chứa một thuộc tính `count`

function reducer(state, action) {
  // reducer: hàm quyết định cách thay đổi state dựa trên action
  // nhận vào state hiện tại và action (có thể là object mô tả loại hành động)
  switch (action.type) {
    case 'increment':
      // nếu action.type là 'increment', trả về state mới với count tăng 1
      return { count: state.count + 1 };
    case 'decrement':
      // nếu action.type là 'decrement', trả về state mới với count giảm 1
      return { count: state.count - 1 };
    case 'reset':
      // nếu action.type là 'reset', đặt lại state về initialState
      return initialState;
    default:
      // nếu không rõ action, trả về state hiện tại không thay đổi
      return state;
  }
}

function CounterComponent() {
    // useReducer trả về một cặp [state, dispatch]
    // state: trạng thái hiện tại do reducer quản lý
    // dispatch: hàm dùng để gửi action vào reducer
    const [state, dispatch] = useReducer(reducer, initialState);

    // Các hàm action wrapper: gọi dispatch với đối tượng action có `type`
    const increment = () => dispatch({ type: 'increment' });
    const decrement = () => dispatch({ type: 'decrement' });
    const reset = () => dispatch({ type: 'reset' });

    // object style dùng chung cho các nút để tránh lặp code
    const buttonStyle = {
         margin: '0 5px',
         padding: '10px 20px',
         borderRadius: '5px',
         border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    };

    // JSX trả về: phần UI hiển thị giá trị và 3 nút
    // Luồng tương tác:
    // 1) Người dùng click vào một Button -> gọi hàm increment/decrement/reset
    // 2) Hàm này gọi dispatch với action tương ứng
    // 3) React gọi reducer(state, action) để tính state mới
    // 4) Nếu reducer trả state mới khác, component re-render và hiển thị giá trị mới
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc'}}>
            
            <h2>Bộ đếm đa năng</h2>
            {/* Hiển thị giá trị hiện tại từ state.count */}
            <p style={{fontSize: '24px', fontWeight: 'bold' }}>Giá trị hiện tại: {state.count}</p>

          <Button
            onClick={increment}
            // merge style chung và style riêng cho nút Tăng
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
            style={{ ...buttonStyle, background: '#6c757d', color: 'white' }}
          >
            Đặt lại
          </Button>
        </div>
    );
}

export default CounterComponent;
