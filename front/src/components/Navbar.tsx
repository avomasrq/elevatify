import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Menu, X, Home, Search, Bell, MessageSquare, User } from "lucide-react";
import logo from "../assets/elevatify-logo.svg";

export function Navbar() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-8"
                src={logo}
                alt="Elevatify Logo"
              />
            </div>
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-elevatify-900">Elevatify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-elevatify-600 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-elevatify-600 px-3 py-2 rounded-md text-sm font-medium">
              Projects
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-elevatify-600 px-3 py-2 rounded-md text-sm font-medium">
              Categories
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Button 
                  onClick={() => navigate("/create-project")}
                  className="bg-elevatify-600 hover:bg-elevatify-700"
                >
                  Create
                </Button>
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/sign-in")}>
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/sign-up")}
                  className="bg-elevatify-600 hover:bg-elevatify-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/about"
              className="text-gray-700 hover:bg-elevatify-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 hover:bg-elevatify-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:bg-elevatify-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            {isSignedIn ? (
              <Button 
                onClick={() => {
                  navigate("/create-project");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-elevatify-600 hover:bg-elevatify-700"
              >
                Create
              </Button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/sign-in");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    navigate("/sign-up");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-elevatify-600 hover:bg-elevatify-700"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
