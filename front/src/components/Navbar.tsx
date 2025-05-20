import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Lock } from "lucide-react";

export function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsOpen(false), 120);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                About Us
              </Link>
              {user ? (
                <>
                  <Link
                    to="/projects"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/categories"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Categories
                  </Link>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 cursor-not-allowed">
                    <Lock className="w-4 h-4 mr-1" /> Projects
                  </span>
                  <span className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 cursor-not-allowed">
                    <Lock className="w-4 h-4 mr-1" /> Categories
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/create-project">
              <Button variant="default" className="bg-[#7c3aed] hover:bg-[#6d28d9]">
                Create
              </Button>
            </Link>
            {user && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative inline-block"
              >
                <button className="outline-none ml-2">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || user.primaryEmailAddress?.emailAddress} />
                    <AvatarFallback>{(user.fullName || user.username || user.primaryEmailAddress?.emailAddress || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName || user.username || user.primaryEmailAddress?.emailAddress}</p>
                        <p className="text-xs leading-none text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/settings")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Manage account
                    </button>
                    <div className="border-t my-1" />
                    <button
                      onClick={() => signOut({ signOutAll: true })}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
