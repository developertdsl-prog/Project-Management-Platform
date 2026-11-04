import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell,
  Mail,
  Search,
  Activity,
  PieChart,
  BarChart3,
} from "lucide.react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const STAT_CARDS = (role) => {
  const base = [
    {
      title: "Total Projects",
      value: "0",
      icon: <Briefcase size={24} />,
      color: "text-blue-600 bg-blue-50",
      path: "/projects",
    },
    {
      title: "Total Tasks",
      value: "0",
      icon: <CheckCircle size={24} />,
      color: "text-green-600 bg-green-50",
      path: "/kanban",
    },
    {
      title: "Overdue Tasks",
      value: "0",
      icon: <AlertCircle size={24} />,
      color: "text-red-600 bg-red-50",
      path: "/kanban",
    },
    {
      title: "Upcoming Deadlines",
      value: "0",
      icon: <Clock size={24} />,
      color: "text-yellow-600 bg-yellow-50",
      path: "/kanban",
    },
  ];

  if (role === "admin") {
    base.unshift({
      title: "Total Users",
      value: "0",
      icon: <Users size={24} />,
      color: "text-purple-600 bg-purple-50",
      path: "/users",
    });
    base.push({
      title: "Platform Activity",
      value: "0",
      icon: <Activity size={24} />,
      color: "text-indigo-600 bg-indigo-50",
      path: "/dashboard",
    });
  }

  return base;
};

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [taskStats, setTaskStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, taskRes, notifRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/tasks/stats"),
        api.get("/notifications?unreadOnly=true"),
      ]);

      setStats(statsRes.data.data || {});
      setTaskStats(taskRes.data.data || {});
      setNotifications(notifRes.data.data || []);
      setUnreadCount(notifRes.data.unreadCount || 0);
    } catch (err) {
      // Dashboard stats endpoint may not exist yet, use defaults
      console.log("Dashboard stats endpoint not available yet");
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.log("Failed to mark notification read");
    }
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    project_manager: "bg-blue-100 text-blue-700",
    team_member: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-6 md:ml-64">
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tasks, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-full ${roleColors[user?.role] || "bg-gray-100 text-gray-700"}`}>
              {user?.role?.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-500 hover:text-blue-600 relative"
          >
            <Bell size={22} className={unreadCount > 0 ? "text-red-500" : "text-gray-600"} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
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
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || "User"}. Here's your platform overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STAT_CARDS(user?.role).map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats[stat.title.toLowerCase().replace(/\s+/g, "_")] || stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Task Completion</h3>
            <div className="space-y-4">
              {[["todo", "To Do"], ["in_progress", "In Progress"], ["review", "Review"], ["completed", "Completed"]].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {taskStats.byStatus?.[key] || 0}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="text-gray-900 font-medium">{taskStats.total || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-red-600 font-medium">Overdue</span>
                  <span className="text-gray-900 font-medium">{taskStats.overdue || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Priority */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Task Priority</h3>
            <div className="space-y-4">
              {[["urgent", "Urgent"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {taskStats.byPriority?.[key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No unread notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif._id}
                    className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => markNotificationRead(notif._id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.type === "error" || notif.type === "warning" ? "bg-red-100 text-red-500" : notif.type === "success" ? "bg-green-100 text-green-500" : "bg-blue-100 text-blue-500"}`}>
                      <Bell size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                ))}
                {notifications.length > 5 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    +{notifications.length - 5} more notifications
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity / Reports */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Platform Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Reports
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Project
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { action: "Created project", user: "John Doe", project: "Website Redesign", time: "2 hours ago" },
                  { action: "Assigned task", user: "Sarah Wilson", project: "Mobile App", time: "5 hours ago" },
                  { action: "Task completed", user: "Mike Chen", project: "Q4 Campaign", time: "1 day ago" },
                  { action: "New team member", user: "Admin", project: "Internal Tools", time: "2 days ago" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{item.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{item.project}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {item.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;