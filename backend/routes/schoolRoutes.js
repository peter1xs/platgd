const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const classController = require('../controllers/classController');

// School routes
router.get('/', schoolController.getAllSchools);
router.post('/', schoolController.createSchool);
router.get('/:id', schoolController.getSchool);
router.put('/:id', schoolController.updateSchool);
router.delete('/:id', schoolController.deleteSchool);
router.get('/:id/stats', schoolController.getSchoolStats);

// Class routes within schools
router.post('/:schoolId/classes', classController.addClassToSchool);
router.get('/:schoolId/classes', classController.getSchoolClasses);
router.get('/:schoolId/classes/:classId', classController.getClass);
router.put('/:schoolId/classes/:classId', classController.updateClass);
router.delete('/:schoolId/classes/:classId', classController.deleteClass);

module.exports = router;