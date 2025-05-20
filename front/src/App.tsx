import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  RouterProvider, 
  createBrowserRouter, 
  UNSAFE_DataRouterContext,
  createRoutesFromElements,
  Route,
  Routes
} from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/clerk-react";

import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";  
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import CreateProject from "./pages/CreateProject";
import Requests from "./pages/Requests";
import Categories from "./pages/Categories";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SSOCallback from "./pages/SSOCallback";
import ProjectDetails from "./pages/ProjectDetails";
import UserProfile from "./pages/UserProfile";
import { createContext, useState, useContext } from "react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// React Query
const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Welcome />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/sso-callback" element={<SSOCallback />} />
      <Route path="/project/:projectId" element={<ProjectDetails />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    } as any
  }
);

const LoadingContext = createContext({ setLoading: (v: boolean) => {}, loading: false });
export const useLoading = () => useContext(LoadingContext);

function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
}

function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
      <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
    </div>
  );
}

const App = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      toast({ title: "Back Online", description: "Your connection has been restored.", variant: "default" });
    }
    function handleOffline() {
      setIsOnline(false);
      toast({ title: "No Internet Connection", description: "You are offline. Some features may not work.", variant: "destructive" });
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (!navigator.onLine) handleOffline();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <LoadingProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryClientProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
