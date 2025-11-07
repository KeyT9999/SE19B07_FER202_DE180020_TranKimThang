/**
 * FILE: App.js
 * MỤC ĐÍCH: Component gốc của ứng dụng - Setup React Router và định nghĩa routes
 * VỊ TRÍ: src/App.js
 * 
 * LUỒNG XỬ LÝ TỔNG QUÁT:
 * 1. index.js render <App />
 * 2. App.js setup BrowserRouter (enable routing)
 * 3. User truy cập URL (ví dụ: '/videos')
 * 4. BrowserRouter match URL với Routes
 * 5. Render component tương ứng (Home hoặc Videos)
 * 6. User click Link -> URL thay đổi -> Component re-render
 * 
 * TẠI SAO DÙNG REACT ROUTER?
 * - Single Page Application (SPA): Không reload trang khi điều hướng
 * - Client-side routing: Nhanh hơn server-side routing
 * - History API: User có thể dùng nút Back/Forward
 * - Đúng yêu cầu đề bài: React Router (1 điểm)
 */

// Import React
import React from 'react';
// Import các components từ react-router-dom
// BrowserRouter: Wrapper component để enable routing (sử dụng History API)
// Routes: Container cho các Route definitions
// Route: Định nghĩa một route và component tương ứng
// Link: Component để điều hướng (thay thế <a> tag)
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Import page components
import Home from './pages/Home';
import Videos from './pages/Videos';
// Import CSS styles
import './App.css';

/**
 * COMPONENT: App
 * 
 * MỤC ĐÍCH: Component gốc - Setup routing và layout chung
 * 
 * RETURN: JSX với Router, Navbar, và Routes
 */
function App() {
  /**
   * RETURN: JSX structure
   * 
   * CẤU TRÚC:
   * - BrowserRouter: Enable routing
   * - Navbar: Navigation bar (hiển thị trên mọi trang)
   * - Routes: Container cho routes
   * - Route: Định nghĩa từng route
   */
  return (
    /**
     * BROWSER ROUTER
     * 
     * TẠI SAO DÙNG BrowserRouter?
     * - Sử dụng History API (URL đẹp: /videos thay vì /#/videos)
     * - Cho phép browser Back/Forward buttons hoạt động
     * - Server có thể cấu hình để serve index.html cho mọi route (SPA)
     * 
     * CÁCH HOẠT ĐỘNG:
     * 1. BrowserRouter wrap toàn bộ app
     * 2. Theo dõi URL changes (History API)
     * 3. Match URL với Routes
     * 4. Render component tương ứng
     */
    <BrowserRouter>
      {/* 
        NAVIGATION BAR
        MỤC ĐÍCH: Thanh điều hướng hiển thị trên mọi trang
        
        BOOTSTRAP CLASSES:
        - navbar: Base navbar class
        - navbar-expand-lg: Expand trên màn hình lớn (collapse trên mobile)
        - navbar-dark: Text màu sáng (cho dark background)
        - bg-dark: Background màu đen
      */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        {/* Container: Giới hạn width và căn giữa */}
        <div className="container">
          {/* 
            BRAND/LOGO: Link về trang Home
            navbar-brand: Bootstrap class cho brand/logo
            to="/": Link tới route '/' (Home page)
          */}
          <Link className="navbar-brand" to="/">
            Video App
          </Link>
          
          {/* 
            HAMBURGER MENU BUTTON (Mobile)
            Chỉ hiển thị trên mobile khi navbar collapse
            
            data-bs-toggle="collapse": Bootstrap toggle collapse
            data-bs-target="#navbarNav": Target element để collapse/expand
            aria-*: Accessibility attributes
          */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            {/* Hamburger icon (3 lines) */}
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* 
            NAVBAR MENU: Container cho navigation links
            collapse navbar-collapse: Bootstrap collapse (ẩn/hiện trên mobile)
            id="navbarNav": Target cho hamburger button
          */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* 
              NAVIGATION LINKS LIST
              navbar-nav: Bootstrap class cho nav list
              ms-auto: Margin-start auto (đẩy links sang bên phải)
            */}
            <ul className="navbar-nav ms-auto">
              {/* Home link */}
              <li className="nav-item">
                {/* 
                  LINK COMPONENT
                  TẠI SAO DÙNG <Link> THAY VÌ <a>?
                  - <Link>: Client-side routing (không reload trang)
                  - <a>: Server-side routing (reload trang)
                  
                  CÁCH HOẠT ĐỘNG:
                  1. User click link
                  2. React Router intercept click
                  3. Cập nhật URL (History API)
                  4. Render component mới (không reload)
                  
                  ATTRIBUTES:
                  - to="/": Route target (Home page)
                  - className="nav-link": Bootstrap nav link style
                */}
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              
              {/* Videos link */}
              <li className="nav-item">
                {/* Link tới trang Videos */}
                <Link className="nav-link" to="/videos">
                  Videos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 
        ROUTES CONTAINER
        MỤC ĐÍCH: Định nghĩa các routes và component tương ứng
        
        CÁCH HOẠT ĐỘNG:
        1. BrowserRouter match URL với path trong Route
        2. Render element (component) tương ứng
        3. Chỉ render 1 Route tại một thời điểm (first match wins)
      */}
      <Routes>
        {/* 
          ROUTE: Home page
          
          ATTRIBUTES:
          - path="/": Match URL '/' (homepage)
          - element={<Home />}: Render Home component khi match
          
          LUỒNG:
          1. User truy cập '/' hoặc click Home link
          2. Route match path="/"
          3. Render <Home /> component
        */}
        <Route path="/" element={<Home />} />
        
        {/* 
          ROUTE: Videos page
          
          ATTRIBUTES:
          - path="/videos": Match URL '/videos'
          - element={<Videos />}: Render Videos component khi match
          
          LUỒNG:
          1. User truy cập '/videos' hoặc click Videos link
          2. Route match path="/videos"
          3. Render <Videos /> component
          4. Videos component mount -> useEffect -> fetch videos từ Redux
        */}
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Export App component
 * 
 * LUỒNG SỬ DỤNG:
 * 1. index.js import: import App from './App'
 * 2. index.js render: <App />
 * 3. App.js setup routing và render component tương ứng với URL
 */
export default App;
