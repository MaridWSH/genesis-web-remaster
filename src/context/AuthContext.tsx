
import React, { createContext, useContext } from "react";
import { useAuthState, UserProfile } from "@/hooks/useAuthState";
import { login, logout, register, updateProfile as updateUserProfile, resetPassword, updatePassword } from "@/utils/authUtils";

type AuthContextType = {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
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
  const { user, session, isLoading, setUser } = useAuthState();

  // Wrapping the imported functions to use our context state
  const handleLogin = async (email: string, password: string) => {
    return await login(email, password);
    // No need to manually update state here as onAuthStateChange in useAuthState will handle it
  };

  const handleLogout = async () => {
    await logout();
    // The auth state listener will handle setting user to null
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated");
    const updatedUser = await updateUserProfile(user, data);
    setUser(updatedUser);
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    await updatePassword(user?.email, currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register,
        logout: handleLogout,
        isAuthenticated: !!user && !!session,
        updateProfile: handleUpdateProfile,
        resetPassword,
        updatePassword: handleUpdatePassword,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
