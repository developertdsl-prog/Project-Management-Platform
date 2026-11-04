const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user.id };
  if (unreadOnly === "true") {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    user: req.user.id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: notifications,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// @desc    Create notification (internal helper)
// @access  Private (admin/system)
const createNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type, relatedId, relatedModel, url } = req.body;

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type: type || "info",
    relatedId,
    relatedModel,
    url,
  });

  res.status(201).json({
    success: true,
    data: notification,
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  if (notification.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this notification");
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
};