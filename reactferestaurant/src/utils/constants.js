/**
 * Constants used throughout the application
 */

// API Endpoints for JSON Server
export const API_ENDPOINTS = {
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAIL: (id) => `/restaurants/${id}`,
  RESTAURANT_TABLES: (id) => `/tables?restaurantId=${id}`,
  RESTAURANT_SERVICES: (id) => `/services?restaurantId=${id}`,
  RESTAURANT_TABLE_LAYOUTS: (id) => `/table-layouts?restaurantId=${id}`,
  RESTAURANT_NEARBY: '/restaurants', // Will filter on frontend
  BOOKING_AVAILABILITY: '/bookings', // Will check availability on frontend
  BOOKING_CREATE: '/bookings',
  BOOKING_DETAIL: (id) => `/bookings/${id}`,
  BOOKING_UPDATE: (id) => `/bookings/${id}`,
  BOOKING_CANCEL: (id) => `/bookings/${id}`,
  BOOKING_MY: '/bookings', // Will filter by customerId on frontend
  AI_SEARCH: '/restaurants', // Will implement simple search on frontend
};

// Booking Constants
export const BOOKING_CONSTANTS = {
  MIN_GUESTS: 1,
  MAX_GUESTS: 20,
  TIME_BUFFER_MINUTES: 30,
  MIN_DEPOSIT: 0,
  MAX_NOTE_LENGTH: 500,
};

// Time Slots - Extended hours for restaurants (11:00 AM - 10:30 PM)
export const TIME_SLOTS = [
  // Buổi trưa
  { value: '11:00', text: '11:00 AM' },
  { value: '11:30', text: '11:30 AM' },
  { value: '12:00', text: '12:00 PM' },
  { value: '12:30', text: '12:30 PM' },
  { value: '13:00', text: '1:00 PM' },
  { value: '13:30', text: '1:30 PM' },
  { value: '14:00', text: '2:00 PM' },
  { value: '14:30', text: '2:30 PM' },
  { value: '15:00', text: '3:00 PM' },
  { value: '15:30', text: '3:30 PM' },
  { value: '16:00', text: '4:00 PM' },
  { value: '16:30', text: '4:30 PM' },
  // Buổi tối
  { value: '17:00', text: '5:00 PM' },
  { value: '17:30', text: '5:30 PM' },
  { value: '18:00', text: '6:00 PM' },
  { value: '18:30', text: '6:30 PM' },
  { value: '19:00', text: '7:00 PM' },
  { value: '19:30', text: '7:30 PM' },
  { value: '20:00', text: '8:00 PM' },
  { value: '20:30', text: '8:30 PM' },
  { value: '21:00', text: '9:00 PM' },
  { value: '21:30', text: '9:30 PM' },
  { value: '22:00', text: '10:00 PM' },
  { value: '22:30', text: '10:30 PM' },
];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OCCUPIED: 'OCCUPIED',
  CLEANING: 'CLEANING',
};

// Cuisine Types
export const CUISINE_TYPES = [
  'Vietnamese',
  'Italian',
  'Japanese',
  'Chinese',
  'Korean',
  'Thai',
  'French',
  'American',
  'Seafood',
  'BBQ',
  'Other',
];

// Default values
export const DEFAULT_RADIUS = 3000; // meters
export const DEFAULT_LIMIT = 10;

