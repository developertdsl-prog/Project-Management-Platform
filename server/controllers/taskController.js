const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    project,
    assignee,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { isActive: true };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;
  if (assignee) filter.assignee = assignee;

  // Non-admin users see only tasks on projects they're members of or tasks assigned to them
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

  const tasks = await Task.find(filter)
    .populate("project", "name status")
    .populate("assignee", "name email role avatar")
    .populate("reporter", "name email role")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("project", "name status")
    .populate("assignee", "name email role avatar")
    .populate("reporter", "name email role");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Access check - user must be on the project or assigned/reporter
  if (req.user.role !== "admin") {
    const project = await Project.findById(task.project._id);
    const isMember =
      project &&
      project.members.some(
        (m) => m.user.toString() === req.user.id.toString()
      );
    const isAssigned = task.assignee && task.assignee._id.toString() === req.user.id.toString();
    const isReported = task.reporter._id.toString() === req.user.id.toString();

    if (!isMember && !isAssigned && !isReported) {
      res.status(403);
      throw new Error("Not authorized to access this task");
    }
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    project,
    assignee,
    status,
    priority,
    deadline,
    estimatedHours,
  } = req.body;

  // Verify project exists
  const proj = await Project.findById(project);
  if (!proj) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Access check
  if (req.user.role !== "admin") {
    const isMember = proj.members.some(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!isMember) {
      res.status(403);
      throw new Error("Not authorized to create tasks on this project");
    }
  }

  // Verify assignee exists if provided
  if (assignee) {
    const user = await User.findById(assignee);
    if (!user) {
      res.status(404);
      throw new Error("Assignee not found");
    }
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignee,
    reporter: req.user.id,
    status: status || "todo",
    priority: priority || "medium",
    deadline,
    estimatedHours,
    activity: [
      {
        action: "created",
        user: req.user.id,
        details: `Task created with status: ${status || "todo"}`,
      },
    ],
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Access check
  if (req.user.role !== "admin") {
    const project = await Project.findById(task.project);
    const isMember =
      project &&
      project.members.some(
        (m) => m.user.toString() === req.user.id.toString()
      );
    const isAssigned = task.assignee && task.assignee.toString() === req.user.id.toString();
    const isReported = task.reporter.toString() === req.user.id.toString();

    if (!isMember && !isAssigned && !isReported) {
      res.status(403);
      throw new Error("Not authorized to update this task");
    }
  }

  const oldStatus = task.status;

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("project assignee reporter", "name email role");

  // Log status change activity
  if (req.body.status && req.body.status !== oldStatus) {
    task.activity.push({
      action: "status_changed",
      user: req.user.id,
      details: `Status changed from ${oldStatus} to ${req.body.status}`,
    });
    await task.save();
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    req.user.role !== "admin" &&
    task.reporter.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this task");
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.comments.push({
    user: req.user.id,
    text,
  });

  task.activity.push({
    action: "comment_added",
    user: req.user.id,
    details: "Added a comment",
  });

  await task.save();

  const comment = task.comments[task.comments.length - 1];
  const user = await User.findById(req.user.id).select("name email avatar");

  res.status(201).json({
    success: true,
    data: { ...comment.toObject(), user },
  });
});

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

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

  const total = await Task.countDocuments(filter);
  const byStatus = await Task.aggregate([
    { $match: filter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const byPriority = await Task.aggregate([
    { $match: filter },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);
  const overdue = await Task.countDocuments({
    ...filter,
    deadline: { $lt: new Date() },
    status: { $ne: "completed" },
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      overdue,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    },
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats,
};