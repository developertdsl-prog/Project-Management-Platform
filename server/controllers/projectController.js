const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const Team = require("../models/Team");
const User = require("../models/User");

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (admin, project_manager)
const createProject = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    projectManager,
    team,
    startDate,
    endDate,
    status,
    priority,
    members,
  } = req.body;

  // Verify project manager exists
  const pm = await User.findById(projectManager || req.user.id);
  if (!pm) {
    res.status(404);
    throw new Error("Project manager not found");
  }

  // Verify team exists if provided
  if (team) {
    const t = await Team.findById(team);
    if (!t) {
      res.status(404);
      throw new Error("Team not found");
    }
  }

  const projectMembers = members || [
    { user: req.user.id, role: "owner" },
    { user: projectManager || req.user.id, role: "manager" },
  ];

  const project = await Project.create({
    name,
    description,
    owner: req.user.id,
    projectManager: projectManager || req.user.id,
    team,
    members: projectMembers,
    startDate,
    endDate,
    status: status || "planning",
    priority: priority || "medium",
  });

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Get all projects (with filters)
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const { status, priority, projectManager, team, page = 1, limit = 20 } = req.query;

  const filter = { isActive: true };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (projectManager) filter.projectManager = projectManager;
  if (team) filter.team = team;

  // Non-admin users see only projects they're members of
  if (req.user.role !== "admin") {
    filter["members.user"] = req.user.id;
  }

  const projects = await Project.find(filter)
    .populate("projectManager", "name email role")
    .populate("team", "name")
    .populate("members.user", "name email role")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Project.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("projectManager", "name email role avatar")
    .populate("team", "name description")
    .populate("members.user", "name email role avatar");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Access check
  if (req.user.role !== "admin") {
    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user.id.toString()
    );
    if (!isMember) {
      res.status(403);
      throw new Error("Not authorized to access this project");
    }
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner, project manager, admin)
const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Authorization
  if (req.user.role !== "admin") {
    const isOwnerOrManager =
      project.owner.toString() === req.user.id ||
      project.projectManager.toString() === req.user.id;
    if (!isOwnerOrManager) {
      res.status(403);
      throw new Error("Not authorized to update this project");
    }
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("projectManager team members.user", "name email role");

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner, admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (req.user.role !== "admin" && project.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this project");
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (owner, project manager, admin)
const addProjectMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Authorization
  if (req.user.role !== "admin") {
    const isOwnerOrManager =
      project.owner.toString() === req.user.id ||
      project.projectManager.toString() === req.user.id;
    if (!isOwnerOrManager) {
      res.status(403);
      throw new Error("Not authorized to add members to this project");
    }
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already a member
  const alreadyMember = project.members.some(
    (m) => m.user.toString() === userId.toString()
  );
  if (alreadyMember) {
    res.status(400);
    throw new Error("User is already a member of this project");
  }

  project.members.push({
    user: userId,
    role: role || "member",
  });

  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (req.user.role !== "admin" && project.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to remove members");
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== req.params.userId.toString()
  );

  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};