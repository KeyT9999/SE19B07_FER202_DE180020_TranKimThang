import React, { createContext, useContext, useReducer } from 'react';

// Actions
const SET_USER = 'SET_USER';
const LOGOUT = 'LOGOUT';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const login = (user) => {
    dispatch({ type: SET_USER, payload: user });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
