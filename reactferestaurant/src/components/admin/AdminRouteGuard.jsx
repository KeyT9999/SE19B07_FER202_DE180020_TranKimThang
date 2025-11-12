/**
 * AdminRouteGuard Component
 * Protects admin routes - only allows admin users to access
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminRouteGuard({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRouteGuard;

