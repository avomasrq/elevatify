import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      try {
        await handleRedirectCallback();
        navigate("/onboarding");
      } catch (err) {
        console.error("Error handling SSO callback:", err);
        navigate("/sign-in");
      }
    };
    
    handle();
  }, [handleRedirectCallback, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
} 