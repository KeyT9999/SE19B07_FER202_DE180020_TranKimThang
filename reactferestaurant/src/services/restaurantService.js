/**
 * Restaurant Service
 * Handles all API calls related to restaurants using JSON Server
 */

import api from './api';
import { API_ENDPOINTS, DEFAULT_RADIUS, DEFAULT_LIMIT } from '../utils/constants';

/**
 * Get all restaurants
 */
export const getAllRestaurants = async () => {
  try {
    console.log('[getAllRestaurants] Fetching from:', API_ENDPOINTS.RESTAURANTS);
    const response = await api.get(API_ENDPOINTS.RESTAURANTS);
    console.log('API Response received:', response.status, response.data?.length || 0, 'items');
    
    // JSON Server returns array directly
    const data = response.data;
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log('Returning array of', data.length, 'restaurants');
      return data;
    } else if (data && Array.isArray(data.restaurants)) {
      console.log('Returning restaurants array from nested object:', data.restaurants.length);
      return data.restaurants;
    } else if (data && data.data && Array.isArray(data.data)) {
      console.log('Returning data array from nested object:', data.data.length);
      return data.data;
    }
    
    // If data exists but not in expected format
    console.warn('Unexpected data format from API:', typeof data, data);
    return [];
  } catch (error) {
    console.error('=== Error fetching restaurants ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // More detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error('Response status:', error.response.status);
      console.error('Response status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server');
      console.error('Request URL:', error.config?.url);
      console.error('Request baseURL:', error.config?.baseURL);
      console.error('Full request config:', error.config);
    } else {
      // Error setting up request
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

/**
 * Get restaurant by ID
 * Supports both id and restaurantId lookup
 */
export const getRestaurantById = async (id) => {
  try {
    // First try to get by id (JSON Server default)
    try {
      const response = await api.get(API_ENDPOINTS.RESTAURANT_DETAIL(id));
      if (response.data) {
        console.log(`[getRestaurantById] Found restaurant by id:`, id);
        return response.data;
      }
    } catch (idError) {
      // If 404 or other error, continue to try restaurantId
      if (idError.response?.status === 404) {
        console.log(`[getRestaurantById] Not found by id ${id}, trying restaurantId...`);
      } else {
        console.warn(`[getRestaurantById] Error fetching by id ${id}:`, idError.message);
      }
    }
    
    // If not found by id, try to find by restaurantId
    // Get all restaurants and filter
    console.log(`[getRestaurantById] Fetching all restaurants to search by restaurantId...`);
    const allRestaurants = await getAllRestaurants();
    const restaurantIdNum = parseInt(id);
    const restaurantIdStr = id.toString();
    
    // Try to find by restaurantId (supports both number and string)
    const restaurant = allRestaurants.find(r => {
      // Match by restaurantId (number)
      if (r.restaurantId === restaurantIdNum) return true;
      // Match by restaurantId (string)
      if (r.restaurantId?.toString() === restaurantIdStr) return true;
      // Match by id (string)
      if (r.id === restaurantIdStr) return true;
      // Match by id (number)
      if (r.id === restaurantIdNum) return true;
      return false;
    });
    
    if (restaurant) {
      console.log(`[getRestaurantById] Found restaurant by restaurantId:`, restaurant.restaurantId, restaurant.restaurantName);
      return restaurant;
    }
    
    // If still not found, throw error
    console.error(`[getRestaurantById] Restaurant not found with id/restaurantId:`, id);
    throw new Error(`Restaurant with id ${id} not found`);
  } catch (error) {
    console.error(`[getRestaurantById] Error fetching restaurant ${id}:`, error);
    // If it's already our custom error, re-throw it
    if (error.message.includes('not found')) {
      throw error;
    }
    // Otherwise, wrap it
    throw new Error(`Failed to fetch restaurant: ${error.message}`);
  }
};

/**
 * Get tables by restaurant ID
 * Uses query parameter to filter by restaurantId
 */
export const getRestaurantTables = async (id) => {
  try {
    console.log(`[getRestaurantTables] Fetching tables for restaurant ${id}`);
    const endpoint = API_ENDPOINTS.RESTAURANT_TABLES(id);
    console.log(`[getRestaurantTables] Endpoint:`, endpoint);
    
    const response = await api.get(endpoint);
    console.log(`[getRestaurantTables] Response status:`, response.status);
    console.log(`[getRestaurantTables] Response data:`, response.data);
    console.log(`[getRestaurantTables] Data type:`, typeof response.data);
    console.log(`[getRestaurantTables] Is array:`, Array.isArray(response.data));
    
    // Handle different response formats
    let tables = response.data;
    if (Array.isArray(tables)) {
      console.log(`[getRestaurantTables] Returning ${tables.length} tables`);
      return tables;
    } else if (tables && Array.isArray(tables.tables)) {
      console.log(`[getRestaurantTables] Returning ${tables.tables.length} tables from nested object`);
      return tables.tables;
    } else if (tables && Array.isArray(tables.data)) {
      console.log(`[getRestaurantTables] Returning ${tables.data.length} tables from data property`);
      return tables.data;
    } else {
      console.warn(`[getRestaurantTables] Unexpected data format:`, tables);
      return [];
    }
  } catch (error) {
    console.error(`[getRestaurantTables] Error fetching tables for restaurant ${id}:`, error);
    if (error.response) {
      console.error(`[getRestaurantTables] Response error:`, error.response.status, error.response.data);
    }
    // Return empty array instead of throwing to allow booking to continue
    console.warn(`[getRestaurantTables] Returning empty array due to error`);
    return [];
  }
};

/**
 * Get services by restaurant ID
 * Uses query parameter to filter by restaurantId
 */
export const getRestaurantServices = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.RESTAURANT_SERVICES(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching services for restaurant ${id}:`, error);
    throw error;
  }
};

/**
 * Get table layouts by restaurant ID
 * Note: JSON Server doesn't have table-layouts, return empty array
 */
export const getRestaurantTableLayouts = async (id) => {
  // JSON Server doesn't have table-layouts collection
  // Return empty array
  return [];
};

/**
 * Get nearby restaurants
 * Note: JSON Server doesn't support geolocation, so we'll return all restaurants
 * In a real app, this would filter by location on the backend
 */
export const getNearbyRestaurants = async (lat, lng, radius = DEFAULT_RADIUS, limit = DEFAULT_LIMIT) => {
  try {
    const response = await api.get(API_ENDPOINTS.RESTAURANT_NEARBY);
    const restaurants = response.data;
    // For JSON Server, we can't filter by location, so just return limited results
    return restaurants.slice(0, limit);
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    throw error;
  }
};

/**
 * Search restaurants by keyword
 * Filters restaurants on frontend based on keyword
 */
export const searchRestaurants = async (keyword) => {
  try {
    const restaurants = await getAllRestaurants();
    if (!keyword) return restaurants;
    
    const lowerKeyword = keyword.toLowerCase();
    return restaurants.filter((restaurant) => {
      const name = restaurant.restaurantName?.toLowerCase() || '';
      const address = restaurant.address?.toLowerCase() || '';
      const cuisine = restaurant.cuisineType?.toLowerCase() || '';
      const description = restaurant.description?.toLowerCase() || '';
      return name.includes(lowerKeyword) || 
             address.includes(lowerKeyword) || 
             cuisine.includes(lowerKeyword) ||
             description.includes(lowerKeyword);
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

