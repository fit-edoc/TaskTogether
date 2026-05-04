const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

exports.getDashboard = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ msg: "Project ID required" });
    }

    // 🔐 Check if user is part of project
    const project = await Project.findById(projectId);

    const member = project.members.find(
      m => m.user.toString() === req.user.id
    );

    if (!member) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // 👑 Admin sees all, member sees only assigned tasks
    const filter =
      member.role === "admin"
        ? { projectId }
        : { projectId, assignedTo: req.user.id };

    // 📊 1. Total tasks
    const totalTasks = await Task.countDocuments(filter);

    // 📊 2. Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 📊 3. Tasks per user
    const tasksPerUser = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      }
    ]);

    // 📊 4. Overdue tasks
    const overdueTasks = await Task.find({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({
      totalTasks,
      tasksByStatus,
      tasksPerUser,
      overdueTasks
    });

  } catch (err) {
    res.status(500).json({
      msg: "Dashboard error",
      error: err.message
    });
  }
};