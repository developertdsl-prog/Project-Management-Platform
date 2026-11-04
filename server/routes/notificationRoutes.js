const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotifications).post(protect, createNotification);
router.route("/:id/read").put(protect, markAsRead);
router.route("/read-all").put(protect, markAllAsRead);
router.route("/:id").delete(protect, deleteNotification);

module.exports = router;