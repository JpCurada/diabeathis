import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  History,
  MessageCircleMore,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MainLogo from "/images/main-logo.png";
import { useAuth } from "@/context/auth-context";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

export default function Navigation() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { users, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const navItems = [
    {
      to: "/chatbot",
      icon: <MessageCircleMore className="w-5 h-5" />,
      label: "Chat",
    },
    {
      to: "/track",
      icon: <Activity className="w-5 h-5" />,
      label: "Track",
    },
    {
      to: "/history",
      icon: <History className="w-5 h-5" />,
      label: "History",
    },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50">
        <div className="grid w-full grid-cols-4 h-16">
          {navItems.map((item) => (
            <NavButton
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
          <NavButton
            to="/profile"
            icon={<User className="w-5 h-5" />}
            label="Profile"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-16 flex flex-col items-center bg-white text-gray-800 border-r border-gray-200 py-4">
      {/* Logo Section */}
      <div className="mb-8 flex justify-center w-full">
        <img
          src={MainLogo}
          alt="Main Logo"
          className="w-10 h-auto object-contain"
        />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col items-center space-y-6 mb-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>

      {/* Avatar with Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              className="justify-start w-full"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink to={to} className="flex flex-col items-center group">
      {({ isActive }) => (
        <>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive ? "bg-gray-100" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <div className={`${isActive ? "text-blue-600" : "text-gray-800"}`}>
              {icon}
            </div>
          </div>
          <span
            className={`text-xs mt-1 ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function NavButton({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center ${
          isActive
            ? "text-blue-600 border-t-2 border-blue-600"
            : "text-gray-500"
        }`
      }
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
}
