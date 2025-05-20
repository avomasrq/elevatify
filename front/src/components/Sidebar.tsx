import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, FolderKanban, UserPlus, MessageSquare, Lock } from "lucide-react";
import { Logo } from "./Logo";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export function Sidebar() {
  const location = useLocation();
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // Wait for Clerk to finish loading user state
    setIsReady(true);
  }, [user]);
  const isActive = (path: string) => location.pathname === path;

  if (!isReady) return null;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-semibold text-gray-900">Elevatify</span>
        </Link>
      </div>
      <nav className="mt-6 px-3">
        <Link to="/home" className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
          isActive("/home") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}>
          <Home className="h-5 w-5 mr-3" />
          Home
        </Link>
        {user ? (
          <>
            <Link to="/my-projects" className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 transition-colors",
              isActive("/my-projects") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}>
              <FolderKanban className="h-5 w-5 mr-3" />
              My Projects
            </Link>
            <Link to="/projects" className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 transition-colors",
              isActive("/projects") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}>
              <FolderKanban className="h-5 w-5 mr-3" />
              All Projects
            </Link>
            <Link to="/requests" className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 transition-colors",
              isActive("/requests") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}>
              <UserPlus className="h-5 w-5 mr-3" />
              Requests
            </Link>
            <Link to="/messages" className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 transition-colors",
              isActive("/messages") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}>
              <MessageSquare className="h-5 w-5 mr-3" />
              Messages
            </Link>
          </>
        ) : (
          <>
            <span className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 text-gray-300 cursor-not-allowed">
              <Lock className="h-5 w-5 mr-3" /> My Projects
            </span>
            <span className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 text-gray-300 cursor-not-allowed">
              <Lock className="h-5 w-5 mr-3" /> All Projects
            </span>
            <span className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 text-gray-300 cursor-not-allowed">
              <Lock className="h-5 w-5 mr-3" /> Requests
            </span>
            <span className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mt-1 text-gray-300 cursor-not-allowed">
              <Lock className="h-5 w-5 mr-3" /> Messages
            </span>
          </>
        )}
      </nav>
    </div>
  );
}
