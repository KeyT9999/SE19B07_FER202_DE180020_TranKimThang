/**
 * FILE: Home.jsx
 * MỤC ĐÍCH: Trang chủ của ứng dụng - hiển thị thông tin chào mừng và link tới Videos
 * VỊ TRÍ: src/pages/Home.jsx
 * 
 * LUỒNG XỬ LÝ:
 * 1. User truy cập route '/' (homepage)
 * 2. React Router render component Home
 * 3. Home component hiển thị thông tin chào mừng
 * 4. User click "Browse Videos" button
 * 5. React Router điều hướng tới '/videos' (không reload trang)
 * 
 * TẠI SAO TÁCH THÀNH PAGE RIÊNG?
 * - Tổ chức code theo routes
 * - Dễ quản lý logic riêng của từng trang
 * - Dễ mở rộng sau này (thêm tính năng vào Home)
 * - Đúng yêu cầu đề bài: Component Home (1 điểm)
 */

// Import React - cần thiết cho JSX
import React from 'react';
// Import Link từ react-router-dom để điều hướng
// Link: Component điều hướng không reload trang (client-side routing)
import { Link } from 'react-router-dom';

/**
 * COMPONENT: Home
 * 
 * MỤC ĐÍCH: Trang chủ - điểm vào đầu tiên của ứng dụng
 * 
 * RETURN: JSX hiển thị thông tin chào mừng và button điều hướng
 */
const Home = () => {
  /**
   * RETURN: JSX của trang Home
   * 
   * CẤU TRÚC:
   * - Container: Wrapper với Bootstrap container class
   * - Jumbotron: Hero section với gradient background
   * - Title, description, call-to-action button
   */
  return (
    // Container: Bootstrap class để căn giữa và giới hạn width
    // mt-5: margin-top 5 units (khoảng cách từ navbar)
    <div className="container mt-5">
      {/* 
        JUMBOTRON: Hero section (khu vực nổi bật ở đầu trang)
        - bg-light: Background màu sáng (sẽ được override bởi CSS gradient)
        - p-5: Padding 5 units (khoảng cách bên trong)
        - rounded: Bo góc
        - shadow: Đổ bóng (tạo độ sâu)
        
        TẠI SAO DÙNG JUMBOTRON?
        - Tạo điểm nhấn visual cho trang chủ
        - Dễ thu hút attention của user
        - Thông báo rõ ràng mục đích của app
      */}
      <div className="jumbotron bg-light p-5 rounded shadow">
        {/* 
          Title: Tiêu đề chính của trang
          display-4: Bootstrap typography class (font size lớn)
        */}
        <h1 className="display-4">Welcome to Video App</h1>
        
        {/* 
          Lead text: Mô tả ngắn gọn về app
          lead: Bootstrap class cho text nổi bật (font size lớn hơn normal)
        */}
        <p className="lead">
          Browse and watch amazing videos from our collection.
        </p>
        
        {/* Horizontal rule: Đường kẻ ngang phân cách */}
        <hr className="my-4" />
        
        {/* Call-to-action text: Hướng dẫn user */}
        <p>Click the button below to explore our video library.</p>
        
        {/* 
          NAVIGATION BUTTON: Link tới trang Videos
          
          TẠI SAO DÙNG <Link> THAY VÌ <a>?
          - <Link>: Client-side routing (không reload trang, nhanh hơn)
          - <a>: Server-side routing (reload trang, chậm hơn)
          - React Router xử lý <Link> và cập nhật URL + render component mới
          
          CÁCH HOẠT ĐỘNG:
          1. User click button
          2. React Router intercept click event
          3. Cập nhật URL: '/' -> '/videos'
          4. Render component Videos (không reload trang)
          5. History API update (user có thể dùng nút Back)
          
          ATTRIBUTES:
          - to="/videos": Route target (khớp với <Route path="/videos" /> trong App.js)
          - className="btn btn-primary btn-lg": Bootstrap button classes
            * btn: Base button style
            * btn-primary: Màu xanh dương (primary color)
            * btn-lg: Kích thước lớn
        */}
        <Link to="/videos" className="btn btn-primary btn-lg">
          Browse Videos
        </Link>
      </div>
    </div>
  );
};

/**
 * Export component để sử dụng trong Router
 * 
 * LUỒNG SỬ DỤNG:
 * 1. App.js import: import Home from './pages/Home'
 * 2. App.js define route: <Route path="/" element={<Home />} />
 * 3. User truy cập '/': Router render Home component
 */
export default Home;
