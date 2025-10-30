// src/api/movieApi.js
import axios from 'axios';

// Tạo một instance Axios dùng chung cho toàn bộ ứng dụng
const movieApi = axios.create({
  baseURL: 'http://localhost:3001', // Địa chỉ gốc của json-server
  timeout: 5000,                    // Giới hạn thời gian chờ 5 giây
  headers: {
    'Content-Type': 'application/json', // Mặc định gửi dữ liệu dạng JSON
  },
});

export default movieApi;
