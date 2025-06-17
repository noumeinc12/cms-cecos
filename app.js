const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');






// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
const supervisorRoutes = require('./routes/supervisor');
const projectRoutes = require('./routes/Projects');
const meetingRoutes = require('./routes/meetings');
const taskRoutes = require('./routes/taskroutes');
const adminRoutes = require('./routes/adminRoutes');
const ideaRoutes = require('./routes/ideaRoutes');

const studentProjectRoutes = require('./routes/projectRequests'); 


app.use('/api/auth', authRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/studentProjects', studentProjectRoutes);
app.use('/api/ideas', ideaRoutes);


// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
