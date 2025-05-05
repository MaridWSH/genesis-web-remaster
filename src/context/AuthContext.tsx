
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for an active session when the provider loads
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data?.session) {
          await setUserData(data.session.user);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await setUserData(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Helper function to fetch user profile data and set the user state
  const setUserData = async (authUser: User) => {
    try {
      // Check if user exists in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", profileError);
        return;
      }
      
      let userData: UserProfile;
      
      if (profileData) {
        // User profile exists, use it
        userData = {
          id: authUser.id,
          name: profileData.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          memberSince: profileData.member_since || new Date().toISOString()
        };
      } else {
        // Create new profile
        const newProfile = {
          id: authUser.id,
          name: authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          member_since: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return;
        }
        
        userData = {
          id: authUser.id,
          name: newProfile.name,
          email: newProfile.email,
          memberSince: newProfile.member_since
        };
      }
      
      setUser(userData);
    } catch (error) {
      console.error("Error setting user data:", error);
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      
      // User data will be set by the auth state listener
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw new Error(error.message);
      
      toast.success("Registration successful. Please verify your email.");
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };
  
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const updates = {
        id: user.id,
        ...data
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email
        })
        .eq('id', user.id);
        
      if (error) throw new Error(error.message);
      
      // Update local user state
      setUser({
        ...user,
        ...data
      });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(`Profile update failed: ${error.message}`);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password'
      });
      
      if (error) throw new Error(error.message);
      
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(`Password reset failed: ${error.message}`);
      throw error;
    }
  };
  
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user?.email) throw new Error("User email not available");
      
      // First verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (verifyError) throw new Error("Current password is incorrect");
      
      // Then update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw new Error(error.message);
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(`Password update failed: ${error.message}`);
      throw error;
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
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
