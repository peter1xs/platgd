const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Student Login
router.post('/login', authController.studentLogin);

module.exports = router;