const express = require('express');
const router = express.Router();
const School = require('../models/School');

// Error response handler
const handleError = (res, status, message) => {
  return res.status(status).json({ 
    success: false,
    error: message 
  });
};

// Success response handler
const handleSuccess = (res, status, data) => {
  return res.status(status).json({ 
    success: true,
    data 
  });
};

// Create a school
router.post('/', async (req, res) => {
  try {
    // Check for duplicate school code
    const existingSchool = await School.findOne({ code: req.body.code });
    if (existingSchool) {
      return handleError(res, 400, 'School code already exists');
    }

    const school = new School(req.body);
    await school.save();
    handleSuccess(res, 201, school);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return handleError(res, 400, messages.join(', '));
    }
    handleError(res, 500, 'Server error');
  }
});

// Get all schools with optional filtering
router.get('/', async (req, res) => {
  try {
    // Build query object
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = School.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const schools = await query;
    handleSuccess(res, 200, schools);
  } catch (error) {
    handleError(res, 500, 'Server error');
  }
});

// Get single school
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return handleError(res, 404, 'School not found');
    }
    handleSuccess(res, 200, school);
  } catch (error) {
    handleError(res, 500, 'Server error');
  }
});

// Update school
router.patch('/:id', async (req, res) => {
  try {
    // Prevent code modification
    if (req.body.code) {
      return handleError(res, 400, 'School code cannot be modified');
    }

    const school = await School.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,
        runValidators: true
      }
    );

    if (!school) {
      return handleError(res, 404, 'School not found');
    }
    handleSuccess(res, 200, school);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return handleError(res, 400, messages.join(', '));
    }
    handleError(res, 500, 'Server error');
  }
});

// Delete school
router.delete('/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return handleError(res, 404, 'School not found');
    }
    handleSuccess(res, 200, { message: 'School deleted successfully' });
  } catch (error) {
    handleError(res, 500, 'Server error');
  }
});

module.exports = router;