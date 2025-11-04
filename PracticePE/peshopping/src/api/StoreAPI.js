/**
 * FILE: StoreAPI.js
 * TÁC DỤNG: File này tạo instance của Axios để giao tiếp với Backend API (json-server)
 * FOLDER: src/api/ - Chứa các file cấu hình API, kết nối với server
 * 
 * Giải thích:
 * - Axios là thư viện để gửi HTTP requests (GET, POST, PUT, DELETE)
 * - Tạo một instance chung với baseURL và headers mặc định
 * - Tất cả các request đến API sẽ dùng instance này
 */

// Import thư viện axios để gửi HTTP requests
import axios from "axios";

// Tạo instance của axios với cấu hình mặc định
const storeAPI = axios.create({
  baseURL: "http://localhost:3001", // Base URL của json-server (backend giả lập)
  // Khi gọi storeAPI.get("/store"), nó sẽ tự động thành http://localhost:3001/store
  
  timeout: 5000, // Thời gian chờ tối đa 5 giây, nếu quá sẽ báo lỗi
  
  headers: {
    "Content-Type": "application/json", // Định dạng dữ liệu gửi đi là JSON
  },
});

// Export instance này để các file khác có thể import và sử dụng
export default storeAPI;
