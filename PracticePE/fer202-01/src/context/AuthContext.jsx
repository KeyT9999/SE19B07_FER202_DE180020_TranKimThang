import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useEffect,
} from "react";

import { authReducer, initialState } from "../reducers/AuthReducer";
import PhoneAPI from "../api/PhoneAPI";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchUser = useCallback(async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const response = await PhoneAPI.get("/accounts");
      dispatch({ type: "SET_USERS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_USERS", payload: [] });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function login(identifier, password) {
    dispatch({ type: "LOGIN_START" });
    return new Promise((resolve) => {
      setTimeout(() => {
        const isEmail = identifier.includes("@");
        const account = state.users.find((acc) =>
          isEmail
            ? acc.email === identifier && acc.password === password
            : acc.username === identifier && acc.password === password
        );

        if (!account) {
          dispatch({ type: "LOGIN_FAILURE", payload: "Invalid username or password!" });
          resolve({ ok: false });
          return;
        }

        if (account.status === "locked") {
          dispatch({ type: "LOGIN_FAILURE", payload: "Account locked." });
          resolve({ ok: false });
          return;
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: account });
        resolve({ ok: true, account });
      }, 1000);
    });
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
  }

  function clearError() {
    dispatch({ type: "CLEAR_ERROR" });
  }

  const contextValue = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export default AuthContext;

