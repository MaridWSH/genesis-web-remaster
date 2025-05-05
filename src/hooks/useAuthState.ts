
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // correct path to supabase client
import { Session, User } from '@supabase/supabase-js';

// Extended User type with additional properties used in the app
export interface UserProfile extends User {
  name: string;
  memberSince: string;
  streakDays?: number;
  totalCompleted?: number;
  achievements?: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        // Fetch additional user data if needed
        // For now, we'll just cast the user to our extended type
        setSession(data.session);
        setUser(data.session.user as unknown as UserProfile);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user as unknown as UserProfile ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    setUser,
  };
}
