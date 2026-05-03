const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  }
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [memberSchema],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);