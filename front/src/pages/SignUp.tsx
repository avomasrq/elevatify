import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp, useClerk, useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useLoading } from "../App";
import { Logo } from "@/components/Logo";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element>("");
  
  const { setLoading: setGlobalLoading } = useLoading();
  const firstNameInputRef = useRef(null);

  useEffect(() => { if (firstNameInputRef.current) firstNameInputRef.current.focus(); }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setError("");
      navigate("/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!emailAddress.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Weak Password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setGlobalLoading(true);
    setError("");
    try {
      const username = emailAddress.split('@')[0];
      const result = await signUp.create({ emailAddress, password, username });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast({ title: "Sign up successful!", description: "Welcome to Elevatify!", variant: "default" });
        navigate("/home");
        return;
      } else {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        navigate("/verify");
      }
    } catch (err: any) {
      toast({ title: "Sign up error", description: err.errors?.[0]?.message || "Error creating account", variant: "destructive" });
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
      setGlobalLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center mb-3">
            <Logo className="w-12 h-12 mr-2" />
            <span className="ml-2 text-3xl font-extrabold text-gray-900 tracking-tight">Elevatify</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join Elevatify to start collaborating</p>
        </div>
        <div className="border-t border-gray-100 mb-6"></div>
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
                ref={firstNameInputRef}
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

          {/* Clerk Captcha rendered here */}
          <div id="clerk-captcha" className="flex justify-center mb-2" />

          <div className="flex flex-col gap-2 md:flex-row md:gap-4 mb-2 justify-center items-center">
            <Button
              type="submit"
              className="w-full md:w-1/2 bg-elevatify-600 hover:bg-elevatify-700"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

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
