const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  proposal: { type: String },
  projectType: { type: String },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // supervisor required
  program: { type: String },
  groupMembers: [{ type: String }],
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
