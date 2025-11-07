/**
 * FILE: index.js
 * MỤC ĐÍCH: Entry point của ứng dụng React - Render app vào DOM và setup Redux Provider
 * VỊ TRÍ: src/index.js
 * 
 * LUỒNG KHỞI ĐỘNG ỨNG DỤNG:
 * 1. Browser load HTML file (public/index.html)
 * 2. HTML load JavaScript bundle (được webpack build từ index.js)
 * 3. index.js execute
 * 4. ReactDOM.render() render React app vào DOM element (#root)
 * 5. App component mount -> Setup Router
 * 6. Router render component tương ứng với URL hiện tại
 * 
 * TẠI SAO CẦN ENTRY POINT?
 * - Điểm vào duy nhất của React app
 * - Setup global providers (Redux, Router, etc.)
 * - Import global CSS (Bootstrap)
 * - Initialize app
 */

// Import React - cần thiết cho JSX
import React from 'react';
// Import ReactDOM để render React app vào DOM
// createRoot: API mới của React 18 (thay vì ReactDOM.render)
import ReactDOM from 'react-dom/client';
// Import Provider từ react-redux
// Provider: Component wrap app để tất cả components có thể truy cập Redux store
import { Provider } from 'react-redux';
// Import Redux store đã cấu hình
import store from './redux/store';
// Import App component (root component)
import App from './App';
// Import Bootstrap CSS (global styles)
// Bootstrap CSS sẽ được áp dụng cho toàn bộ app
import 'bootstrap/dist/css/bootstrap.min.css';
// Import custom CSS
import './index.css';

/**
 * GET ROOT ELEMENT
 * 
 * document.getElementById('root'): Lấy DOM element từ HTML
 * Element này được định nghĩa trong public/index.html:
 * <div id="root"></div>
 * 
 * createRoot(): Tạo React root (API mới của React 18)
 * - Cho phép concurrent features
 * - Hiệu năng tốt hơn ReactDOM.render cũ
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * RENDER APP
 * 
 * root.render(): Render React component tree vào DOM
 * 
 * CẤU TRÚC COMPONENT TREE:
 * <React.StrictMode>
 *   <Provider store={store}>
 *     <App>
 *       <BrowserRouter>
 *         <Routes>
 *           <Route /> -> Home hoặc Videos
 *         </Routes>
 *       </BrowserRouter>
 *     </App>
 *   </Provider>
 * </React.StrictMode>
 * 
 * LUỒNG RENDER:
 * 1. React.StrictMode: Development mode checks (phát hiện lỗi)
 * 2. Provider: Cung cấp Redux store cho tất cả components
 * 3. App: Setup Router và routes
 * 4. Router render component tương ứng với URL
 */
root.render(
  // STRICT MODE: Development tool để phát hiện lỗi, cảnh báo về deprecated APIs
  // Chỉ hoạt động trong development (không ảnh hưởng production)
  <React.StrictMode>
    {/* 
      REDUX PROVIDER: Cung cấp Redux store cho toàn bộ app
      
      TẠI SAO CẦN Provider?
      - Redux store cần được cung cấp cho toàn bộ app
      - Components sử dụng useSelector() và useDispatch() cần access store
      - Provider wrap app và inject store vào React Context
      
      CÁCH HOẠT ĐỘNG:
      1. Provider wrap toàn bộ app
      2. Store được inject vào React Context
      3. Components bên trong có thể dùng:
         - useSelector(): Lấy state từ store
         - useDispatch(): Lấy dispatch function
      
      LUỒNG DATA:
      1. Component dispatch action: dispatch(fetchVideos())
      2. Store nhận action -> Gọi reducer
      3. Reducer cập nhật state
      4. Store notify tất cả components đã subscribe
      5. Components re-render với state mới
      
      ATTRIBUTES:
      - store={store}: Redux store instance (từ store.js)
    */}
    <Provider store={store}>
      {/* 
        APP COMPONENT: Root component của ứng dụng
        - Setup React Router
        - Define routes (/, /videos)
        - Render navbar và content
      */}
      <App />
    </Provider>
  </React.StrictMode>
);

/**
 * KHÔNG CẦN EXPORT VÌ ĐÂY LÀ ENTRY POINT
 * File này được webpack load tự động khi app khởi động
 */
