
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
    let mounted = true;
    
    const checkAuth = () => {
      console.log("ProtectedRoute: Auth check -", isAuthenticated ? "Authenticated" : "Not authenticated");
      
      if (!isAuthenticated && mounted) {
        toast.error("You need to login to access this page");
      }
      
      if (mounted) {
        setIsChecking(false);
      }
    };
    
    // Check auth state immediately if it's already determined
    if (isAuthenticated !== undefined) {
      checkAuth();
    } else {
      // Short timeout to allow auth state to be checked
      const timer = setTimeout(checkAuth, 300);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);
  
  // If we're still checking auth status, show loading
  if (isChecking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from path:", location.pathname);
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("User authenticated:", user?.email);
  return <>{children}</>;
};

export default ProtectedRoute;
