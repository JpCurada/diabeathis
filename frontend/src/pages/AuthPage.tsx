import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SignupForm } from "@/components/auth/signup-form";

type AuthView = "login" | "signup" | "forgot-password";

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("login");

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {view === "login" && (
        <LoginForm
          onForgotPassword={() => setView("forgot-password")}
          onSignUp={() => setView("signup")}
        />
      )}

      {view === "signup" && <SignupForm onLogin={() => setView("login")} />}

      {view === "forgot-password" && (
        <ForgotPasswordForm onBack={() => setView("login")} />
      )}
    </main>
  );
}
