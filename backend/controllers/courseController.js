const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { courseName, code, status, courseIcon, courseLink } = req.body;

    // Validate required fields
    if (!courseName || !code || !courseIcon) {
      return res.status(400).json({
        success: false,
        error: 'Course name, code, and icon are required'
      });
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        error: 'Course code already exists'
      });
    }

    const course = new Course({
      courseName: courseName.trim(),
      code: code.toUpperCase().trim(),
      status: status || 'locked',
      courseIcon: courseIcon.trim(),
      courseLink: courseLink?.trim() || '',
      topics: []
    });

    await course.save();

    res.status(201).json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, code, status, courseIcon, courseLink } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }

    const updates = {};
    if (courseName) updates.courseName = courseName.trim();
    if (code) updates.code = code.toUpperCase().trim();
    if (status) updates.status = status;
    if (courseIcon) updates.courseIcon = courseIcon.trim();
    if (courseLink !== undefined) updates.courseLink = courseLink.trim();

    const course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Add topic to course
const addTopicToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Topic name is required'
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          topics: {
            name: name.trim(),
            notes: []
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const addedTopic = course.topics[course.topics.length - 1];
    
    res.status(201).json({
      success: true,
      data: addedTopic
    });

  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get course topics
const getCourseTopics = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }

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
    console.error("Error fetching topics:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addTopicToCourse,
  getCourseTopics
};