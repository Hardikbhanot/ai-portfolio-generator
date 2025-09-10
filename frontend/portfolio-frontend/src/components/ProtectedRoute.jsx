import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for the JWT token in localStorage.
  const token = localStorage.getItem('token');

  // If a token exists, the user is considered authenticated.
  // The <Outlet /> component will render the actual page component (e.g., PortfolioViewPage).
  if (token) {
    return <Outlet />;
  }

  // If no token is found, redirect the user to the /login page.
  // The 'replace' prop prevents the user from going back to the protected page with the browser's back button.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;