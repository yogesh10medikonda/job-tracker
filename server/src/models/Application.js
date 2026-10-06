const mongoose = require("mongoose");

const STATUSES = ["wishlist", "applied", "oa", "interview", "offer", "rejected"];

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    salaryRange: { type: String, trim: true },
    status: { type: String, enum: STATUSES, default: "wishlist" },
    appliedDate: { type: Date },
    followUpDate: { type: Date },
    reminderSentAt: { type: Date, default: null },
    notes: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
    matchScore: { type: Number, default: null },
    missingSkills: { type: [String], default: [] },
    timeline: [
      {
        status: { type: String, enum: STATUSES },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
module.exports.STATUSES = STATUSES;