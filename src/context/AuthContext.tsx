
import React, { createContext, useState, useContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // For demo purposes, we'll simulate authentication
  const login = async (email: string, password: string) => {
    // In a real app, you would validate credentials against your API
    if (email && password) {
      // Simulate successful login
      setUser({
        id: "1",
        name: "Test User",
        email,
        memberSince: new Date().toISOString(),
      });
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, you would send this data to your API
    if (name && email && password) {
      // Simulate successful registration
      setUser({
        id: "1",
        name,
        email,
        memberSince: new Date().toISOString(),
      });
    } else {
      throw new Error("Please fill in all fields");
    }
  };

  const logout = () => {
    setUser(null);
  };
  
  const updateProfile = async (data: Partial<User>) => {
    // In a real app, you would update this with your API
    if (user) {
      // Simulate successful profile update
      setUser({
        ...user,
        ...data
      });
    } else {
      throw new Error("User not authenticated");
    }
  };
  
  const resetPassword = async (email: string) => {
    // In a real app, this would trigger a password reset email
    // For demo purposes, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  };
  
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    // In a real app, you would verify the current password and update to the new one
    // For demo purposes, we'll just simulate a delay
    if (currentPassword && newPassword) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    } else {
      throw new Error("Please provide both current and new passwords");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateProfile,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
