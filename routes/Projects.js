const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Project = require('../models/Projects');
const User = require('../models/User');

// Student creates a new project
router.post('/', protect, authorize('student'), async (req, res) => {
  const {
    projectTitle,
    description,
    proposal,
    projectType,
    supervisor,
    program,
    groupMembers
  } = req.body;

  try {
    const student = req.user._id;

    const newProject = new Project({
      projectTitle,
      description,
      proposal,
      projectType,
      supervisor,
      program,
      groupMembers,
      student,
      status: 'pending' // Set default status on creation
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending project requests (for supervisor or student)
router.get('/requests', protect, authorize('supervisor', 'student'), async (req, res) => {
  try {
    const requests = await Project.find({ status: 'pending' })
      .populate({
        path: 'student',
        select: 'profile.fullName'
      })
      .populate({
        path: 'supervisor',
        select: 'profile.fullName'
      });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all project requests (for supervisor or student)
router.get('/studentRequests', protect, authorize('supervisor', 'student'), async (req, res) => {
  try {
    const requests = await Project.find()
      .populate({
        path: 'student',
        select: 'profile.fullName'
      })
      .populate({
        path: 'supervisor',
        select: 'profile.fullName'
      });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supervisor accepts a project
router.put('/requests/:projectId/accept', protect, authorize('supervisor'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('supervisor', 'profile.fullName');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.status = 'accepted';
    await project.save();

    res.json({ message: 'Project accepted successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Fixed route: Get all projects for a specific student ID**
router.get('/requests/:id', protect, authorize('student', 'supervisor'), async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    const projects = await Project.find({ student: studentId })
      .populate('supervisor', 'profile.fullName')
      .populate('student', 'profile.fullName');

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'Project requests not found' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects by student ID:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Supervisor rejects a project (delete)
router.put('/requests/:projectId/reject', protect, authorize('supervisor'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.projectId });

    res.json({ message: 'Project rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all accepted projects (supervisor only)
router.get('/accepted', protect, authorize('supervisor'), async (req, res) => {
  try {
    const acceptedProjects = await Project.find({ status: 'accepted' })
      .populate('student', 'profile.fullName')
      .populate('supervisor', 'profile.fullName');

    res.json(acceptedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
