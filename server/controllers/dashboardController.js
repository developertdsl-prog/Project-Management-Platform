const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  // Non-admin users see only their projects/tasks
  if (req.user.role !== "admin") {
    const userProjects = await Project.find({
      "members.user": req.user.id,
    }).select("_id");
    const projectIds = userProjects.map((p) => p._id);
    filter.$or = [
      { project: { $in: projectIds } },
      { assignee: req.user.id },
      { reporter: req.user.id },
    ];
  }

  const totalProjects = req.user.role === "admin"
    ? await Project.countDocuments({ isActive: true })
    : await Project.countDocuments({ "members.user": req.user.id, isActive: true });

  const totalTasks = await Task.countDocuments(filter);
  const overdueTasks = await Task.countDocuments({
    ...filter,
    deadline: { $lt: new Date() },
    status: { $ne: "completed" },
  });

  const completedTasks = await Task.countDocuments({
    ...filter,
    status: "completed",
  });

  const totalUsers = req.user.role === "admin"
    ? await User.countDocuments({ isActive: true })
    : null;

  const stats = {
    total_projects: totalProjects,
    total_tasks: totalTasks,
    overdue_tasks: overdueTasks,
    completed_tasks: completedTasks,
    completion_rate:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    ...(totalUsers !== null && { total_users: totalUsers }),
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getDashboardStats,
};