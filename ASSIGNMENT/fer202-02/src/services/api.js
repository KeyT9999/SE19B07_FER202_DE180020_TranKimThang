//api.js chứa các hàm gọi API tới JSON Server
import axios from 'axios';

// Cấu hình Base URL cho JSON Server (giả định chạy ở cổng 3001)
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

export const getExpenses = async (params = {}) => {
  try {
    const response = await API.get('/expenses', { params });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expenses');
  }
};

export const getExpenseById = async (id) => {
  try {
    const response = await API.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expense detail');
  }
};

export const createExpense = async (payload) => {
  try {
    const response = await API.post('/expenses', payload);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const updateExpenseById = async (id, payload) => {
  try {
    const response = await API.put(`/expenses/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update expense');
  }
};

export const deleteExpenseById = async (id) => {
  try {
    await API.delete(`/expenses/${id}`);
  } catch (error) {
    throw new Error('Failed to delete expense');
  }
};

