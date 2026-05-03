const Project = require("../models/projectModel");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
      members: [
        { user: req.user.id, role: "admin" }
      ]
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create project", error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    project.members.push({ user: userId, role: "member" });
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Failed to add member", error: err.message });
  }
};