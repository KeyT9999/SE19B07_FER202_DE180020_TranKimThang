import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import movieApi from '../api/movieApi';

// Hold the current authentication state (user, loading flags, etc.).
const AuthStateContext = createContext({
  user: null,
  authLoading: false,
  authError: null,
  isAuthenticated: false
});

// Provide actions (login/logout) so components can trigger auth changes.
const AuthActionsContext = createContext({
  login: async () => ({ success: false }),
  logout: () => {},
  clearError: () => {}
});

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthActions = () => useContext(AuthActionsContext);

export const AuthProvider = ({ children }) => {
  // Attempt to restore the latest session from localStorage when the app boots.
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem('movie-manager:user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Unable to parse stored user session', error);
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const clearError = useCallback(() => setAuthError(null), []);

  // Persist session changes so the user stays logged in on refresh.
  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem('movie-manager:user', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('movie-manager:user');
      }
    } catch (error) {
      console.warn('Unable to persist auth state', error);
    }
  }, [user]);

  const login = useCallback(async (username, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Query json-server for accounts matching the provided username.
      const response = await movieApi.get('/accounts', { params: { username } });
      const account = response.data.find(
        acc => acc.username.toLowerCase() === username.trim().toLowerCase()
      );

      // Reject when username or password is wrong.
      if (!account || account.password !== password.trim()) {
        const message = 'Tên đăng nhập hoặc mật khẩu không chính xác';
        setAuthError(message);
        return { success: false, ok: false, message };
      }

      // Strip password before storing user info in context/localStorage.
      const { password: _password, ...safeAccount } = account;
      setUser(safeAccount);
      return {
        success: true,
        ok: true,
        message: `Chào mừng ${safeAccount.fullName || safeAccount.username}!`
      };
    } catch (error) {
      console.error('Không thể đăng nhập:', error);
      const message = 'Không thể kết nối tới máy chủ, vui lòng thử lại sau';
      setAuthError(message);
      return { success: false, ok: false, message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Clearing the user empties session state and hides protected pages.
    setUser(null);
    setAuthError(null);
  }, []);

  const stateValue = useMemo(
    () => ({
      user,
      authLoading,
      authError,
      isAuthenticated: Boolean(user)
    }),
    [user, authLoading, authError]
  );

  const actionsValue = useMemo(
    () => ({
      login,
      logout,
      clearError
    }),
    [login, logout, clearError]
  );

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();
  if (!state || !actions) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...state,
    ...actions,
    loading: state.authLoading,
    error: state.authError
  };
};
