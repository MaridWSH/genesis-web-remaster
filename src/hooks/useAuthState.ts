
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for an active session when the provider loads
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        
        // First set up the auth listener to catch any auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log("Auth state changed:", event, currentSession?.user?.email);
          
          // Update session state
          setSession(currentSession);
          
          if (event === "SIGNED_IN" && currentSession?.user) {
            // Use setTimeout to prevent potential deadlock
            setTimeout(() => {
              setUserData(currentSession.user);
            }, 0);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setSession(null);
          }
        });
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data?.session) {
          console.log("Found existing session for user:", data.session.user.email);
          setSession(data.session);
          await setUserData(data.session.user);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
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
      
      console.log("User data set:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error setting user data:", error);
    }
  };

  return { user, session, isLoading, setUser };
};
