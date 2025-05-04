
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
