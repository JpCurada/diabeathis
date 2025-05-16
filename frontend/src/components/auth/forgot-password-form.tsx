import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      // In a real app, this would call an API to send a password reset email
      // For demo purposes, we'll just simulate success
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send password reset email");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <button
        onClick={onBack}
        className="flex items-center text-[#747474] hover:text-[#000000] mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to login
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#005dff]/10 mb-4">
          <div className="w-6 h-6 text-[#005dff]">
            <ArrowLeft size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#000000]">Reset Password</h1>
        <p className="text-[#747474] mt-1">
          We'll send you instructions to reset your password
        </p>
      </div>

      {!isSubmitted ? (
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

          <Button
            type="submit"
            className="w-full h-12 bg-[#005dff] hover:bg-[#005dff]/90 text-white font-medium rounded-lg"
          >
            Send Reset Instructions
          </Button>
        </form>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <p className="text-green-700 mb-4">Password reset email sent!</p>
          <p className="text-[#747474] mb-6">
            Check your email for instructions to reset your password.
          </p>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-[#d1d1d1] hover:bg-gray-50 text-[#000000]"
          >
            Return to Login
          </Button>
        </div>
      )}
    </div>
  );
}
