const express = require('express');
const router = express.Router();
const Idea = require('../models/idea');

// GET all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().populate('supervisor', 'profile.fullName');
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create idea
router.post('/', async (req, res) => {
  const { title, description, supervisor } = req.body;
  if (!title || !description || !supervisor) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const idea = new Idea({ title, description, supervisor });
    await idea.save();
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
