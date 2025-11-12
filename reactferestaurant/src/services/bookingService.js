/**
 * Booking Service
 * Handles all API calls related to bookings using JSON Server
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Check table availability
 * Checks if tables are available for the given time by filtering existing bookings
 */
export const checkAvailability = async (restaurantId, bookingTime, guestCount, selectedTableIds = null) => {
  try {
    // Get all bookings for this restaurant
    const bookingsResponse = await api.get(`${API_ENDPOINTS.BOOKING_AVAILABILITY}?restaurantId=${restaurantId}`);
    const allBookings = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];
    
    // Parse booking time
    const requestedTime = new Date(bookingTime);
    const requestedDate = requestedTime.toISOString().split('T')[0];
    
    // Check for conflicts (bookings within 2 hours of requested time)
    const conflictingBookings = allBookings.filter((booking) => {
      if (!booking || booking.status === 'CANCELLED') return false;
      
      try {
        const bookingTime = new Date(booking.bookingTime);
        if (isNaN(bookingTime.getTime())) return false; // Invalid date
        
        const bookingDate = bookingTime.toISOString().split('T')[0];
        const timeDiff = Math.abs(requestedTime - bookingTime) / (1000 * 60 * 60); // Difference in hours
        
        // Check if booking is on the same date and within 2 hours
        return bookingDate === requestedDate && timeDiff < 2;
      } catch (e) {
        console.warn('Error parsing booking time:', booking);
        return false;
      }
    });
    
    console.log('Conflicting bookings:', conflictingBookings.length);
    
    // If specific tables are selected, check if they're available
    if (selectedTableIds && selectedTableIds.length > 0) {
      const tableIdsArray = typeof selectedTableIds === 'string' 
        ? selectedTableIds.split(',').map(id => parseInt(id.trim()))
        : selectedTableIds.map(id => typeof id === 'string' ? parseInt(id) : id);
      
      const conflictingTableIds = new Set();
      conflictingBookings.forEach((booking) => {
        if (booking.tableIds && Array.isArray(booking.tableIds) && booking.tableIds.length > 0) {
          booking.tableIds.forEach((tableId) => {
            const tid = typeof tableId === 'string' ? parseInt(tableId) : tableId;
            if (tableIdsArray.includes(tid)) {
              conflictingTableIds.add(tid);
            }
          });
        }
      });
      
      if (conflictingTableIds.size > 0) {
        return {
          available: false,
          message: `Các bàn ${Array.from(conflictingTableIds).join(', ')} không khả dụng cho thời gian này`,
          conflictingTables: Array.from(conflictingTableIds),
        };
      }
      
      // If specific tables selected and no conflicts, check if they have enough capacity
      const tablesResponse = await api.get(`/tables?restaurantId=${restaurantId}`);
      const tables = Array.isArray(tablesResponse.data) ? tablesResponse.data : [];
      const selectedTables = tables.filter(t => tableIdsArray.includes(t.tableId));
      const totalCapacity = selectedTables.reduce((sum, table) => sum + (table.capacity || 0), 0);
      
      if (totalCapacity < guestCount) {
        return {
          available: false,
          message: `Bàn đã chọn không đủ chỗ cho ${guestCount} người (tổng capacity: ${totalCapacity})`,
        };
      }
      
      return {
        available: true,
        message: 'Có bàn khả dụng cho thời gian này',
      };
    }
    
    // If no specific tables selected, check if restaurant has enough capacity
    // Get tables for this restaurant
    const tablesResponse = await api.get(`/tables?restaurantId=${restaurantId}`);
    const tables = Array.isArray(tablesResponse.data) ? tablesResponse.data : [];
    
    if (tables.length === 0) {
      // No tables defined, assume available
      return {
        available: true,
        message: 'Có bàn khả dụng cho thời gian này',
      };
    }
    
    // Get table IDs that are in conflicting bookings
    const conflictingTableIds = new Set();
    conflictingBookings.forEach((booking) => {
      if (booking.tableIds && Array.isArray(booking.tableIds) && booking.tableIds.length > 0) {
        booking.tableIds.forEach((tableId) => {
          const tid = typeof tableId === 'string' ? parseInt(tableId) : tableId;
          conflictingTableIds.add(tid);
        });
      }
    });
    
    // Filter available tables (not in conflicting bookings)
    const availableTables = tables.filter((table) => {
      return !conflictingTableIds.has(table.tableId);
    });
    
    console.log('Total tables:', tables.length);
    console.log('Conflicting table IDs:', Array.from(conflictingTableIds));
    console.log('Available tables:', availableTables.length);
    
    const totalCapacity = availableTables.reduce((sum, table) => sum + (table.capacity || 0), 0);
    
    console.log('Total capacity:', totalCapacity, 'Guest count:', guestCount);
    
    if (totalCapacity < guestCount) {
      return {
        available: false,
        message: `Không đủ chỗ cho ${guestCount} người vào thời gian này (còn ${totalCapacity} chỗ)`,
      };
    }
    
    return {
      available: true,
      message: 'Có bàn khả dụng cho thời gian này',
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    // If error, assume available (optimistic) - better UX
    return {
      available: true,
      message: 'Có bàn khả dụng cho thời gian này',
    };
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    // Transform booking data to match db.json structure
    const bookingPayload = {
      restaurantId: bookingData.restaurantId,
      customerId: bookingData.customerId || 1, // Default customer ID
      bookingTime: bookingData.bookingDateTime,
      numberOfGuests: bookingData.guestCount,
      status: 'PENDING',
      depositAmount: bookingData.depositAmount || 0,
      note: bookingData.note || '',
      tableIds: bookingData.tableIds || [],
      serviceIds: bookingData.serviceIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const response = await api.post(API_ENDPOINTS.BOOKING_CREATE, bookingPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Get booking details by ID
 */
export const getBookingDetails = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.BOOKING_DETAIL(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

/**
 * Update booking
 */
export const updateBooking = async (id, bookingData) => {
  try {
    // Get existing booking first
    const existingBooking = await getBookingDetails(id);
    
    // Merge with new data
    const updatedBooking = {
      ...existingBooking,
      ...bookingData,
      updatedAt: new Date().toISOString(),
    };
    
    const response = await api.put(API_ENDPOINTS.BOOKING_UPDATE(id), updatedBooking);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (id) => {
  try {
    // Get existing booking first
    const existingBooking = await getBookingDetails(id);
    
    // Update status to CANCELLED
    const updatedBooking = {
      ...existingBooking,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    };
    
    const response = await api.put(API_ENDPOINTS.BOOKING_UPDATE(id), updatedBooking);
    return response.data;
  } catch (error) {
    console.error(`Error canceling booking ${id}:`, error);
    throw error;
  }
};

/**
 * Get user's bookings
 * Filters bookings by customerId
 */
export const getMyBookings = async (customerId = 1) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.BOOKING_MY}?customerId=${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

