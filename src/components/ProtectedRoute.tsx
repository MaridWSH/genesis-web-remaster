
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Use an effect to avoid flash of redirect
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        toast.error("You need to login to access this page");
      }
      setIsChecking(false);
    };
    
    // Short timeout to allow auth state to be checked
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  if (isChecking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("User authenticated:", user?.email);
  return <>{children}</>;
};

export default ProtectedRoute;
