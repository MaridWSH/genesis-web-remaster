import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // adjust path as needed
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = User | null;

export function useAuthState() {
  const [user, setUser] = useState<UserProfile>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
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
