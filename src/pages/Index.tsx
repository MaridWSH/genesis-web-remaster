
import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to tasks page if authenticated, otherwise show landing page
  return isAuthenticated ? <Navigate to="/tasks" replace /> : <LandingPage />;
};

export default Index;
