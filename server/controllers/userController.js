const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin, project_manager)
const getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (admin, project_manager, or self)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Users can view their own profile; admins and PMs can view any
  if (
    req.user.role !== "admin" &&
    req.user.role !== "project_manager" &&
    req.user.id !== req.params.id
  ) {
    res.status(403);
    throw new Error("Not authorized to view this user");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["admin", "project_manager", "team_member"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Deactivate/activate user
// @route   PUT /api/users/:id/status
// @access  Private (admin only)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user.id === req.params.id) {
    res.status(400);
    throw new Error("Cannot delete your own account");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};