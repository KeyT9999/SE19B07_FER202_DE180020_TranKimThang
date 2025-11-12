import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import paymentsReducer from '../features/payments/paymentsSlice';

/**
 * Root Redux store configuration.
 * Reducers will be injected as slices are implemented.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    payments: paymentsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

