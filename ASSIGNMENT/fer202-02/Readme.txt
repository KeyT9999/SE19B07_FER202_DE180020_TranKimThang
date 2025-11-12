FER202 - Personal Budget Management (Assignment Part 1)
======================================================

1. Cài đặt phụ thuộc
- npm install
  (Bao gồm: react, react-dom, react-router-dom, axios, bootstrap, react-bootstrap, styled-components, react-icons, prop-types, json-server)

2. Khởi chạy ứng dụng
- Chạy mock API (JSON Server): npx json-server --watch db.json --port 3001
- Chạy ứng dụng React: npm start (mặc định cổng 3000)

3. Tính năng chính
- Đăng nhập bằng tài khoản trong `db.json`
- Dashboard hiển thị tổng chi tiêu, lọc theo hạng mục, thêm/sửa/xóa chi tiêu theo user đăng nhập
- Dữ liệu cập nhật thời gian thực khi thao tác (sử dụng Context + Hooks)

