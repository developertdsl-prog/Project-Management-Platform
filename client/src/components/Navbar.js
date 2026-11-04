import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const authRoutes = ["/login", "/register"];

  if (authRoutes.includes(location.pathname)) return null;

  return (
    <nav className="fixed left-64 right-0 top-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-40">
      <div className="flex items-center gap-6">
        <input
          type="text"
          placeholder="Search projects, tasks..."
          className="pl-4 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
        />
        <Bell size={22} className="text-gray-600 cursor-pointer hover:text-blue-600" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || "team_member"}</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 cursor-pointer">
          <UserCircle size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;