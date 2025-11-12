/**
 * Validation utility functions
 */

import { BOOKING_CONSTANTS } from './constants';

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnamese format)
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Vietnamese phone: 10 digits, starting with 0
  return cleaned.length === 10 && cleaned.startsWith('0');
};

/**
 * Validate guest count
 */
export const isValidGuestCount = (count) => {
  const num = parseInt(count, 10);
  return (
    !isNaN(num) &&
    num >= BOOKING_CONSTANTS.MIN_GUESTS &&
    num <= BOOKING_CONSTANTS.MAX_GUESTS
  );
};

/**
 * Validate booking date and time
 * Date must be in the future, at least TIME_BUFFER_MINUTES from now
 */
export const isValidBookingDateTime = (date, time) => {
  if (!date || !time) return false;

  const bookingDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  const minDateTime = new Date(
    now.getTime() + BOOKING_CONSTANTS.TIME_BUFFER_MINUTES * 60 * 1000
  );

  return bookingDateTime >= minDateTime;
};

/**
 * Validate deposit amount
 */
export const isValidDeposit = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= BOOKING_CONSTANTS.MIN_DEPOSIT;
};

/**
 * Validate note length
 */
export const isValidNote = (note) => {
  if (!note) return true; // Note is optional
  return note.length <= BOOKING_CONSTANTS.MAX_NOTE_LENGTH;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Get validation error message
 */
export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      if (!isRequired(value)) return 'Email là bắt buộc';
      if (!isValidEmail(value)) return 'Email không hợp lệ';
      return null;
    case 'phone':
      if (!isRequired(value)) return 'Số điện thoại là bắt buộc';
      if (!isValidPhone(value)) return 'Số điện thoại không hợp lệ';
      return null;
    case 'guests':
      if (!isRequired(value)) return 'Số khách là bắt buộc';
      if (!isValidGuestCount(value)) return `Số khách phải từ ${BOOKING_CONSTANTS.MIN_GUESTS} đến ${BOOKING_CONSTANTS.MAX_GUESTS} người`;
      return null;
    case 'date':
      if (!isRequired(value)) return 'Ngày đặt bàn là bắt buộc';
      return null;
    case 'time':
      if (!isRequired(value)) return 'Giờ đặt bàn là bắt buộc';
      return null;
    case 'deposit':
      if (!isValidDeposit(value)) return `Số tiền đặt cọc phải >= ${BOOKING_CONSTANTS.MIN_DEPOSIT} ₫`;
      return null;
    case 'note':
      if (!isValidNote(value)) return `Ghi chú không được vượt quá ${BOOKING_CONSTANTS.MAX_NOTE_LENGTH} ký tự`;
      return null;
    default:
      return null;
  }
};

