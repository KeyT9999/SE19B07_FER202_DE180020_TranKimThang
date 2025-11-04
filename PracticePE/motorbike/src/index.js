/**
 * index.js - Entry point của ứng dụng React
 * 
 * Mục đích:
 * - Đây là file đầu tiên được chạy khi ứng dụng khởi động
 * - Render App component vào DOM (vào element có id="root")
 * - Cấu hình React StrictMode để phát hiện lỗi trong development
 * 
 * Luồng hoạt động:
 * 1. Browser load file này
 * 2. ReactDOM.createRoot() tạo root cho React
 * 3. root.render() render App component vào <div id="root"> trong public/index.html
 * 4. App component được khởi tạo và hiển thị
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Tạo root element cho React 18+
// Tìm element có id="root" trong public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render App component vào root
// StrictMode: Chạy components 2 lần trong development để phát hiện lỗi
root.render(
  <React.StrictMode>
    {/* App component - Component chính của ứng dụng, chứa routing và providers */}
    <App />
  </React.StrictMode>
);

// reportWebVitals: Đo lường hiệu suất của ứng dụng (optional)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
