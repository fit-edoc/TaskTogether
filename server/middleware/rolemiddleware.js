const Project = require("../models/projectModel");

exports.checkGlobalAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Access denied. Only admins can create projects." });
  }
};


exports.checkRole = (role) => {
  return async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    const member = project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!member) return res.status(403).json({ msg: "Not a member" });

    if (role === "admin" && member.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }

    next();
  };
};