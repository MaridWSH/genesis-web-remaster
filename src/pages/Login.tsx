
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Get the intended destination from location state or default to '/tasks'
  const from = location.state?.from?.pathname || '/tasks';
  
  if (isAuthenticated) {
    console.log("User is already authenticated, redirecting to:", from);
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm />
    </div>
  );
};

export default Login;
