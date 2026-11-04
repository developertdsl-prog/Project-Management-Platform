import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  PlusCircle,
  RefreshCw,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const STATUS_COLUMNS = [
  { key: "todo", label: "To Do", color: "bg-gray-100 text-gray-700" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
  { key: "review", label: "Review", color: "bg-yellow-100 text-yellow-700" },
  { key: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
];

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  [newTask] = useState({ title: "", description: "", priority: "medium" });
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  const isOverdue = (task) => {
    if (!task.deadline || task.status === "completed") return false;
    return new Date(task.deadline) < new Date();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", newTask);
      setShowAddModal(false);
      fetchTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  return (
    <div className="p-6 md:ml-64">
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-500 text-sm">Manage tasks across workflow stages</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTasks}
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </nav>

      <main className="mt-20">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading tasks...</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map((column) => (
              <div
                key={column.key}
                className="flex-1 min-w-[320px] bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${column.color}`}>
                      {column.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {tasksByStatus[column.key]?.length || 0} tasks
                    </p>
                  </div>
                </div>

                <div className="p-4 min-h-[400px]">
                  {tasksByStatus[column.key]?.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No tasks
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasksByStatus[column.key].map((task) => {
                        const overdue = isOverdue(task);
                        const assignee = task.assignee;
                        return (
                          <div
                            key={task._id}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group"
                            onClick={() => {
                              // Could open task detail modal
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {overdue && (
                                <AlertCircle size={14} className="text-red-500" />
                              )}
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                  PRIORITY_COLORS[task.priority] ||
                                  "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {task.priority.toUpperCase()}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                              {task.title}
                            </h4>
                            {task.deadline && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <Clock size={12} />
                                <span>{new Date(task.deadline).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {assignee ? (
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 overflow-hidden">
                                  {assignee.name?.charAt(0) || "?"}
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                  <User size={10} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {column.key === "completed" && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                    <span className="text-xs text-green-600 font-medium">
                      <CheckCircle size={14} /> Tasks completed
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  rows={3}
                  className="w-full pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="w-full pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;