/**
 * FILE: index.js
 * TÁC DỤNG: File entry point của ứng dụng React, khởi tạo và render app vào DOM
 * 
 * FLOW:
 * 1. index.js → render App vào DOM
 * 2. App.js → định nghĩa routing và layout
 * 3. StoreProvider → cung cấp global state cho tất cả components
 * 
 * MAPPING:
 * public/index.html → có <div id="root"> → React render vào đây
 */

// Import React và ReactDOM để render components
import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM từ React 18+

// Import CSS global cho toàn bộ app
import './index.css';

// Import component App chính
import App from './App';

// Import function để đo performance (không bắt buộc)
import reportWebVitals from './reportWebVitals';

// Import StoreProvider để cung cấp global state
import { StoreProvider } from './context/storeContext';

// Lấy element root từ HTML (thường là <div id="root"> trong public/index.html)
// ReactDOM.createRoot: Tạo root container cho React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app vào DOM
root.render(
  // React.StrictMode: Development mode, giúp phát hiện lỗi tiềm ẩn
  <React.StrictMode>
    {/* StoreProvider: Bao bọc App để cung cấp Context (global state) */}
    {/* Tất cả components con của StoreProvider có thể dùng useStoreState/useStoreDispatch */}
    <StoreProvider>
      {/* App component: Component chính của ứng dụng */}
      <App />
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
