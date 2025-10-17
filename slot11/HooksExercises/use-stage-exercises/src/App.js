// Import logo và CSS cho ứng dụng
import logo from './logo.svg';
import './App.css';

// Import Bootstrap CSS - Đây là bước quan trọng để sử dụng React Bootstrap
// Bootstrap cung cấp các class CSS cơ bản, còn React Bootstrap cung cấp các component React
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các component sử dụng useState hook và React Bootstrap
import CounterComponent from './components/CounterComponent';        // Component đếm số với useState
import LightSwitch from './components/LightSwitchComponents';        // Component công tắc đèn với useState
import LoginForm from './components/LoginFormComponents';           // Form đăng nhập với validation
import LoginForm2 from './components/LoginForm2Components';         // Form đăng nhập dạng object state
import SearchItem from './components/searchTermComponents';         // Component tìm kiếm đơn giản
import AccountSearch from './components/AccountSearchComponents';   // Component tìm kiếm account phức tạp
import RegisterForm from './components/RegisterFormComponents';     // Form đăng ký với validation nâng cao

function App() {
  return (
    // Sử dụng Bootstrap container class để tạo layout responsive
    // mt-5: margin-top 5 (khoảng cách phía trên)
    <div className="container mt-5">
      {/* 
        LUỒNG CHUẨN SỬ DỤNG STATE VÀ REACT BOOTSTRAP:
        
        1. STATE MANAGEMENT (useState):
           - Khởi tạo state với giá trị ban đầu
           - Sử dụng setter function để cập nhật state
           - State thay đổi → Component re-render
        
        2. REACT BOOTSTRAP COMPONENTS:
           - Import component cần thiết từ 'react-bootstrap'
           - Sử dụng props để customize component
           - Kết hợp với Bootstrap CSS classes
        
        3. EVENT HANDLING:
           - onClick, onChange, onSubmit handlers
           - Prevent default behavior khi cần thiết
           - Validation và error handling
        
        Các component dưới đây minh họa các pattern khác nhau:
      */}
      
      <CounterComponent />      {/* useState cơ bản với số nguyên */}
      <LightSwitch />           {/* useState với boolean và toggle logic */}
      <LoginForm />             {/* Form validation với error state */}
      <LoginForm2 />            {/* State dạng object thay vì riêng lẻ */}
      <SearchItem />            {/* Filtering data với useState */}
      <AccountSearch />         {/* Search logic phức tạp với multiple states */}
      <RegisterForm />          {/* Advanced form với validation rules */}
    </div>
  );
}

export default App;
