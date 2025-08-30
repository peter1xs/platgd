const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');

// Student management routes
router.post('/schools/:schoolId/classes/:classId/students', studentController.addStudentToClass);
router.get('/schools/:schoolId/classes/:classId/students', studentController.getClassStudents);
router.delete('/schools/:schoolId/classes/:classId/students/:studentId', studentController.deleteStudentFromClass);

// Student authentication
router.post('/login', authController.studentLogin);

module.exports = router;
