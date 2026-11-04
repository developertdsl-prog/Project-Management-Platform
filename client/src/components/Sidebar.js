import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Monitor,
  Briefcase,
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userRole = JSON.parse(localStorage.getItem("user") || "{}").role || "team_member";

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    {
      name: "Teams",
      icon: <Users size={20} />,
      path: "/teams",
      roles: ["admin", "project_manager", "team_member"],
    },
    {
      name: "Projects",
      icon: <Briefcase size={20} />,
      path: "/projects",
      roles: ["admin", "project_manager", "team_member"],
    },
    {
      name: "Kanban",
      icon: <Briefcase size={20} />,
      path: "/kanban",
      roles: ["admin", "project_manager", "team_member"],
    },
    {
      name: "Users",
      icon: <Monitor size={20} />,
      path: "/users",
      roles: ["admin", "project_manager"],
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      roles: ["admin"],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } z-50`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tighter">
            PMP<span className="text-blue-400">X</span>
          </span>
        )}
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const hasAccess =
            !item.roles || item.roles.includes(userRole);
          if (!hasAccess) return null;
          return (
            <div key={item.name} className="px-4">
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  !isCollapsed
                    ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.icon}
                {!isCollapsed && item.name}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;