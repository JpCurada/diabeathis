import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  LucideChevronRight,
  ChromeIcon as LucideGoogle,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({ onForgotPassword, onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#005dff]/10 mb-4">
          <div className="w-6 h-6 text-[#005dff]">
            <LucideChevronRight size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#000000]">Welcome Back</h1>
        <p className="text-[#747474] mt-1">
          Continue your journey to better health with your AI diabetes
          assistant.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#000000] font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#000000] font-medium">
              Password
            </Label>
            {/* <button
              type="button"
              className="text-sm text-[#005dff] hover:text-[#005dff]/80 font-medium"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button> */}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747474] hover:text-[#000000]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#005dff] hover:bg-[#005dff]/90 text-white font-medium rounded-lg"
        >
          Sign In
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#d1d1d1]"></div>
          <span className="flex-shrink mx-4 text-[#747474] text-sm">
            or continue with
          </span>
          <div className="flex-grow border-t border-[#d1d1d1]"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-[#d1d1d1] hover:bg-gray-50 text-[#000000] font-medium rounded-lg flex items-center justify-center gap-2"
        >
          <LucideGoogle size={18} />
          Sign in with Google
        </Button>
      </form>

      <div className="text-center mt-8">
        <p className="text-[#747474]">
          Don't have an account?{" "}
          <button
            className="text-[#005dff] font-medium hover:text-[#005dff]/80"
            onClick={onSignUp}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
