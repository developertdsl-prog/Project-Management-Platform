import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Ban,
} from "lucide.react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/teams/users");
      setUsers(response.data.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/teams/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError("Failed to update role");
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await api.put(`/teams/users/${userId}/status`, { isActive });
      fetchUsers();
    } catch (err) {
      setError("Failed to update status");
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
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm">
            Manage platform users, roles, and permissions
          </p>
        </div>
      </nav>

      <main className="mt-20">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    Member Since
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                          {userItem.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userItem.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userItem._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {userItem.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${roleColors[userItem.role] || "bg-gray-100 text-gray-700"}`}>
                        {userItem.role?.replace("_", " ").toUpperCase() || "TEAM MEMBER"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {userItem.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {userItem.createdAt
                        ? new Date(userItem.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2">
                          <select
                            value={userItem.role}
                            onChange={(e) =>
                              handleRoleChange(userItem._id, e.target.value)
                            }
                            className="px-2 py-1 text-xs border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            <option value="team_member">Team Member</option>
                            <option value="project_manager">Project Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                userItem._id,
                                !userItem.isActive
                              )
                            }
                            className={`p-1.5 rounded-md ${
                              userItem.isActive
                                ? "text-red-500 hover:bg-red-50"
                                : "text-green-500 hover:bg-green-50"
                            }`}
                          >
                            {userItem.isActive ? (
                              <Ban size={18} />
                            ) : (
                              <ShieldCheck size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersPage;