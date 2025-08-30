const School = require('../models/School');
const mongoose = require('mongoose');

// Add student to class
const addStudentToClass = async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { fname, lname, username, password } = req.body;

    // Validate input
    if (!fname || !lname) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    // Find school
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    // Find class
    const classObj = school.classes.find(c => c._id.toString() === classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        error: 'Class not found in this school'
      });
    }

    // Generate username if not provided
    const finalUsername = username || `${school.code.toLowerCase()}-${fname.toLowerCase()}.${lname.toLowerCase()}`;

    // Check for duplicate username in this class
    const existingStudent = classObj.students.find(s => s.username === finalUsername);
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists in this class'
      });
    }

    // Create new student
    const newStudent = {
      fname: fname.trim(),
      lname: lname.trim(),
      username: finalUsername,
      password: password || '1234',
      points: 0
    };

    classObj.students.push(newStudent);
    await school.save();

    // Get the newly added student
    const addedStudent = classObj.students[classObj.students.length - 1];
    
    res.status(201).json({
      success: true,
      data: addedStudent
    });

  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get students in a class
const getClassStudents = async (req, res) => {
  try {
    const { schoolId, classId } = req.params;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    const classObj = school.classes.find(c => c._id.toString() === classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classObj.students || []
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete student from class
const deleteStudentFromClass = async (req, res) => {
  try {
    const { schoolId, classId, studentId } = req.params;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    const classObj = school.classes.find(c => c._id.toString() === classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    const studentIndex = classObj.students.findIndex(s => s._id.toString() === studentId);
    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    classObj.students.splice(studentIndex, 1);
    await school.save();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  addStudentToClass,
  getClassStudents,
  deleteStudentFromClass
};