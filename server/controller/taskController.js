const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({msg:"Task created",task});
  } catch (err) {
    res.status(400).json({ msg: "Failed to create task", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔐 Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed to update this task" });
    }

    // ✅ Update only status
    task.status = req.body.status;

    await task.save();

    res.status(200).json({msg:"Task updated",task});
  } catch (err) {
    res.status(400).json({
      msg: "Failed to update task",
      error: err.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    await task.remove();

    res.status(200).json({msg:"Task removed"});
  } catch (err) {
    res.status(400).json({ msg: "Failed to delete task", error: err.message });
  }
};



exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ msg: "Project ID required" });
    }

    // 🔍 Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔐 Check membership
    const member = project.members.find(
      m => m.user.toString() === req.user.id
    );

    if (!member) {
      return res.status(403).json({ msg: "Not a project member" });
    }

    let tasks;

    // 👑 Admin → all tasks
    if (member.role === "admin") {
      tasks = await Task.find({ projectId });
    } 
    // 👤 Member → only assigned tasks
    else {
      tasks = await Task.find({
        projectId,
        assignedTo: req.user.id
      });
    }

    res.status(200).json({msg:"Tasks fetched",tasks});

  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch tasks",
      error: err.message
    });
  }
};