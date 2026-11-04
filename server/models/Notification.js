const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "task_assigned", "task_completed", "deadline_approaching", "project_update"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Task", "Project", "Team"],
    },
    url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);