const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const School = require('../models/School');

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Validate username format
    if (!/^[a-z]{3}-[a-z]+\.[a-z]+$/.test(username)) {
      return res.status(400).json({ 
        success: false,
        error: 'Username must follow schoolcode-firstname.lastname format (e.g., sra-james.smith)' 
      });
    }

    // Extract school code and names
    const [schoolCode, names] = username.split('-');
    const [fname, lname] = names.split('.');
    const schoolCodeUpper = schoolCode.toUpperCase();

    // Find school and student
    const school = await School.findOne({ code: schoolCodeUpper })
      .select('name code classes');

    if (!school) {
      return res.status(404).json({ 
        success: false,
        error: 'School not found' 
      });
    }

    let student = null;
    let foundClass = null;
    
    // Search through classes for the student
    for (const classroom of school.classes) {
      student = classroom.students.find(s => 
        s.fname.toLowerCase() === fname && 
        s.lname.toLowerCase() === lname
      );

      if (student) {
        foundClass = classroom;
        break;
      }
    }

    if (!student) {
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    // Password verification
    if (password !== student.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid password' 
      });
    }

    // Create response data
    const studentData = {
      id: student._id,
      fname: student.fname,
      lname: student.lname,
      username: student.username,
      school: {
        code: school.code,
        name: school.name
      },
      class: foundClass ? foundClass.name : 'N/A',
      level: foundClass ? foundClass.level : 'N/A'
    };

    res.status(200).json({
      success: true,
      data: studentData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal servedsadsr error'
    });
  }
});

module.exports = router;