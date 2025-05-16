import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/navigation";
import ChatPage from "@/pages/Chatbot";
import TrackPage from "@/pages/Track";
import HistoryPage from "@/pages/History";
import ProfilePage from "@/pages/Profile";
import EditPage from "@/pages/Edit";
import EmergencyContact from "@/pages/EmergencyContact";
import AuthPage from "@/pages/AuthPage";
import { AuthProvider, useAuth } from "@/context/auth-context"; // Ensure this is imported correctly
import OnboardingPage from "@/pages/Onboarding";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/loading-spinner";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <NavigationWrapper />
    </AuthProvider>
  );
}

export function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      {/* AuthPage route is open only if not authenticated */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/chatbot" replace />} />
        <Route path="/chatbot" element={<ChatPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditPage />} />
        <Route
          path="/profile/emergency-contacts"
          element={<EmergencyContact />}
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      <Route path="*" element={<ProtectedRoute />} />
    </Routes>
  );
}

export function NavigationWrapper() {
  const { isAuthenticated, onboardingCompleted } = useAuth();

  if (isAuthenticated && onboardingCompleted) {
    return <Navigation />;
  }

  return null;
}
