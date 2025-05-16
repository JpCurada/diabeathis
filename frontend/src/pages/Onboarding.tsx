import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleComplete = async () => {
    setIsRedirecting(true);
    await refreshUser();
    navigate("/", { replace: true });
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <OnboardingForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
