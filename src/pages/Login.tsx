
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the intended destination from location state or default to '/tasks'
  const from = location.state?.from?.pathname || '/tasks';
  
  console.log("Login page - Auth state:", { isAuthenticated, from });
  
  useEffect(() => {
    // If user is already authenticated, redirect without showing extra toasts
    if (isAuthenticated) {
      console.log("Login page: User is already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // If authenticated immediately, we let the useEffect handle navigation
  // instead of rendering a redirect to avoid toast duplication
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm redirectPath={from} />
    </div>
  );
};

export default Login;
