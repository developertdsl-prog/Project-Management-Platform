import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Trash2,
  Edit,
  Mail,
  ShieldCheck,
  Clock,
} from "lucide.react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ userId: "", role: "member" });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data.data);
    } catch (err) {
      setError("Failed to load team");
      navigate("/teams");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = team?.owner?._id === user?._id || team?.owner === user?._id;
  const isAdmin = user?.role === "admin";
  const canManage = isOwner || isAdmin;

  const userMembership = team?.members?.find(
    (m) => m.user?._id === user?._id || m.user === user?._id
  );

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/teams/${id}/members`, newMember);
      setShowAddMember(false);
      setNewMember({ userId: "", role: "member" });
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the team?")) return;
    try {
      await api.delete(`/teams/${id}/members/${userId}`);
      fetchTeam();
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const roleOptions = canManage
    ? [
        { value: "owner", label: "Owner" },
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
      ]
    : [{ value: "member", label: "Member" }];

  return (
    <div className="p-6 md:ml-64">
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        <div>
          <Link
            to="/teams"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <Clock size={18} /> Back to Teams
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{team?.name || "Loading..."}</h1>
        </div>
      </nav>

      {loading && <div className="mt-20 text-center py-20">Loading team...</div>}

      {!loading && team && (
        <main className="mt-20">
          {/* Team Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
                <p className="text-gray-500 text-sm">
                  Created by {team.owner?.name || "Unknown"} •
                  {team.members?.length} members
                </p>
              </div>
            </div>
            {team.description && (
              <p className="text-gray-600">{team.description}</p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          {/* Members Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                <p className="text-gray-500 text-sm">
                  {team.members?.length} member(s)
                </p>
              </div>
              {canManage && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <UserPlus size={18} /> Add Member
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => (
                    <tr key={member.user._id || member.user} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                            {(member.user?.name || member.user || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.user?.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          member.role === "owner"
                            ? "bg-purple-100 text-purple-700"
                            : member.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {member.user?._id !== user?._id && member.user !== user?._id && canManage && (
                          <button
                            onClick={() => handleRemoveMember(member.user._id || member.user)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Information</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Team ID:</span>
                <span className="text-sm text-gray-900">{team._id}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Owner:</span>
                <span className="text-sm text-gray-900">
                  {team.owner?.name || "Unknown"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Status:</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID or Email
                </label>
                <input
                  type="text"
                  name="userId"
                  required
                  value={newMember.userId}
                  onChange={(e) =>
                    setNewMember({ ...newMember, userId: e.target.value })
                  }
                  className="w-full pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter user ID or email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className="w-full pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;