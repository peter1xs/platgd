const mongoose = require('mongoose');
const School = require('../models/School');

// Add class to a school
const addClassToSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { name, level } = req.body;

    // Validate input
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Class name is required',
        field: 'name'
      });
    }

    if (!level || !['Kindergarten', 'Primary', 'Secondary', 'High School'].includes(level)) {
      return res.status(400).json({
        success: false,
        error: 'Valid level is required',
        field: 'level'
      });
    }

    // Find school and add class
    const school = await School.findByIdAndUpdate(
      schoolId,
      {
        $push: {
          classes: {
            name: name.trim(),
            level,
            students: []
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    // Get the newly added class (last one in the array)
    const addedClass = school.classes[school.classes.length - 1];
    
    res.status(201).json({
      success: true,
      data: addedClass
    });

  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get all classes for a school
const getSchoolClasses = async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const school = await School.findById(schoolId).select('classes');
    
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school.classes
    });

  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get a single class
const getClass = async (req, res) => {
  try {
    const { schoolId, classId } = req.params;

    const school = await School.findOne(
      { _id: schoolId, 'classes._id': classId },
      { 'classes.$': 1 }
    );

    if (!school || !school.classes || school.classes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school.classes[0]
    });

  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { name, level } = req.body;

    const updates = {};
    if (name) updates['classes.$.name'] = name.trim();
    if (level) updates['classes.$.level'] = level;

    const school = await School.findOneAndUpdate(
      { _id: schoolId, 'classes._id': classId },
      { $set: updates },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    const updatedClass = school.classes.find(c => c._id.toString() === classId);
    
    res.status(200).json({
      success: true,
      data: updatedClass
    });

  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const { schoolId, classId } = req.params;

    const school = await School.findByIdAndUpdate(
      schoolId,
      {
        $pull: {
          classes: { _id: classId }
        }
      },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  addClassToSchool,
  getSchoolClasses,
  getClass,
  updateClass,
  deleteClass
};