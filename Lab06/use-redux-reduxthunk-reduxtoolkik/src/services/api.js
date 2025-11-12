//api.js chứa các hàm gọi API tới JSON Server
import axios from 'axios';
// Cấu hình Base URL cho JSON Server
// Giả định JSON Server đang chạy trên cổng 3001 
const API = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async () => {
    try {
        const response = await API.get('/users');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const getPayments = async () => {
    try {
        const response = await API.get('/payments');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payments');
    }
};

export const getPaymentById = async (id) => {
    try {
        const response = await API.get(`/payments/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payment detail');
    }
};

export const createPayment = async (payload) => {
    try {
        const response = await API.post('/payments', payload);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create payment');
    }
};

export const updatePaymentById = async (id, payload) => {
    try {
        const response = await API.put(`/payments/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update payment');
    }
};

export const deletePaymentById = async (id) => {
    try {
        await API.delete(`/payments/${id}`);
    } catch (error) {
        throw new Error('Failed to delete payment');
    }
};

// Các hàm API cho User Management - sử dụng db.json
export const getUserById = async (id) => {
    try {
        const response = await API.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user detail');
    }
};

export const updateUserById = async (id, payload) => {
    try {
        const response = await API.put(`/users/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export const banUser = async (id) => {
    try {
        const user = await getUserById(id);
        const updatedUser = { ...user, status: 'blocked' };
        const response = await API.put(`/users/${id}`, updatedUser);
        return response.data;
    } catch (error) {
        throw new Error('Failed to ban user');
    }
};

export const unbanUser = async (id) => {
    try {
        const user = await getUserById(id);
        const updatedUser = { ...user, status: 'active' };
        const response = await API.put(`/users/${id}`, updatedUser);
        return response.data;
    } catch (error) {
        throw new Error('Failed to unban user');
    }
};
