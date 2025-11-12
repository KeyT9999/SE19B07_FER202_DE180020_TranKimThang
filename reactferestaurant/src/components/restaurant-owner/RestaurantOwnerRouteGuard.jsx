/**
 * RestaurantOwnerRouteGuard Component
 * Protects restaurant owner routes - only allows restaurant_owner users to access
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RestaurantOwnerRouteGuard({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'restaurant_owner') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RestaurantOwnerRouteGuard;

