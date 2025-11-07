export const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true };
    
    case "SET_USERS":
      return { ...state, loading: false, users: action.payload || [] };
    
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      };
    
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    
    case "CLEAR_ERROR":
      return { ...state, error: null };
    
    default:
      return state;
  }
};

