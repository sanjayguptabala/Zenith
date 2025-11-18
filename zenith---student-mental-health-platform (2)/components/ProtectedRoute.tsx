import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  children: React.ReactElement;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && !isAdmin) {
      // if trying to access admin route as a normal user, redirect to user dashboard
      return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && isAdmin) {
      // if trying to access user route as an admin, redirect to admin dashboard
      return <Navigate to="/admin/dashboard" replace />;
  }


  return children;
};

export default ProtectedRoute;