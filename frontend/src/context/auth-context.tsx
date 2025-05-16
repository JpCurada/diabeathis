import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "@/supabase/config";

// Define types
interface User {
  id: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  onboarding_completed?: boolean;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingCompleted: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        setUser(null);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError.message);
      }

      const baseUser = {
        id: authData.user.id,
        email: authData.user.email!,
        ...userData,
      };

      setUser({
        ...baseUser,
        onboarding_completed: userData?.onboarding_completed ?? false,
      });
    } catch (error) {
      console.error("Error in loadUser:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          // loadUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await loadUser();
    },
    [loadUser]
  );

  const signup = useCallback(async (data: SignupData) => {
    const { email, password, ...meta } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const onboardingCompleted = useMemo(
    () => user?.onboarding_completed ?? false,
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      onboardingCompleted,
      login,
      signup,
      resetPassword,
      logout,
      refreshUser: loadUser,
    }),
    [
      user,
      isLoading,
      onboardingCompleted,
      login,
      signup,
      resetPassword,
      logout,
      loadUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
