const Project = require("../models/projectModel");
const User = require("../models/userModel");

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

    res.status(201).json({msg:"Project created",project});
  } catch (err) {
    res.status(400).json({ msg: "Failed to create project", error: err.message });
  }
};


exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔍 Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🚫 Prevent duplicate members
    const alreadyMember = project.members.find(
      m => m.user.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({ msg: "User already in project" });
    }

    // ➕ Add member
    project.members.push({
      user: userId,
      role: "member"
    });

    await project.save();

    res.status(200).json({
      msg: "Member added successfully",
      project
    });

  } catch (err) {
    res.status(400).json({
      msg: "Failed to add member",
      error: err.message
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔍 Check if user is part of project
    const member = project.members.find(
      m => m.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({ msg: "User not in project" });
    }

    // 🚫 Prevent removing last admin
    if (member.role === "admin") {
      const adminCount = project.members.filter(
        m => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res.status(400).json({
          msg: "Cannot remove the only admin"
        });
      }
    }

    // ❌ Remove member
    project.members = project.members.filter(
      m => m.user.toString() !== userId
    );

    await project.save();

    res.status(200).json({
      msg: "Member removed successfully",
      project
    });

  } catch (err) {
    res.status(400).json({
      msg: "Failed to remove member",
      error: err.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: { $elemMatch: { user: req.user.id } } });
    res.status(200).json({msg:"Projects fetched",projects});
  } catch (err) {
    res.status(500).json({ msg: "Failed to get projects", error: err.message });
  }
};