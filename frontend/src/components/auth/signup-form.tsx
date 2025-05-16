import type React from "react";
import { toast } from "sonner";
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
  AlertCircleIcon,
} from "lucide-react";

interface SignupFormProps {
  onLogin: () => void;
}

export function SignupForm({ onLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Reset field errors
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Please confirm your password";

    // Validate password match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);

    // If there are errors, don't proceed
    if (Object.keys(errors).length > 0) {
      setError("Please fix the errors below");
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Check your email", {
        description:
          "A confirmation email has been sent. Please verify your email to continue.",
      });

      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Signup failed", {
        description:
          "There was an issue creating your account. Please try again.",
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-[#000000]">Create Account</h1>
        <p className="text-[#747474] mt-1">
          Start your journey to smarter diabetes care with our AI-powered
          platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[#000000] font-medium">
              First Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 ${
                fieldErrors.firstName ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName" className="text-[#000000] font-medium">
              Middle Name
            </Label>
            <Input
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[#000000] font-medium">
              Last Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 ${
                fieldErrors.lastName ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="suffix" className="text-[#000000] font-medium">
              Suffix
            </Label>
            <Input
              id="suffix"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#000000] font-medium">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 ${
              fieldErrors.email ? "border-red-500" : ""
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#000000] font-medium">
            Password<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 pr-10 ${
                fieldErrors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747474] hover:text-[#000000]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
            {fieldErrors.password && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
                <AlertCircleIcon size={20} />
              </div>
            )}
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-[#000000] font-medium"
          >
            Confirm Password<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20 pr-10 ${
                fieldErrors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747474] hover:text-[#000000]"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
            {fieldErrors.confirmPassword && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
                <AlertCircleIcon size={20} />
              </div>
            )}
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#005dff] hover:bg-[#005dff]/90 text-white font-medium rounded-lg"
        >
          {loading ? "Creating..." : "Create Account"}
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
          Sign up with Google
        </Button>
      </form>

      <div className="text-center mt-8">
        <p className="text-[#747474]">
          Already have an account?{" "}
          <button
            className="text-[#005dff] font-medium hover:text-[#005dff]/80"
            onClick={onLogin}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
