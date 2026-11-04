const asyncHandler = require("express-async-handler");
const Team = require("../models/Team");
const User = require("../models/User");

// @desc    Create a team
// @route   POST /api/teams
// @access  Private
const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const team = await Team.create({
    name,
    description,
    owner: req.user.id,
    members: [
      {
        user: req.user.id,
        role: "owner",
      },
    ],
  });

  res.status(201).json({
    success: true,
    data: team,
  });
});

// @desc    Get all teams (with membership filter)
// @route   GET /api/teams
// @access  Private
const getTeams = asyncHandler(async (req, res) => {
  let query;

  if (req.user.role === "admin") {
    query = Team.find().populate("owner members.user", "name email role");
  } else {
    query = Team.find({
      "members.user": req.user.id,
      isActive: true,
    }).populate("owner members.user", "name email role");
  }

  const teams = await query;

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams,
  });
});

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).populate(
    "owner members.user",
    "name email role avatar"
  );

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  // Check membership unless admin
  if (req.user.role !== "admin") {
    const isMember = team.members.some(
      (m) => m.user._id.toString() === req.user.id.toString()
    );
    if (!isMember) {
      res.status(403);
      throw new Error("Not authorized to access this team");
    }
  }

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private (owner/team admin or platform admin)
const addTeamMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  // Authorization check
  if (req.user.role !== "admin") {
    const membership = team.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!membership || !["owner", "admin"].includes(membership.role)) {
      res.status(403);
      throw new Error("Not authorized to add members to this team");
    }
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already a member
  const alreadyMember = team.members.some(
    (m) => m.user.toString() === userId.toString()
  );
  if (alreadyMember) {
    res.status(400);
    throw new Error("User is already a member of this team");
  }

  team.members.push({
    user: userId,
    role: role || "member",
  });

  await team.save();

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
const removeTeamMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  // Authorization check
  if (req.user.role !== "admin") {
    const membership = team.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!membership || membership.role !== "owner") {
      res.status(403);
      throw new Error("Only team owner can remove members");
    }
  }

  team.members = team.members.filter(
    (m) => m.user.toString() !== req.params.userId.toString()
  );

  await team.save();

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = asyncHandler(async (req, res) => {
  let team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  // Authorization
  if (req.user.role !== "admin" && team.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this team");
  }

  team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("owner members.user", "name email role");

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  if (req.user.role !== "admin" && team.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this team");
  }

  await team.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  addTeamMember,
  removeTeamMember,
  updateTeam,
  deleteTeam,
};