/**
 * MotorbikeAPI.js - Cấu hình Axios để gọi API từ JSON Server
 * 
 * Mục đích:
 * - Tạo một axios instance được cấu hình sẵn với baseURL, timeout, headers
 * - Cung cấp một cách thống nhất để gọi API từ JSON Server
 * - Được import và sử dụng ở tất cả components cần gọi API
 * 
 * Cấu hình:
 * - baseURL: "http://localhost:3001" - URL của JSON Server
 * - timeout: 5000ms - Timeout cho mỗi request
 * - headers: Content-Type: application/json
 * 
 * Được sử dụng ở:
 * - AuthContext.jsx: GET /users (fetch danh sách users)
 * - MotobikesList.jsx: GET /motobikes, PATCH /motobikes/:id
 * - ViewMotorbike.jsx: GET /motobikes/:id
 * - CartPage.jsx: GET /motobikes/:id, PATCH /motobikes/:id
 * 
 * Ví dụ sử dụng:
 * import MotorbikeAPI from "../api/MotorbikeAPI";
 * 
 * // GET request
 * const response = await MotorbikeAPI.get("/motobikes");
 * 
 * // POST request
 * await MotorbikeAPI.post("/motobikes", { name: "...", ... });
 * 
 * // PATCH request
 * await MotorbikeAPI.patch("/motobikes/1", { quantity: 5 });
 * 
 * // DELETE request
 * await MotorbikeAPI.delete("/motobikes/1");
 */

import axios from "axios";

// Tạo axios instance với cấu hình tùy chỉnh
// axios.create() tạo một instance mới với các cấu hình mặc định
// Tất cả requests sử dụng instance này sẽ tự động có baseURL, timeout, headers
const motobikeApi = axios.create({
  baseURL: "http://localhost:3001",  // Base URL của JSON Server
                                      // Tất cả requests sẽ được gửi đến http://localhost:3001
  timeout: 5000,                      // Timeout 5 giây - nếu request không hoàn thành trong 5s sẽ bị cancel
  headers: {
    "Content-Type": "application/json", // Header để báo cho server biết ta gửi dữ liệu dạng JSON
  },
});

// Export default để có thể import ở các file khác
// Sử dụng: import MotorbikeAPI from "../api/MotorbikeAPI";
export default motobikeApi;