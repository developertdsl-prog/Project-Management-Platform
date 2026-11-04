import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide.react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.data);
    } catch (err) {
      setError("Failed to load task");
      navigate("/kanban");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTask();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/tasks/${id}/comments`, { text: newComment });
      setNewComment("");
      fetchTask();
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    completed: "Completed",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const isOverdue = task?.deadline && task.status !== "completed" && new Date(task.deadline) < new Date();

  return (
    <div className="p-6 md:ml-64">
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/kanban")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <Clock size={18} /> Back to Board
          </button>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {task?.title || "Loading..."}
          </h1>
        </div>
      </nav>

      {loading && <div className="mt-20 text-center py-20">Loading task...</div>}

      {!loading && task && (
        <main className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Info */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[task.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {statusLabels[task.status] || task.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ml-2 ${priorityColors[task.priority] || "bg-blue-100 text-blue-700"}`}
                    >
                      {task.priority?.toUpperCase()}
                    </span>
                    {isOverdue && (
                      <span className="px-2 py-1 text-xs rounded-full font-medium ml-2 bg-red-100 text-red-700">
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange("todo")}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => handleStatusChange("in_progress")}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange("review")}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Completed
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-gray-600 mb-4">{task.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Project
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.project?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Assignee
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.assignee?.name || "Unassigned"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Reporter
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.reporter?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Deadline
                    </p>
                    <p className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Activity Feed
                </h3>
                <div className="space-y-4">
                  {task.activity?.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                        {index === 0 ? "+" : "•"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {activity.details || activity.action}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments & Details Sidebar */}
            <div className="lg:col-span-1">
              {/* Comments */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Comments
                </h3>
                <div className="space-y-4 mb-6">
                  {task.comments?.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-400">
                          {comment.user?.name || "Unknown"} •
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/kanban")}
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>Back to Kanban Board</span>
                    <Clock size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/projects")}
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>View Projects</span>
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default TaskDetail;