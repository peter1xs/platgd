const School = require('../models/School');
const jwt = require('jsonwebtoken');

exports.studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
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
        error: 'Invalid username format (e.g., sra-james.smith)' 
      });
    }

    // Extract school code and names
    const [schoolCode, names] = username.split('-');
    const [fname, lname] = names.split('.');
    const schoolCodeUpper = schoolCode.toUpperCase();

    // Find school
    const school = await School.findOne({ code: schoolCodeUpper })
      .select('name code classes');

    if (!school) {
      return res.status(404).json({ 
        success: false,
        error: 'School not found' 
      });
    }

    // Find student
    let student = null;
    let foundClass = null;
    
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

    // Verify password
    if (password !== student.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid password' 
      });
    }

    // Prepare response
    const responseData = {
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
      data: responseData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
};