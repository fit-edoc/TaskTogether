const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create task", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: "Failed to update task", error: err.message });
  }
};