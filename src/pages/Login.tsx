
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the intended destination from location state or default to '/tasks'
  const from = location.state?.from?.pathname || '/tasks';
  
  console.log("Login page - Auth state:", { isAuthenticated, user, from });
  
  useEffect(() => {
    // If user is already authenticated, redirect with a message
    if (isAuthenticated) {
      console.log("Login page: User is already authenticated, redirecting to:", from);
      toast.info("You are already logged in");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // If authenticated immediately, render redirect
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm redirectPath={from} />
    </div>
  );
};

export default Login;
