const express = require('express');
const router = express.Router();

// Import route files
const classRoutes = require('./classRoutes');
const courseRoutes = require('./courseRoutes');
const schoolRoutes = require('./schoolRoutes');
const studentRoutes = require('./studentRoutes');
const topicRoutes = require('./topicRoutes');

// Use routes
router.use('/classCode', classRoutes);
router.use('/courses', courseRoutes);
router.use('/schools', schoolRoutes);
router.use('/students', studentRoutes);
router.use('/topics', topicRoutes);

module.exports = router;