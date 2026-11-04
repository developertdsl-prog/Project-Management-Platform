const express = require("express");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("admin", "project_manager"), createProject)
  .get(protect, getProjects);

router.route("/:id").get(protect, getProject).put(protect, updateProject).delete(protect, deleteProject);

router.route("/:id/members").post(protect, addProjectMember);
router.route("/:id/members/:userId").delete(protect, removeProjectMember);

module.exports = router;