// API client cấu hình sẵn cho toàn bộ ứng dụng (Axios instance)
// - baseURL: URL của JSON Server (hoặc backend thật)
// - timeout: thời gian tối đa cho một request
// - headers: header mặc định cho mọi request
import axios from 'axios';

const movieAPI = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
    headers: {
        "Content-Type": 'application/json',
    }
});

// Export instance để các nơi khác chỉ cần import và gọi: movieAPI.get/post/put/delete
export default movieAPI;