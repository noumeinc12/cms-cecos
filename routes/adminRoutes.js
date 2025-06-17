const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');
const User = require('../models/User');

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('supervisor', 'profile.fullName');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = req.body; // Ensure req.body contains all fields needed for update

    // Update project in the database
    const updatedProjectDoc = await Project.findByIdAndUpdate(id, updatedProject, { new: true });

    if (!updatedProjectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProjectDoc);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete a project
router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get total projects
router.get('/total-projects', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({});
    res.status(200).json({ totalProjects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total projects', error });
  }
});

// Route to get total supervisors
router.get('/total-supervisors', async (req, res) => {
  try {
    const totalSupervisors = await User.countDocuments({ role: 'supervisor' });
    res.status(200).json({ totalSupervisors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total supervisors', error });
  }
});

// Route to get total students
router.get('/total-students', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    res.status(200).json({ totalStudents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total students', error });
  }
});
// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a student
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = req.body; // Ensure req.body contains all fields needed for update

    // Update student in the database
    const updatedStudentDoc = await User.findByIdAndUpdate(id, updatedStudent, { new: true });

    if (!updatedStudentDoc) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudentDoc);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all supervisors
router.get('/supervisors', async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('-password');
    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a supervisor
// Update a supervisor
router.put('/supervisors/:id', async (req, res) => {
// Update a supervisor
router.put('/supervisors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSupervisor = req.body; // contains fields to update, e.g. profile etc.

    // Validate if the user exists and role is supervisor (optional but recommended)
    const existingSupervisor = await User.findById(id);
    if (!existingSupervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    if (existingSupervisor.role !== "supervisor") {
      return res.status(400).json({ message: "User is not a supervisor" });
    }

    // Update the supervisor document
    const updatedSupervisorDoc = await User.findByIdAndUpdate(id, updatedSupervisor, {
      new: true,
      runValidators: true, // to enforce schema validation on update
    });

    res.json(updatedSupervisorDoc);
  } catch (error) {
    console.error("Error updating supervisor:", error);
    res.status(500).json({ message: "Server error" });
  }
});
});



// Delete a supervisor
router.delete('/supervisors/:id', async (req, res) => {
  try {
    const deletedSupervisor = await User.findByIdAndDelete(req.params.id);

    if (!deletedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/supervisors/:id', async (req, res) => {
  try {
    const deletedSupervisor = await User.findByIdAndDelete(req.params.id);

    if (!deletedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor deleted' });
  } catch (error) {
    console.error('Error deleting supervisor:', error); // Log error details
    res.status(500).json({ message: 'Error deleting supervisor. Please try again.', error: error.message });
  }
});


module.exports = router;
