
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/hooks/useAuthState";

export const login = async (email: string, password: string) => {
  try {
    console.log("Login attempt for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw new Error(error.message);
    
    toast.success("Logged in successfully");
    console.log("Login successful, session:", data.session);
    
    // Return the data so that calling code can use it if needed
    return data;
  } catch (error: any) {
    console.error("Login error:", error.message);
    toast.error(`Login failed: ${error.message}`);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string) => {
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

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    toast.success("Logged out successfully");
  } catch (error: any) {
    toast.error(`Logout failed: ${error.message}`);
    throw error;
  }
};

export const updateProfile = async (user: UserProfile, data: Partial<UserProfile>) => {
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
    
    toast.success("Profile updated successfully");
    
    return {
      ...user,
      ...data
    } as UserProfile;
  } catch (error: any) {
    toast.error(`Profile update failed: ${error.message}`);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
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

export const updatePassword = async (email: string | undefined, currentPassword: string, newPassword: string) => {
  try {
    if (!email) throw new Error("User email not available");
    
    // First verify the current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: email,
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
