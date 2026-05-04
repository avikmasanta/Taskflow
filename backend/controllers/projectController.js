const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    // If admin, get all. If member, get assigned projects
    if (req.user.role === 'Admin') {
      const projects = await Project.find().populate('members', 'username email');
      return res.json(projects);
    } else {
      const projects = await Project.find({ members: req.user.id }).populate('members', 'username email');
      return res.json(projects);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'username email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;
    const project = await Project.create({
      title,
      description,
      members: members || [],
      createdBy: req.user.id
    });
    
    const populatedProject = await Project.findById(project._id).populate('members', 'username email');
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    const populatedProject = await Project.findById(updatedProject._id).populate('members', 'username email');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
