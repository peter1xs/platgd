const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Tutor login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Find tutor by username
    const tutor = await Tutor.findOne({ username }).select('+password');
    if (!tutor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password (assuming plain text for now, should be hashed in production)
    if (password !== tutor.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: tutor._id, role: 'tutor' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const tutorData = tutor.toObject();
    delete tutorData.password;

    res.status(200).json({
      success: true,
      data: {
        tutor: tutorData,
        token
      }
    });

  } catch (error) {
    console.error('Tutor login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Create new tutor
router.post('/', async (req, res) => {
  try {
    const { company, fname, lname, status } = req.body;
    
    // Generate username
    const username = `${fname.toLowerCase()}.${lname.toLowerCase()}@cobotkidskenya.com`;
    
    const tutor = new Tutor({
      company,
      fname,
      lname,
      username,
      status: status || 'pending'
    });

    await tutor.save();
    
    res.status(201).json({
      success: true,
      data: tutor
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Get all tutors
router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: tutors.length,
      data: tutors 
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get single tutor
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .select('-password')
      .populate('assignments.school', 'name code location')
      .populate('assignments.classes.class', 'name level');
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error fetching tutor:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update tutor
router.put('/:id', async (req, res) => {
  try {
    const { company, fname, lname, username, password, status } = req.body;
    
    const updates = {};
    if (company) updates.company = company.trim();
    if (fname) updates.fname = fname.trim();
    if (lname) updates.lname = lname.trim();
    if (username) updates.username = username.trim();
    if (password) updates.password = password; // Should hash in production
    if (status) updates.status = status;

    const tutor = await Tutor.findByIdAndUpdate(
    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      });
    }
      req.params.id,
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error updating tutor:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Delete tutor
router.delete('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndDelete(req.params.id);
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      });
    }
      updates,
    res.status(200).json({
      success: true,
      message: 'Tutor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get tutor assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .populate('assignments.school', 'name code location')
      .populate('assignments.classes.class', 'name level students');
    
    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      });
    }
      { new: true, runValidators: true }
    // Format assignments for response
    const formattedAssignments = tutor.assignments.map(assignment => ({
      schoolId: assignment.school._id,
      schoolName: assignment.school.name,
      schoolCode: assignment.school.code,
      schoolLocation: assignment.school.location,
      classes: assignment.classes.map(classAssignment => ({
        classId: classAssignment.class._id,
        className: classAssignment.class.name,
        level: classAssignment.class.level,
        studentCount: classAssignment.class.students?.length || 0,
        isActive: classAssignment.isActive,
        startDate: classAssignment.startDate,
        endDate: classAssignment.endDate
      }))
    }));
    ).select('-password');
    res.status(200).json({
      success: true,
      data: formattedAssignments
    });
  } catch (error) {
    console.error('Error fetching tutor assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;