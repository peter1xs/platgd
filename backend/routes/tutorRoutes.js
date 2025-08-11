const express = require('express');
const router = express.Router();
const Tutor = require('/models/Tutor');

// Create new tutor
router.post('/tutors', async (req, res) => {
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
router.get('/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tutors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;