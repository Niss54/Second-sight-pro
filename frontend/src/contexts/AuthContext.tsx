import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  continueAsGuest: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if guest demo session is active
    const isGuest = localStorage.getItem("is-guest-demo") === "true";
    if (isGuest) {
      setUser({
        id: "demo-guest-id",
        app_metadata: {},
        user_metadata: { name: "Hackathon Judge" },
        aud: "authenticated",
        created_at: new Date().toISOString()
      } as User);
      setIsLoading(false);
      return;
    }

    // Initial fetch from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    localStorage.removeItem("is-guest-demo");
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  const continueAsGuest = () => {
    localStorage.setItem("is-guest-demo", "true");
    setUser({
      id: "demo-guest-id",
      app_metadata: {},
      user_metadata: { name: "Hackathon Judge" },
      aud: "authenticated",
      created_at: new Date().toISOString()
    } as User);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
