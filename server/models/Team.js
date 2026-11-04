const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a team name"],
      trim: true,
      maxlength: [50, "Team name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
      default: "",
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
teamSchema.index({ owner: 1 });
teamSchema.index({ "members.user": 1 });

module.exports = mongoose.model("Team", teamSchema);