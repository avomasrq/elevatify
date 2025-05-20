import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";

import { useLoading } from "../App";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const { isLoaded, signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = useLoading();
  const emailInputRef = useRef(null);

  useEffect(() => { if (emailInputRef.current) emailInputRef.current.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    try {
      if (!isLoaded || !signIn) throw new Error("Clerk not loaded");
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        toast({ title: "Redirecting...", description: "Sign in successful!", variant: "default" });
        navigate("/home");
      } else if (result.status === "needs_first_factor" || result.status === "needs_second_factor") {
        // Handle multi-factor if needed
      }
    } catch (error: any) {
      toast({ title: "Sign in error", description: error.errors?.[0]?.message || "Invalid email or password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center mb-3">
            <Logo className="w-12 h-12 mr-2" />
            <span className="ml-2 text-3xl font-extrabold text-gray-900 tracking-tight">Elevatify</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-purple-600 hover:text-purple-500">
              Sign up
            </Link>
          </p>
        </div>
        <div className="border-t border-gray-100 mb-6"></div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
                ref={emailInputRef}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* GitHub and Sign In Buttons beneath password */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-4 mb-2 justify-center items-center">
            <Button
              type="submit"
              className="w-full md:w-1/2 bg-elevatify-600 hover:bg-elevatify-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
