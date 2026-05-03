const Project = require("../models/projectModel");

exports.checkRole = (role) => {
  return async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    const member = project.members.find(
      m => m.user.toString() === req.user.id
    );

    if (!member) return res.status(403).json({ msg: "Not a member" });

    if (role === "admin" && member.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }

    next();
  };
};