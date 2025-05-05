
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the intended destination from location state or default to '/tasks'
  const from = location.state?.from?.pathname || '/tasks';
  
  useEffect(() => {
    // If user is already authenticated, redirect with a message
    if (isAuthenticated) {
      console.log("Login page: User is already authenticated, redirecting to:", from);
      toast.info("You are already logged in");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Don't render an immediate redirect, let the useEffect handle it
  // This prevents potential infinite redirect loops
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm />
    </div>
  );
};

export default Login;
