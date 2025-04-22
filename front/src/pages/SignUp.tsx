import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp, useClerk } from "@clerk/clerk-react";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element>("");

  const handleSignOut = async () => {
    try {
      await signOut();
      setError("");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      // Create username from email (before @ symbol)
      const username = emailAddress.split('@')[0];
      
      const result = await signUp.create({
        emailAddress,
        password,
        username,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/home");
      } else {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        navigate("/verify");
      }
    } catch (err: any) {
      console.error("Error signing up:", err);
      if (err.message?.includes("single session mode")) {
        setError(
          <div>
            You're currently signed in to another account.{" "}
            <button
              onClick={handleSignOut}
              className="text-elevatify-600 hover:underline"
            >
              Sign out
            </button>{" "}
            first to continue.
          </div>
        );
      } else {
        setError(err.errors?.[0]?.message || "Error creating account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/sso-callback",
        redirectUrlComplete: "/home",
      });
    } catch (err: any) {
      console.error("Error with Google sign up:", err);
      if (err.message?.includes("single session mode")) {
        setError(
          <div>
            You're currently signed in to another account.{" "}
            <button
              onClick={handleSignOut}
              className="text-elevatify-600 hover:underline"
            >
              Sign out
            </button>{" "}
            first to continue.
          </div>
        );
      } else {
        setError("Could not connect to Google. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50 flex flex-col justify-center items-center px-4 py-12">
      <Link to="/" className="mb-8 flex items-center">
        <div className="w-10 h-10 rounded-full bg-elevatify-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="ml-2 text-2xl font-bold text-gray-900">Elevatify</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-1">Join Elevatify to start collaborating</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
              minLength={8}
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-elevatify-600 hover:bg-elevatify-700"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5" />
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-elevatify-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
