import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuthState } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, authLoading } = useAuthState();
  const location = useLocation();

  // Show a loader while we are checking authentication (e.g., on refresh).
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Đang xác thực...</span>
      </div>
    );
  }

  // No user means redirect back to the login page and remember where we came from.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
