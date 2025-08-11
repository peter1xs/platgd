// routes/topicsRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const mongoose = require('mongoose');

// GET all topics for a specific course
router.get('/courses/:courseId/topics', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid course ID format' 
      });
    }

    // Find course and select only topics
    const course = await Course.findById(courseId).select('topics');

    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: course.topics || []
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching topics' 
    });
  }
});

module.exports = router;