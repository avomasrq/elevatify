import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";

export default function Verify() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded || !signUp) {
    navigate("/sign-up");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/onboarding");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      
      if (error.status === 429) {
        toast({
          title: "Too many attempts",
          description: "Please wait a few minutes before trying again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.errors?.[0]?.message || "Failed to verify code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResendCode = async () => {
    try {
      if (!signUp) return;
      
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the new code",
      });
    } catch (error: any) {
      console.error("Error resending code:", error);
      
      if (error.status === 429) {
        toast({
          title: "Too many attempts",
          description: "Please wait a few minutes before requesting a new code",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mr-2" />
          <span className="ml-2 text-3xl font-extrabold text-gray-900 tracking-tight">Elevatify</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Verify your email</h1>
          <p className="text-gray-500 mt-1">We've sent a verification code to your email</p>
        </div>
        <div className="border-t border-gray-100 mb-6"></div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-elevatify-600 hover:bg-elevatify-700"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-elevatify-600 hover:underline"
          >
            Didn't receive a code? Click to resend
          </button>
        </div>
      </div>
    </div>
  );
}