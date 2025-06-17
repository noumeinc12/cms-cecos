const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming User model stores supervisors
  }
});

module.exports = mongoose.model('Idea', ideaSchema);
