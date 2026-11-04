const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, createTask);
router.route("/stats").get(protect, getTaskStats);
router.route("/:id").get(protect, getTask).put(protect, updateTask).delete(protect, deleteTask);
router.route("/:id/comments").post(protect, addComment);

module.exports = router;