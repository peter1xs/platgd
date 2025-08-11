const express = require('express');
const router = express.Router();
const Schools = require('../models/School'); // Import your School model

const School = require('../models/School');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




// student


router.post('/cobotKidsKenya/schools/:schoolId/classes/:classId/students', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { fname, lname, username, password } = req.body;

    // Debug logs
    console.log('--- NEW REQUEST ---');
    console.log('School ID:', schoolId);
    console.log('Class ID:', classId);
    console.log('Request Body:', req.body);

    // Validate input
    if (!fname || !lname || !username || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false,
        error: 'All fields (fname, lname, username, password) are required' 
      });
    }

    // Find school
    const school = await Schools.findById(schoolId);
    if (!school) {
      console.log('School not found in database');
      return res.status(404).json({ 
        success: false,
        error: 'School not found' 
      });
    }

    // Debug: Log all class IDs
    console.log('Classes in school:', school.classes.map(c => c._id.toString()));

    // Find class
    const classObj = schools.classes.find(c => c._id.toString() === classId);
    if (!classObj) {
      console.log(`Class ${classId} not found in school`);
      return res.status(404).json({ 
        success: false,
        error: 'Class not found inbbcxb  this school' 
      });
    }

    // Create new student
    const newStudent = {
      fname: fname.trim(),
      lname: lname.trim(),
      username: username.trim().toLowerCase(),
      password: password
    };

    classObj.students.push(newStudent);
    await school.save();

    // Get the newly added student
    const addedStudent = classObj.students[classObj.students.length - 1];
    
    console.log('Successfully added student:', addedStudent);
    return res.status(201).json({
      success: true,
      data: addedStudent
    });

  } catch (err) {
    console.error('SERVER ERROR:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});






// Student Login
router.post('/cobotKidsKenya/schools/:schoolId/classes/:classId/students', async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log('Login attempt for:', userName);

    // Validate username format
    if (!userName || !/^[a-z]{3}-[a-z]+\.[a-z]+$/.test(userName)) {
      console.log('Invalid username format');
      return res.status(400).json({ 
        success: false,
        error: 'Username must follow schoolcode-firstname.lastname format' 
      });
    }

    // Extract school code and names
    const [schoolCode, names] = userName.split('-');
    const [fname, lname] = names.split('.');
    const schoolCodeUpper = schoolCode.toUpperCase();
    console.log(`Searching for school: ${schoolCodeUpper}, student: ${fname} ${lname}`);

    // Find school with debugging
    const school = await School.findOne({ code: schoolCodeUpper })
      .select('name code classes');
    console.log('School found:', school ? school.code : 'NOT FOUND');

    if (!school) {
      console.log(`School ${schoolCodeUpper} not found in database`);
      return res.status(404).json({ 
        success: false,
        error: 'School not found' 
      });
    }

    // Find student with detailed debugging
    let student = null;
    let foundClass = null;
    
    console.log(`Searching through ${school.classes.length} classes...`);
    for (const classroom of school.classes) {
      console.log(` Checking class: ${classroom.name} (${classroom.level}) with ${classroom.students.length} students`);
      
      student = classroom.students.find(s => {
        const match = s.fname.toLowerCase() === fname.toLowerCase() && 
                     s.lname.toLowerCase() === lname.toLowerCase();
        if (match) console.log('  FOUND STUDENT:', s.username);
        return match;
      });

      if (student) {
        foundClass = classroom;
        console.log(`Student found in class ${classroom.name}`);
        break;
      }
    }

    if (!student) {
      console.log(`Student ${fname} ${lname} not found in any classes`);
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    // Verify password
    console.log('Verifying password...');
    if (password !== student.password) {
      console.log('Password mismatch');
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Debug output
    console.log(`Successful login: 
      School: ${school.name} (${school.code})
      Class: ${foundClass.name}
      Student: ${student.fname} ${student.lname}
      Username: ${student.username}`);

    // Create token
    const token = jwt.sign(
      { id: student._id, school: school.code, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return success with student data
    const studentData = {
      id: student._id,
      fname: student.fname,
      lname: student.lname,
      username: student.username,
      points: student.points,
      school: {
        code: school.code,
        name: school.name
      },
      class: foundClass.name,
      level: foundClass.level,
      token
    };

    res.status(200).json({
      success: true,
      data: studentData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});
module.exports = router;


