const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    
    // If member, they can see all tasks in their assigned projects
    if (req.user.role !== 'Admin') {
      const userProjects = await Project.find({ members: req.user.id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      
      if (req.query.project) {
        if (!projectIds.some(id => id.toString() === req.query.project)) {
          return res.status(403).json({ message: 'Not authorized for this project tasks' });
        }
      } else {
        filter.project = { $in: projectIds };
      }
    }

    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .populate('assignedTo', 'username email');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignedTo', 'username email');
      
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Check access
    if (req.user.role !== 'Admin') {
      const project = await Project.findById(task.project._id);
      if (!project.members.some(m => m.toString() === req.user.id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
    
    const projectExists = await Project.findById(project);
    if (!projectExists) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'Admin') {
      if (!projectExists.members.some(m => m.toString() === req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      project,
      assignedTo,
      createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title')
      .populate('assignedTo', 'username email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin') {
      // Members can only update status of their ASSIGNED tasks
      if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Can only update tasks assigned to you' });
      }
      // Or they can only update status if it's assigned to them
      task.status = status || task.status;
    } else {
      // Admin can update everything
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'title')
      .populate('assignedTo', 'username email');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
