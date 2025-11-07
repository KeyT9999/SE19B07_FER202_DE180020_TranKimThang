/**
 * FILE: videoAPI.js
 * MỤC ĐÍCH: Tạo Axios instance để gọi API tới JSON Server
 * VỊ TRÍ: src/api/videoAPI.js
 * 
 * LUỒNG XỬ LÝ:
 * 1. File này được import vào videoSlice.js
 * 2. videoSlice.js sử dụng videoAPI.get('/videos') để fetch dữ liệu
 * 3. Axios tự động thêm baseURL vào request -> http://localhost:3001/videos
 * 
 * TẠI SAO DÙNG AXIOS INSTANCE?
 * - Tái sử dụng cấu hình (baseURL, timeout) thay vì lặp lại ở mọi nơi
 * - Dễ dàng thay đổi API endpoint (chỉ cần sửa 1 chỗ)
 * - Có thể thêm interceptors (xử lý request/response chung) sau này
 */

// Import axios library - thư viện để gọi HTTP requests
import axios from 'axios';

/**
 * Tạo Axios instance với cấu hình tùy chỉnh
 * axios.create() tạo một instance riêng với cấu hình mặc định
 * 
 * TẠI SAO KHÔNG DÙNG axios.get() trực tiếp?
 * - Nếu dùng axios.get() trực tiếp, mỗi lần gọi phải viết đầy đủ URL
 * - Với instance, chỉ cần viết endpoint tương đối: '/videos'
 * - Axios tự động thêm baseURL: 'http://localhost:3001' + '/videos'
 *   => http://localhost:3001/videos
 */
const videoAPI = axios.create({
  // baseURL: URL cơ sở của API server
  // JSON Server chạy trên port 3001 (khác với React app port 3000)
  // Tất cả requests sẽ có prefix này: http://localhost:3001/...
  baseURL: 'http://localhost:3001',
  
  // timeout: Thời gian chờ tối đa cho mỗi request (milliseconds)
  // Nếu server không phản hồi trong 10 giây -> throw error
  // Tránh app bị "treo" mãi mãi khi server down
  timeout: 10000,
});

/**
 * Export default: Cho phép import dễ dàng
 * Cách sử dụng: import videoAPI from './api/videoAPI'
 * 
 * LUỒNG SỬ DỤNG:
 * 1. Component hoặc Redux slice import videoAPI
 * 2. Gọi: videoAPI.get('/videos')
 * 3. Axios tự động tạo request: GET http://localhost:3001/videos
 * 4. Trả về Promise với response data
 */
export default videoAPI;
