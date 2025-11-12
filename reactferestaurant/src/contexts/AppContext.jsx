/**
 * AppContext - Global application context
 * Manages global app state that doesn't belong to AuthContext
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const setErrorWithTimeout = useCallback((errorMessage, timeout = 5000) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, timeout);
  }, []);

  const setSuccessWithTimeout = useCallback((message, timeout = 5000) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, timeout);
  }, []);

  const value = {
    loading,
    setLoading,
    error,
    setError,
    clearError,
    setErrorWithTimeout,
    successMessage,
    setSuccessMessage,
    clearSuccessMessage,
    setSuccessWithTimeout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

