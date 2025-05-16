import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <EditProfileForm
          user={user}
          onComplete={() => {
            setIsRedirecting(true);
            navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
