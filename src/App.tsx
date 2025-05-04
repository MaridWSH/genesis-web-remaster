
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import { TeamProvider } from "@/context/TeamContext";
import { GamificationProvider } from "@/context/GamificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TasksPage from "./pages/TasksPage";
import Features from "./pages/Features";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Achievements from "./pages/Achievements";
import Calendar from "./pages/Calendar";
import Teams from "./pages/Teams";

const queryClient = new QueryClient();

const App = () => {
  // Only apply dark mode if it has been explicitly set to true
  // Default to light mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  } else {
    // Remove dark class by default
    document.documentElement.classList.remove('dark');
    // Ensure we have the setting saved
    localStorage.setItem('darkMode', 'false');
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TaskProvider>
            <TeamProvider>
              <GamificationProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route 
                      path="/tasks" 
                      element={
                        <ProtectedRoute>
                          <TasksPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/features" 
                      element={
                        <ProtectedRoute>
                          <Features />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/achievements" 
                      element={
                        <ProtectedRoute>
                          <Achievements />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/calendar" 
                      element={
                        <ProtectedRoute>
                          <Calendar />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/teams" 
                      element={
                        <ProtectedRoute>
                          <Teams />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </GamificationProvider>
            </TeamProvider>
          </TaskProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
