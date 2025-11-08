/**
 * api.js - Service layer để gọi API tới JSON Server
 * 
 * CHỨC NĂNG CHÍNH:
 * 1. Cấu hình axios instance với baseURL
 * 2. Định nghĩa các hàm API để tương tác với server (db.json)
 * 3. Xử lý lỗi và throw error messages
 * 
 * CẤU HÌNH:
 * - Base URL: http://localhost:3001 (JSON Server)
 * - Content-Type: application/json
 * 
 * CÁC API FUNCTIONS:
 * - User Management:
 *   + getUsers(): Lấy danh sách tất cả users
 *   + getUserById(id): Lấy thông tin user theo ID
 *   + updateUserById(id, payload): Cập nhật thông tin user
 *   + banUser(id): Khóa tài khoản user (set status = 'blocked')
 *   + unbanUser(id): Mở khóa tài khoản user (set status = 'active')
 * 
 * - Payment Management (không dùng trong user management app):
 *   + getPayments(): Lấy danh sách payments
 *   + getPaymentById(id): Lấy thông tin payment theo ID
 *   + createPayment(payload): Tạo payment mới
 *   + updatePaymentById(id, payload): Cập nhật payment
 *   + deletePaymentById(id): Xóa payment
 * 
 * LUỒNG XỬ LÝ:
 * 1. Component gọi API function (ví dụ: getUsers())
 * 2. Function gọi axios instance với endpoint tương ứng
 * 3. Nếu thành công: Trả về data từ response
 * 4. Nếu thất bại: Throw error với message tương ứng
 */

// Import axios để gọi HTTP requests
import axios from 'axios';

// ==========================================
// AXIOS INSTANCE CONFIGURATION
// ==========================================

/**
 * API - Axios instance được cấu hình với baseURL
 * 
 * CẤU HÌNH:
 * - baseURL: 'http://localhost:3001' (JSON Server)
 * - headers: Content-Type: application/json
 * 
 * LỢI ÍCH:
 * - Không cần nhập baseURL mỗi lần gọi API
 * - Tự động thêm headers cho mọi request
 * - Dễ dàng thay đổi baseURL khi cần
 */
const API = axios.create({
  baseURL: 'http://localhost:3001',  // Base URL của JSON Server
  headers: {
    'Content-Type': 'application/json',  // Content-Type header
  },
});

// ==========================================
// USER MANAGEMENT APIs
// ==========================================

/**
 * getUsers() - Lấy danh sách tất cả users
 * 
 * LUỒNG XỬ LÝ:
 * 1. Gọi GET /users đến JSON Server
 * 2. Nếu thành công: Trả về response.data (mảng users)
 * 3. Nếu thất bại: Throw error với message 'Failed to fetch users'
 * 
 * @returns {Promise<Array>} Mảng chứa danh sách users
 * @throws {Error} Lỗi nếu không thể fetch users
 */
export const getUsers = async () => {
    try {
        // Gọi GET request đến endpoint /users
        const response = await API.get('/users');
        
        // Trả về data từ response
        return response.data;
    } catch (error) {
        // Nếu có lỗi, throw error với message
        throw new Error('Failed to fetch users');
    }
};

/**
 * getUserById() - Lấy thông tin user theo ID
 * 
 * @param {string|number} id - ID của user cần lấy
 * @returns {Promise<Object>} User object
 * @throws {Error} Lỗi nếu không thể fetch user
 */
export const getUserById = async (id) => {
    try {
        // Gọi GET request đến endpoint /users/:id
        const response = await API.get(`/users/${id}`);
        
        // Trả về data từ response
        return response.data;
    } catch (error) {
        // Nếu có lỗi, throw error với message
        throw new Error('Failed to fetch user detail');
    }
};

/**
 * updateUserById() - Cập nhật thông tin user
 * 
 * @param {string|number} id - ID của user cần cập nhật
 * @param {Object} payload - Object chứa dữ liệu cần cập nhật
 * @returns {Promise<Object>} User object đã được cập nhật
 * @throws {Error} Lỗi nếu không thể update user
 */
export const updateUserById = async (id, payload) => {
    try {
        // Gọi PUT request đến endpoint /users/:id với payload
        const response = await API.put(`/users/${id}`, payload);
        
        // Trả về data từ response
        return response.data;
    } catch (error) {
        // Nếu có lỗi, throw error với message
        throw new Error('Failed to update user');
    }
};

