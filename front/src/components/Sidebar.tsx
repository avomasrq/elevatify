
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageSquare, 
  Settings, 
  Search, 
  UserPlus, 
  Mail, 
  Tag, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  name: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, name, to, isActive, isCollapsed, onClick }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center py-2.5 px-4 rounded-lg transition-all duration-300",
        isActive 
          ? "bg-elevatify-100 text-elevatify-700 font-medium" 
          : "text-gray-600 hover:bg-elevatify-50 hover:text-elevatify-600"
      )}
    >
      <div className="flex items-center">
        <span className="mr-3 text-xl">{icon}</span>
        {!isCollapsed && <span>{name}</span>}
      </div>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    {
      name: "Home",
      icon: <Home size={20} />,
      to: "/home",
    },
    {
      name: "Requests",
      icon: <UserPlus size={20} />,
      to: "/requests",
    },
    {
      name: "Invitations",
      icon: <Mail size={20} />,
      to: "/invitations",
    },
    {
      name: "Categories",
      icon: <Tag size={20} />,
      to: "/categories",
    },
    {
      name: "Messages",
      icon: <MessageSquare size={20} />,
      to: "/messages",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      to: "/settings",
    },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-100 transition-all duration-300 sticky top-0 left-0 z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-center">
        {/* Empty space with the same height as Navbar */}
      </div>

      {/* Toggle collapse button */}
      <div className="absolute right-[-12px] top-20 flex items-center justify-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-elevatify-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        {!collapsed ? (
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full"
            />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <Search size={20} className="text-gray-500" />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-1 px-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            name={item.name}
            to={item.to}
            isActive={location.pathname === item.to}
            isCollapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}
