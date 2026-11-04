const express = require("express");
const {
  createTeam,
  getTeams,
  getTeam,
  addTeamMember,
  removeTeamMember,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");
const {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Team routes
router.route("/").post(protect, createTeam).get(protect, getTeams);
router
  .route("/:id")
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);
router.route("/:id/members").post(protect, addTeamMember);
router.route("/:id/members/:userId").delete(protect, removeTeamMember);

// User management routes
router
  .route("/users")
  .get(protect, authorize("admin", "project_manager"), getUsers);
router.route("/users/:id").get(protect, getUser);
router.route("/users/:id/role").put(protect, authorize("admin"), updateUserRole);
router.route("/users/:id/status").put(protect, authorize("admin"), updateUserStatus);
router.route("/users/:id").delete(protect, authorize("admin"), deleteUser);

module.exports = router;