/**
 * banUser() - Khóa tài khoản user (set status = 'blocked')
 * 
 * LUỒNG XỬ LÝ:
 * 1. Gọi getUserById() để lấy thông tin user hiện tại
 * 2. Tạo updatedUser với status = 'blocked'
 * 3. Gọi updateUserById() để cập nhật user
 * 4. Trả về user đã được cập nhật
 * 
 * @param {string|number} id - ID của user cần khóa
 * @returns {Promise<Object>} User object đã được cập nhật (status = 'blocked')
 * @throws {Error} Lỗi nếu không thể ban user
 */
export const banUser = async (id) => {
    try {
        // Bước 1: Lấy thông tin user hiện tại
        const user = await getUserById(id);
        
        // Bước 2: Tạo object user mới với status = 'blocked'
        const updatedUser = { ...user, status: 'blocked' };
        
        // Bước 3: Cập nhật user với status mới
        const response = await API.put(`/users/${id}`, updatedUser);
        
        // Trả về user đã được cập nhật
        return response.data;
    } catch (error) {
        // Nếu có lỗi, throw error với message
        throw new Error('Failed to ban user');
    }
};

/**
 * unbanUser() - Mở khóa tài khoản user (set status = 'active')
 * 
 * LUỒNG XỬ LÝ:
 * 1. Gọi getUserById() để lấy thông tin user hiện tại
 * 2. Tạo updatedUser với status = 'active'
 * 3. Gọi updateUserById() để cập nhật user
 * 4. Trả về user đã được cập nhật
 * 
 * @param {string|number} id - ID của user cần mở khóa
 * @returns {Promise<Object>} User object đã được cập nhật (status = 'active')
 * @throws {Error} Lỗi nếu không thể unban user
 */
export const unbanUser = async (id) => {
    try {
        // Bước 1: Lấy thông tin user hiện tại
        const user = await getUserById(id);
        
        // Bước 2: Tạo object user mới với status = 'active'
        const updatedUser = { ...user, status: 'active' };
        
        // Bước 3: Cập nhật user với status mới
        const response = await API.put(`/users/${id}`, updatedUser);
        
        // Trả về user đã được cập nhật
        return response.data;
    } catch (error) {
        // Nếu có lỗi, throw error với message
        throw new Error('Failed to unban user');
    }
};

// ==========================================
// PAYMENT MANAGEMENT APIs (KHÔNG DÙNG TRONG USER MANAGEMENT APP)
// ==========================================

/**
 * getPayments() - Lấy danh sách tất cả payments
 * (Không dùng trong user management app)
 * 
 * @returns {Promise<Array>} Mảng chứa danh sách payments
 * @throws {Error} Lỗi nếu không thể fetch payments
 */
export const getPayments = async () => {
    try {
        const response = await API.get('/payments');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payments');
    }
};

/**
 * getPaymentById() - Lấy thông tin payment theo ID
 * (Không dùng trong user management app)
 * 
 * @param {string|number} id - ID của payment cần lấy
 * @returns {Promise<Object>} Payment object
 * @throws {Error} Lỗi nếu không thể fetch payment
 */
export const getPaymentById = async (id) => {
    try {
        const response = await API.get(`/payments/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payment detail');
    }
};

/**
 * createPayment() - Tạo payment mới
 * (Không dùng trong user management app)
 * 
 * @param {Object} payload - Object chứa dữ liệu payment cần tạo
 * @returns {Promise<Object>} Payment object đã được tạo
 * @throws {Error} Lỗi nếu không thể create payment
 */
export const createPayment = async (payload) => {
    try {
        const response = await API.post('/payments', payload);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create payment');
    }
};

/**
 * updatePaymentById() - Cập nhật thông tin payment
 * (Không dùng trong user management app)
 * 
 * @param {string|number} id - ID của payment cần cập nhật
 * @param {Object} payload - Object chứa dữ liệu cần cập nhật
 * @returns {Promise<Object>} Payment object đã được cập nhật
 * @throws {Error} Lỗi nếu không thể update payment
 */
export const updatePaymentById = async (id, payload) => {
    try {
        const response = await API.put(`/payments/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update payment');
    }
};

/**
 * deletePaymentById() - Xóa payment
 * (Không dùng trong user management app)
 * 
 * @param {string|number} id - ID của payment cần xóa
 * @returns {Promise<void>} Không trả về giá trị
 * @throws {Error} Lỗi nếu không thể delete payment
 */
export const deletePaymentById = async (id) => {
    try {
        await API.delete(`/payments/${id}`);
    } catch (error) {
        throw new Error('Failed to delete payment');
    }
};
