import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: "Total Projects", value: "12", icon: <LayoutDashboard size={28} />, color: "text-blue-600 bg-blue-100" },
    { title: "Active Tasks", value: "24", icon: <CheckCircle size={28} />, color: "text-green-600 bg-green-100" },
    { title: "Pending Reviews", value: "6", icon: <Clock size={28} />, color: "text-yellow-600 bg-yellow-100" },
    { title: "Overdue", value: "3", icon: <AlertCircle size={28} />, color: "text-red-600 bg-red-100" },
  ];

  const roleDescriptions = {
    admin: "Full access to all projects, users, and platform settings.",
    project_manager: "Create and manage projects, assign team members, and track progress.",
    team_member: "View assigned projects and tasks, update status, and collaborate.",
  };

  return (
    <div className="p-6 md:ml-64">
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
            />
          </div>
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
        </div>
      </nav>

      <main className="mt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"}!
          </h2>
          <p className="text-gray-600 mt-1">
            {roleDescriptions[user?.role] || "Manage your projects and tasks."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
              <Users size={20} /> Create Project
            </button>
            <button className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors">
              <CheckCircle size={20} /> My Tasks
            </button>
            <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <LayoutDashboard size={20} /> View Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;