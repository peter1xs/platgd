const mongoose = require('mongoose');
const School = require('../models/School');

// Create a new school
const createSchool = async (req, res) => {
  try {
    const { name, code, location } = req.body;

    // Validate input
    if (!name || !code || !location) {
      return res.status(400).json({
        success: false,
        error: 'Name, code, and location are required'
      });
    }

    // Check if school code already exists
    const existingSchool = await School.findOne({ code: code.toUpperCase() });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        error: 'School code already exists'
      });
    }

    // Create new school
    const school = new School({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      location: location.trim(),
      classes: []
    });

    await school.save();

    res.status(201).json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get all schools
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });

  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get a single school
const getSchool = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid school ID'
      });
    }

    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a school
const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, location } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid school ID'
      });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (code) updates.code = code.toUpperCase().trim();
    if (location) updates.location = location.trim();

    const school = await School.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a school
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid school ID'
      });
    }

    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get school statistics
const getSchoolStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid school ID'
      });
    }

    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    // Calculate statistics
    const totalClasses = school.classes.length;
    let totalStudents = 0;
    let studentsByLevel = {
      Kindergarten: 0,
      Primary: 0,
      Secondary: 0,
      'High School': 0
    };

    school.classes.forEach(cls => {
      totalStudents += cls.students.length;
      studentsByLevel[cls.level] += cls.students.length;
    });

    res.status(200).json({
      success: true,
      data: {
        name: school.name,
        code: school.code,
        totalClasses,
        totalStudents,
        studentsByLevel,
        lastUpdated: school.updatedAt
      }
    });

  } catch (error) {
    console.error("Error getting school stats:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  createSchool,
  getAllSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  getSchoolStats
};