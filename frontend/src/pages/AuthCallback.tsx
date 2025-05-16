import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams(location.hash.substring(1));
        const code = searchParams.get('code');
        
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          setError('No auth code found in redirect');
        }
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full h-12 bg-[#005dff] hover:bg-[#005dff]/90 text-white font-medium rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Redirect to home page on successful authentication
  return <Navigate to="/" />;
} 