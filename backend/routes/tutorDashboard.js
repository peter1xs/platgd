const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');
const Lesson = require('../models/Lesson');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const School = require('../models/School');

// ==================== DASHBOARD OVERVIEW ====================

// Get tutor dashboard overview
router.get('/dashboard/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    
    // Get tutor with populated schools and classes
    const tutor = await Tutor.findById(tutorId)
      .populate('schools')
      .populate('classes');
    
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Tutor not found' });
    }

    // Get recent lessons
    const recentLessons = await Lesson.find({ tutor: tutorId })
      .populate('class', 'name')
      .populate('school', 'name')
      .sort({ scheduledDate: -1 })
      .limit(5);

    // Get upcoming lessons
    const upcomingLessons = await Lesson.find({ 
      tutor: tutorId, 
      scheduledDate: { $gte: new Date() },
      status: { $in: ['draft', 'published'] }
    })
      .populate('class', 'name')
      .populate('school', 'name')
      .sort({ scheduledDate: 1 })
      .limit(5);

    // Get pending assignments
    const pendingAssignments = await Assignment.find({ 
      tutor: tutorId, 
      status: 'published'
    })
      .populate('class', 'name')
      .populate('school', 'name')
      .sort({ dueDate: 1 })
      .limit(5);

    // Get recent exams
    const recentExams = await Exam.find({ tutor: tutorId })
      .populate('class', 'name')
      .populate('school', 'name')
      .sort({ startDate: -1 })
      .limit(5);

    // Get student count
    const studentCount = await Student.countDocuments({ 
      class: { $in: tutor.classes } 
    });

    // Get total lessons count
    const totalLessons = await Lesson.countDocuments({ tutor: tutorId });

    // Get total assignments count
    const totalAssignments = await Assignment.countDocuments({ tutor: tutorId });

    // Get total exams count
    const totalExams = await Exam.countDocuments({ tutor: tutorId });

    res.json({
      success: true,
      data: {
        tutor,
        overview: {
          studentCount,
          totalLessons,
          totalAssignments,
          totalExams
        },
        recentLessons,
        upcomingLessons,
        pendingAssignments,
        recentExams
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== LESSONS MANAGEMENT ====================

// Get all lessons for tutor
router.get('/lessons/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { status, subject, classId, page = 1, limit = 10 } = req.query;

    const query = { tutor: tutorId };
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (classId) query.class = classId;

    const lessons = await Lesson.find(query)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname')
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lesson.countDocuments(query);

    res.json({
      success: true,
      data: lessons,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLessons: total
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new lesson
router.post('/lessons', async (req, res) => {
  try {
    const lessonData = req.body;
    const lesson = new Lesson(lessonData);
    await lesson.save();

    const populatedLesson = await Lesson.findById(lesson._id)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    res.status(201).json({
      success: true,
      data: populatedLesson
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update lesson
router.put('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updateData = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Lesson not found' });
    }

    res.json({
      success: true,
      data: lesson
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete lesson
router.delete('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonId);

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Lesson not found' });
    }

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== STUDENTS MANAGEMENT ====================

// Get all students for tutor
router.get('/students/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { classId, status, page = 1, limit = 10 } = req.query;

    // Get tutor's classes
    const tutor = await Tutor.findById(tutorId).populate('classes');
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Tutor not found' });
    }

    const classIds = tutor.classes.map(c => c._id);
    
    const query = { class: { $in: classIds } };
    if (classId) query.class = classId;
    if (status) query.status = status;

    const students = await Student.find(query)
      .populate('class', 'name level')
      .populate('school', 'name')
      .sort({ fname: 1, lname: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStudents: total
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get student details
router.get('/students/:tutorId/:studentId', async (req, res) => {
  try {
    const { tutorId, studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('class', 'name level')
      .populate('school', 'name');

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Check if tutor has access to this student's class
    const tutor = await Tutor.findById(tutorId);
    if (!tutor.classes.includes(student.class._id)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== ASSIGNMENTS MANAGEMENT ====================

// Get all assignments for tutor
router.get('/assignments/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { status, subject, classId, page = 1, limit = 10 } = req.query;

    const query = { tutor: tutorId };
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (classId) query.class = classId;

    const assignments = await Assignment.find(query)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname')
      .sort({ dueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assignment.countDocuments(query);

    res.json({
      success: true,
      data: assignments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAssignments: total
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new assignment
router.post('/assignments', async (req, res) => {
  try {
    const assignmentData = req.body;
    const assignment = new Assignment(assignmentData);
    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    res.status(201).json({
      success: true,
      data: populatedAssignment
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update assignment
router.put('/assignments/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updateData = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    res.json({
      success: true,
      data: assignment
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Grade assignment submission
router.post('/assignments/:assignmentId/grade', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, grade, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(s => s.student.toString() === studentId);
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedBy = req.body.tutorId;
    submission.gradedAt = new Date();
    submission.status = 'graded';

    await assignment.save();

    res.json({
      success: true,
      data: assignment
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== EXAMS MANAGEMENT ====================

// Get all exams for tutor
router.get('/exams/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { status, subject, classId, page = 1, limit = 10 } = req.query;

    const query = { tutor: tutorId };
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (classId) query.class = classId;

    const exams = await Exam.find(query)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname')
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Exam.countDocuments(query);

    res.json({
      success: true,
      data: exams,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalExams: total
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new exam
router.post('/exams', async (req, res) => {
  try {
    const examData = req.body;
    const exam = new Exam(examData);
    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    res.status(201).json({
      success: true,
      data: populatedExam
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update exam
router.put('/exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    const updateData = req.body;

    const exam = await Exam.findByIdAndUpdate(
      examId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('class', 'name level')
      .populate('school', 'name')
      .populate('tutor', 'fname lname');

    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    res.json({
      success: true,
      data: exam
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Grade exam submission
router.post('/exams/:examId/grade', async (req, res) => {
  try {
    const { examId } = req.params;
    const { studentId, answers, totalScore, percentage } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    const submission = exam.submissions.find(s => s.student.toString() === studentId);
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    submission.answers = answers;
    submission.totalScore = totalScore;
    submission.percentage = percentage;
    submission.grade = exam.calculateGrade(percentage);
    submission.gradedBy = req.body.tutorId;
    submission.gradedAt = new Date();
    submission.status = 'graded';

    await exam.save();

    res.json({
      success: true,
      data: exam
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== SCHOOLS MANAGEMENT ====================

// Get schools for tutor
router.get('/schools/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await Tutor.findById(tutorId).populate('schools');
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Tutor not found' });
    }

    res.json({
      success: true,
      data: tutor.schools
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get school details
router.get('/schools/:tutorId/:schoolId', async (req, res) => {
  try {
    const { tutorId, schoolId } = req.params;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Tutor not found' });
    }

    if (!tutor.schools.includes(schoolId)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const school = await School.findById(schoolId)
      .populate('classes')
      .populate('students');

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    res.json({
      success: true,
      data: school
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;

