require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/EmployeesModel.js");
const StudentModel = require("./models/StudentModel.js");
const School = require("./models/School.js"); 
const Course = require("./models/Course.js"); // Make sure to import your Course model
const router = express.Router();
const studentRoutes = require('./routes/studentRoutes');
const schoolRoutes = require('./routes/School.js');
const studentAuthRoutes = require('./routes/studentAuth'); // Add this line
const jwt = require('jsonwebtoken');

const app = express();
// Middleware
app.use(express.json());
app.use(cors({
   origin: '*',
}));






// Database Connection
mongoose.connect("mongodb+srv://cobotkidsacademy:3eJkIfTpBU7ggj1O@cluster0.fhyc2xl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));



// Class Code Routes
const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  classCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 4
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Class = mongoose.model('Class', classSchema);

app.post('/cobotKidsKenya/classCode', async (req, res) => {
  try {
    const { className, classCode } = req.body;

    if (!className || !classCode) {
      return res.status(400).json({ 
        error: 'Both class name and code are required' 
      });
    }

    const existingClass = await Class.findOne({ classCode });
    if (existingClass) {
      return res.status(400).json({ 
        error: 'This class code is already in use' 
      });
    }

    const newClass = new Class({ className, classCode });
    await newClass.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: {
        className: newClass.className,
        classCode: newClass.classCode,
        createdAt: newClass.createdAt
      }
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.post('/cobotKidsKenya/verifyClassCode', async (req, res) => {
  try {
    const { otp } = req.body;
    const code = otp.join('');

    if (!code || code.length !== 4) {
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid code format' 
      });
    }

    const existingClass = await Class.findOne({ classCode: code });
    
    if (existingClass) {
      return res.json({
        valid: true,
        class: existingClass
      });
    } else {
      return res.json({
        valid: false,
        error: 'Invalid class code'
      });
    }
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ 
      valid: false,
      error: 'Server error during verification' 
    });
  }
});

app.get('/cobotKidsKenya/classCode', async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// School Routes
app.post('/cobotKidsKenya/schools', async (req, res) => {
  try {
    console.log('Received school creation request:', req.body);
    
    const { name, code, location } = req.body;

    // Validate input
    if (!name || !code || !location) {
      console.log('Validation failed - missing required fields:', { name, code, location });
      return res.status(400).json({
        success: false,
        error: 'Name, code, and location are required'
      });
    }

    // Check if school code already exists
    const existingSchool = await School.findOne({ code: code.toUpperCase() });
    if (existingSchool) {
      console.log('School code already exists:', code.toUpperCase());
      return res.status(400).json({
        success: false,
        error: 'School code already exists'
      });
    }

    // Create new school with proper validation and defaults
    const school = new School({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      location: location.trim(),
      classes: [],
      studentsCount: 0
    });

    console.log('Attempting to save school:', school);
    await school.save();
    console.log('School saved successfully:', school._id);

    res.status(201).json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

app.get('/cobotKidsKenya/schools', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cobotKidsKenya/schools/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cobotKidsKenya/schools/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/cobotKidsKenya/schools/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json({ message: 'School deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cobotKidsKenya/schools/:schoolId/classes', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { name, level } = req.body;

    // Validate input more thoroughly
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        details: 'Class name is required',
        field: 'name'
      });
    }

    if (!level || !['Kindergarten', 'Primary', 'Secondary', 'High School'].includes(level)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        details: 'Valid level is required',
        field: 'level'
      });
    }

    // Verify school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        details: 'School not found'
      });
    }

    // Add new class
    school.classes.push({
      name: name.trim(),
      level,
      students: [],
      createdAt: new Date()
    });

    await school.save();
    
    const createdClass = school.classes[school.classes.length - 1];
    res.status(201).json({
      success: true,
      data: createdClass
    });

  } catch (error) {
    console.error("Server error:", {
      message: error.message,
      stack: error.stack,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
app.get('/cobotKidsKenya/schools/:schoolId/classes', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const classes = await Class.find({ school: schoolId }).sort({ name: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cobotKidsKenya/schools/:schoolId/classes/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const deletedClass = await Class.findByIdAndDelete(classId);
    
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Course Routes (added here)
app.post('/cobotKidsKenya/courses', async (req, res) => {
  try {
    const { courseName, code, courseIcon, courseLink, status } = req.body;

    // Validate required fields
    if (!courseName || !code || !courseIcon) {
      return res.status(400).json({ error: 'Course name, code, and icon are required' });
    }

    // Set default status if not provided
    const courseStatus = status || 'locked';

    const course = new Course({
      courseName: courseName.trim(),
      code: code.trim().toUpperCase(),
      status: courseStatus,
      courseIcon: courseIcon.trim(),
      courseLink: courseLink ? courseLink.trim() : undefined  // Make it optional
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ error: messages.join(', ') });
    } else if (error.code === 11000) {
      // Handle duplicate key error (unique constraint)
      res.status(400).json({ error: 'Course code already exists' });
    } else {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.get('/cobotKidsKenya/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/cobotKidsKenya/courses/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

app.put('/cobotKidsKenya/courses/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.delete('/cobotKidsKenya/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    // Find and delete the course
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ 
      message: 'Course deleted successfully',
      deletedCourse: {
        id: deletedCourse._id,
        name: deletedCourse.courseName,
        code: deletedCourse.code
      }
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Server error while deleting course' });
  }
});

// Get all topics for a specific course

// route for students
app.get('/cobotKidsKenya/schools/:schoolId/classes/:classId', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;

    // Validate ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(schoolId) || 
        !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const classInfo = await Class.findOne({
      _id: classId,
      school: schoolId
    }).lean();

    if (!classInfo) {
      return res.status(404).json({
        success: false,
        error: 'Class nodfgt found'
      });
    }

    res.status(200).json({
      success: true,
      data: classInfo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ===== CLASS SCHEDULE & COURSE ASSIGNMENTS ===== //

// Update class schedule (dayOfWeek, startTime, endTime)
app.put('/cobotKidsKenya/schools/:schoolId/classes/:classId/schedule', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    if (![schoolId, classId].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    const classObj = school.classes.id(classId);
    if (!classObj) return res.status(404).json({ success: false, error: 'Class not found' });

    classObj.schedule = {
      dayOfWeek: dayOfWeek || classObj.schedule?.dayOfWeek,
      startTime: startTime || classObj.schedule?.startTime,
      endTime: endTime || classObj.schedule?.endTime,
    };

    await school.save();
    return res.status(200).json({ success: true, data: classObj.schedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ success: false, error: 'Server error while updating schedule' });
  }
});

// Assign a course to a class with a status (enrolled|locked|completed)
app.post('/cobotKidsKenya/schools/:schoolId/classes/:classId/courses', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { courseId, status } = req.body;

    if (![schoolId, classId, courseId].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    const classObj = school.classes.id(classId);
    if (!classObj) return res.status(404).json({ success: false, error: 'Class not found' });

    const existing = (classObj.courses || []).find(c => String(c.course) === String(courseId));
    if (existing) {
      existing.status = status || existing.status;
    } else {
      classObj.courses = classObj.courses || [];
      classObj.courses.push({ course: courseId, status: status || 'enrolled' });
    }

    await school.save();
    return res.status(200).json({ success: true, data: classObj.courses });
  } catch (error) {
    console.error('Error assigning course to class:', error);
    return res.status(500).json({ success: false, error: 'Server error while assigning course' });
  }
});

// Get a class with schedule, courses and inferred tutor assignment
app.get('/cobotKidsKenya/schools/:schoolId/classes/:classId/details', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    if (![schoolId, classId].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const school = await School.findById(schoolId).lean();
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    const classObj = school.classes.find(c => String(c._id) === String(classId));
    if (!classObj) return res.status(404).json({ success: false, error: 'Class not found' });

    // Find tutor via Tutor.assignments (reverse lookup)
    const Tutor = require('./models/Tutor');
    const tutors = await Tutor.find({ 'assignments.school': schoolId }).lean();
    const matchingTutor = tutors.find(t => (t.assignments || []).some(a => String(a.school) === String(schoolId) && (a.classes || []).some(c => String(c.class) === String(classId))));

    return res.status(200).json({
      success: true,
      data: {
        class: classObj,
        school: { _id: school._id, name: school.name, code: school.code },
        tutor: matchingTutor ? { _id: matchingTutor._id, name: `${matchingTutor.fname} ${matchingTutor.lname}` } : null
      }
    });
  } catch (error) {
    console.error('Error fetching class details:', error);
    return res.status(500).json({ success: false, error: 'Server error while fetching details' });
  }
});

// POST route for adding students to a class
app.post('/cobotKidsKenya/schools/:schoolId/classes/:classId/students', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { fname, lname, username, password } = req.body;

    // Validate input
  if (!fname ) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }

    const classObj = school.classes.id(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Add student with frontend-generated username
    classObj.students.push({
      fname,
      lname,
      username,
      password
    });

    await school.save();

    const addedStudent = classObj.students[classObj.students.length - 1];
    res.status(201).json(addedStudent);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});


// ===== TOPICS ROUTES ===== //

// GET all topics for a specific course
app.get('/cobotKidsKenya/courses/:courseId/topics', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid course ID format' 
      });
    }

    // Find course and select only topics
    const course = await Course.findById(courseId).select('topics');

    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: course.topics || []
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching topics' 
    });
  }
});




// POST - Add a new topic to a course
app.post('/cobotKidsKenya/courses/:courseId/topics', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        error: 'Topic name is required and must be a string' 
      });
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        error: 'Topic name cannot be empty' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create new topic
    const newTopic = {
      name: trimmedName,
      notes: []
    };

    course.topics.push(newTopic);
    await course.save();

    // Get the newly added topic (last one in the array)
    const addedTopic = course.topics[course.topics.length - 1];

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: addedTopic
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while creating topic' 
    });
  }
});

// ===== END TOPICS ROUTES ===== //






// ===== EXAMS ROUTES ===== //

// GET all exams for a specific course
app.get('/cobotKidsKenya/courses/:courseId/exams', async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId).select('exams courseName code');
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    return res.status(200).json({ success: true, data: course.exams || [] });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return res.status(500).json({ success: false, error: 'Server error while fetching exams' });
  }
});

// GET single exam details
app.get('/cobotKidsKenya/courses/:courseId/exams/:examId', async (req, res) => {
  try {
    const { courseId, examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const course = await Course.findById(courseId).select('exams');
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const exam = course.exams.id(examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    return res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return res.status(500).json({ success: false, error: 'Server error while fetching exam' });
  }
});

// POST - Create a new exam for a course
app.post('/cobotKidsKenya/courses/:courseId/exams', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, duration, scheduledAt } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID format' });
    }
    if (!title || !duration || !scheduledAt) {
      return res.status(400).json({ success: false, error: 'title, duration and scheduledAt are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Generate exam code using course code prefix
    const codePrefix = (course.code || 'EXAM').toUpperCase();
    const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const examCode = `${codePrefix}-${randomSuffix}`;

    // Construct new exam subdocument (assignedBy/assignedTo optional)
    const newExam = {
      title: String(title).trim(),
      code: examCode,
      status: 'pending',
      course: course._id,
      questions: [],
      duration: Number(duration),
      scheduledAt: new Date(scheduledAt),
      assignedBy: undefined,
      assignedTo: [],
      attempts: []
    };

    course.exams.push(newExam);
    await course.save();

    const createdExam = course.exams[course.exams.length - 1];
    return res.status(201).json({ success: true, data: createdExam });
  } catch (error) {
    console.error('Error creating exam:', error);
    return res.status(500).json({ success: false, error: 'Server error while creating exam' });
  }
});

// PUT - Update exam details
app.put('/cobotKidsKenya/courses/:courseId/exams/:examId', async (req, res) => {
  try {
    const { courseId, examId } = req.params;
    const { title, duration, scheduledAt, assignedBy, schoolId, classId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const exam = course.exams.id(examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    if (title) exam.title = String(title).trim();
    if (duration !== undefined) exam.duration = Number(duration);
    if (scheduledAt) exam.scheduledAt = new Date(scheduledAt);
    if (assignedBy) exam.assignedBy = assignedBy;
    if (schoolId && classId) exam.assignedTo = [{ school: schoolId, class: classId }];
    if (status && ['pending', 'published', 'completed'].includes(status)) exam.status = status;

    await course.save();
    return res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error('Error updating exam:', error);
    return res.status(500).json({ success: false, error: 'Server error while updating exam' });
  }
});

// POST - Add a question to an exam
app.post('/cobotKidsKenya/courses/:courseId/exams/:examId/questions', async (req, res) => {
  try {
    const { courseId, examId } = req.params;
    const { question, options, correctAnswer, points } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    if (!question || !Array.isArray(options) || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ success: false, error: 'question, 4 options, and correctAnswer are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ success: false, error: 'correctAnswer must be one of the options' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const exam = course.exams.id(examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    exam.questions.push({ question, options, correctAnswer, points: points ?? 1 });
    await course.save();

    const addedQuestion = exam.questions[exam.questions.length - 1];
    return res.status(201).json({ success: true, data: addedQuestion });
  } catch (error) {
    console.error('Error adding exam question:', error);
    return res.status(500).json({ success: false, error: 'Server error while adding question' });
  }
});

// POST - Publish exam (by setting/confirming scheduledAt)
app.post('/cobotKidsKenya/courses/:courseId/exams/:examId/publish', async (req, res) => {
  try {
    const { courseId, examId } = req.params;
    const { scheduledAt } = req.body; // optional override

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const exam = course.exams.id(examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    exam.scheduledAt = scheduledAt ? new Date(scheduledAt) : new Date();
    exam.status = 'published';
    await course.save();
    return res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error('Error publishing exam:', error);
    return res.status(500).json({ success: false, error: 'Server error while publishing exam' });
  }
});

// ===== END EXAMS ROUTES ===== //


// student Login
// Add this to your server.js or routes file
  app.post('/cobotKidsKenya/students/login', async (req, res) => {
    try {
      const { userName, password } = req.body;
      console.log('Login attempt for:', userName);

      // 1. Input validation
      if (!userName || !password) {
        console.log('Missing credentials');
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }

      // 2. Username format validation
      const usernameRegex = /^[a-z]{3}-[a-z]+\.[a-z]+$/;
      if (!usernameRegex.test(userName)) {
        console.log('Invalid username format:', userName);
        return res.status(400).json({ 
          success: false,
          error: 'Username must follow schoolcode-firstname.lastname format (e.g., sra-james.smith)'
        });
      }

      // 3. Extract parts from username
      const [schoolCode, names] = userName.split('-');
      const [firstName, lastName] = names.split('.');
      const schoolCodeUpper = schoolCode.toUpperCase();

      console.log(`Parsed details - School: ${schoolCodeUpper}, Student: ${firstName} ${lastName}`);

      // 4. Find school
      const school = await School.findOne({ code: schoolCodeUpper });
      if (!school) {
        console.log(`School not found with code: ${schoolCodeUpper}`);
        return res.status(404).json({ 
          success: false,
          error: 'School not found. Please check your username.' 
        });
      }

      console.log(`Found school: ${school.name} (${school.code})`);

      // 5. Find student in classes
      let student = null;
      let foundClass = null;

      for (const classroom of school.classes) {
        student = classroom.students.find(s => {
          const match = s.fname.toLowerCase() === firstName.toLowerCase() && 
                      s.lname.toLowerCase() === lastName.toLowerCase();
          if (match) console.log('Found matching student:', s);
          return match;
        });

        if (student) {
          foundClass = classroom;
          console.log(`Student found in class: ${classroom.name}`);
          break;
        }
      }

      if (!student) {
        console.log(`Student ${firstName} ${lastName} not found in any classes`);
        return res.status(404).json({ 
          success: false,
          error: 'Student not found. Please check your username.'
        });
      }

      // 6. Password verification
      if (password !== '1234') {
        console.log('Password does not match');
        return res.status(401).json({ 
          success: false,
          error: 'Invalid pas@@sword' 
        });
      }

      // 7. Create JWT token (ensure JWT_SECRET is set)
      if (!process.env.JWT_SECRET) {
        console.warn('Warning: Using development JWT secret');
        process.env.JWT_SECRET = 'development-secret-please-change-in-production';
      }

      const token = jwt.sign(
        {
          id: student._id,
          school: school.code,
          role: 'student',
          class: foundClass.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 8. Prepare response
      const responseData = {
        success: true,
        data: {
          student: {
            id: student._id,
            fname: student.fname,
            lname: student.lname,
            username: `${schoolCode}-${student.fname.toLowerCase()}.${student.lname.toLowerCase()}`,
            points: student.points || 0
          },
          school: {
            id: school._id,
            code: school.code,
            name: school.name
          },
          class: {
            id: foundClass._id,
            name: foundClass.name,
            level: foundClass.level
          },
          token
        }
      };

      console.log('Login successful for:', responseData.data.student.username);
      return res.status(200).json(responseData);

    } catch (error) {
      console.error('SERVER ERROR:', {
        message: error.message,
        stack: error.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      });
      
      return res.status(500).json({ 
        success: false,
        error: 'Internal server er##ror',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
























































  

// GET endpoint for fetching individual student profile data
app.get('/cobotKidsKenya/students/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log(`Fetching student with ID: ${studentId}`);

        // 1. Validate studentId
        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid student ID format'
            });
        }

        // 2. Search all schools for the student
        const schools = await School.find({
            'classes.students._id': studentId
        }).lean();

        // 3. Find the specific student
        let foundStudent = null;
        let foundClass = null;
        let foundSchool = null;

        for (const school of schools) {
            for (const classroom of school.classes) {
                const student = classroom.students.find(s => s._id.toString() === studentId);
                if (student) {
                    foundStudent = student;
                    foundClass = classroom;
                    foundSchool = school;
                    break;
                }
            }
            if (foundStudent) break;
        }

        // 4. Handle student not found
        if (!foundStudent) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // 5. Prepare response
        const responseData = {
            success: true,
            student: {
                ...foundStudent,
                className: foundClass.name,
                schoolName: foundSchool.name
            }
        };

        console.log(`Successfully fetched student: ${foundStudent.fname} ${foundStudent.lname}`);
        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching student:', {
            message: error.message,
            stack: error.stack
        });
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});










// ===== TUTOR ROUTES ===== //

// GET all tutors
app.get('/cobotKidsKenya/tutors', async (req, res) => {
  try {
    const Tutor = require('./models/Tutor');
    const tutors = await Tutor.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tutors
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching tutors' 
    });
  }
});

// GET single tutor
app.get('/cobotKidsKenya/tutors/:id', async (req, res) => {
  try {
    const Tutor = require('./models/Tutor');
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid tutor ID format' 
      });
    }

    const tutor = await Tutor.findById(id);
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
      error: 'Server error while fetching tutor' 
    });
  }
});

// POST - Create new tutor
app.post('/cobotKidsKenya/tutors', async (req, res) => {
  try {
    const Tutor = require('./models/Tutor');
    const { company, fname, lname, username, password, status } = req.body;

    // Validate required fields
    if (!company || !fname || !lname) {
      return res.status(400).json({ 
        success: false,
        error: 'Company, first name, and last name are required' 
      });
    }

    // Check if username already exists
    if (username) {
      const existingTutor = await Tutor.findOne({ username });
      if (existingTutor) {
        return res.status(400).json({ 
          success: false,
          error: 'Username already exists' 
        });
      }
    }

    const tutor = new Tutor({
      company: company.trim(),
      fname: fname.trim(),
      lname: lname.trim(),
      username: username ? username.trim() : undefined,
      password: password || 'cobotkids2025',
      status: status || 'pending',
      assignments: []
    });

    await tutor.save();
    res.status(201).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error creating tutor:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ 
        success: false,
        error: messages.join(', ') 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Server error while creating tutor' 
      });
    }
  }
});

// PUT - Update tutor
app.put('/cobotKidsKenya/tutors/:id', async (req, res) => {
  try {
    const Tutor = require('./models/Tutor');
    const { id } = req.params;
    const { company, fname, lname, username, password, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid tutor ID format' 
      });
    }

    // Check if username already exists (if being updated)
    if (username) {
      const existingTutor = await Tutor.findOne({ username, _id: { $ne: id } });
      if (existingTutor) {
        return res.status(400).json({ 
          success: false,
          error: 'Username already exists' 
        });
      }
    }

    const updates = {};
    if (company) updates.company = company.trim();
    if (fname) updates.fname = fname.trim();
    if (lname) updates.lname = lname.trim();
    if (username) updates.username = username.trim();
    if (password) updates.password = password;
    if (status) updates.status = status;

    const tutor = await Tutor.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

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
    console.error('Error updating tutor:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ 
        success: false,
        error: messages.join(', ') 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Server error while updating tutor' 
      });
    }
  }
});

// DELETE - Delete tutor
app.delete('/cobotKidsKenya/tutors/:id', async (req, res) => {
  try {
    const Tutor = require('./models/Tutor');
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid tutor ID format' 
      });
    }

    const tutor = await Tutor.findByIdAndDelete(id);
    if (!tutor) {
      return res.status(404).json({ 
        success: false,
        error: 'Tutor not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tutor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting tutor' 
    });
  }
});

// ===== END TUTOR ROUTES ===== //

// ===== TUTOR ASSIGNMENTS ===== //

// Get tutor assignments (with school and class names resolved)
app.get('/cobotKidsKenya/tutors/:tutorId/assignments', async (req, res) => {
  try {
    const { tutorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({ success: false, error: 'Invalid tutor ID format' });
    }
    const Tutor = require('./models/Tutor');
    const tutor = await Tutor.findById(tutorId).lean();
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });

    // Resolve school and class names
    const schoolIds = (tutor.assignments || []).map(a => a.school);
    const schools = await School.find({ _id: { $in: schoolIds } }).lean();
    const schoolMap = new Map(schools.map(s => [String(s._id), s]));

    const result = (tutor.assignments || []).map(a => {
      const s = schoolMap.get(String(a.school));
      const classInfos = (a.classes || []).map(c => {
        // Classes are embedded in School model; find by _id
        const cls = s?.classes?.find(cl => String(cl._id) === String(c.class));
        return {
          classId: c.class,
          className: cls?.name,
          level: cls?.level,
          isActive: c.isActive
        };
      });
      return {
        schoolId: a.school,
        schoolName: s?.name,
        schoolCode: s?.code,
        classes: classInfos
      };
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ success: false, error: 'Server error while fetching assignments' });
  }
});

// Assign tutor to a school and class
app.post('/cobotKidsKenya/tutors/:tutorId/assign', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { schoolId, classId, assignedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tutorId) || !mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ success: false, error: 'Invalid tutor/school/class ID format' });
    }

    // Validate school and class exist
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    const classDoc = school.classes.id(classId);
    if (!classDoc) return res.status(404).json({ success: false, error: 'Class not found' });

    const Tutor = require('./models/Tutor');
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });

    // Ensure assignments array exists
    if (!Array.isArray(tutor.assignments)) tutor.assignments = [];

    // Find existing assignment by school
    const existing = tutor.assignments.find(a => String(a.school) === String(schoolId));
    const defaultAssignedBy = assignedBy && mongoose.Types.ObjectId.isValid(assignedBy)
      ? assignedBy
      : new mongoose.Types.ObjectId();

    if (existing) {
      // Add class if not present
      const hasClass = (existing.classes || []).some(c => String(c.class) === String(classId));
      if (!hasClass) {
        existing.classes.push({ class: classId, isActive: true });
      }
    } else {
      tutor.assignments.push({
        school: schoolId,
        classes: [{ class: classId, isActive: true }],
        assignedBy: defaultAssignedBy,
        assignedAt: new Date()
      });
    }

    await tutor.save();

    return res.status(200).json({ success: true, message: 'Tutor assigned successfully' });
  } catch (error) {
    console.error('Error assigning tutor:', error);
    return res.status(500).json({ success: false, error: 'Server error while assigning tutor' });
  }
});

// Remove tutor from a class in a school
app.delete('/cobotKidsKenya/tutors/:tutorId/assignments/:schoolId/classes/:classId', async (req, res) => {
  try {
    const { tutorId, schoolId, classId } = req.params;
    if (![tutorId, schoolId, classId].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    const Tutor = require('./models/Tutor');
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });

    const assignment = tutor.assignments.find(a => String(a.school) === String(schoolId));
    if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found for school' });

    assignment.classes = (assignment.classes || []).filter(c => String(c.class) !== String(classId));
    if (assignment.classes.length === 0) {
      tutor.assignments = tutor.assignments.filter(a => String(a.school) !== String(schoolId));
    }

    await tutor.save();
    return res.status(200).json({ success: true, message: 'Assignment removed' });
  } catch (error) {
    console.error('Error removing assignment:', error);
    return res.status(500).json({ success: false, error: 'Server error while removing assignment' });
  }
});


// Get all classes with their codes and details
app.get('/cobotKidsKenya/classCodes', async (req, res) => {
  try {
    const schools = await School.find({}).populate({
      path: 'classes.tutor',
      select: 'fname lname username email'
    });
    
    const classData = [];
    
    schools.forEach(school => {
      school.classes.forEach(cls => {
        const classInfo = {
          _id: cls._id,
          name: cls.name,
          level: cls.level,
          schoolId: school._id,
          schoolName: school.name,
          schoolCode: school.code,
          tutor: cls.tutor ? {
            name: `${cls.tutor.fname} ${cls.tutor.lname}`,
            username: cls.tutor.username
          } : null,
          courses: cls.courses || [],
          schedule: cls.schedule || {},
          classCodes: cls.classCodes || [],
          currentClassCode: cls.currentClassCode || null,
          studentsCount: cls.students ? cls.students.length : 0
        };
        classData.push(classInfo);
      });
    });
    
    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    console.error('Error fetching class codes:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching class codes' });
  }
});

// Generate class code for a specific class
app.post('/cobotKidsKenya/schools/:schoolId/classes/:classId/generateCode', async (req, res) => {
  try {
    const { schoolId, classId } = req.params;
    const { generatedBy } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ success: false, error: 'Invalid school or class ID' });
    }
    
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    
    const classDoc = school.classes.id(classId);
    if (!classDoc) return res.status(404).json({ success: false, error: 'Class not found' });
    
    // Generate 3-digit code
    const generateCode = () => {
      return Math.floor(100 + Math.random() * 900).toString();
    };
    
    let code;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
      if (attempts > 10) {
        return res.status(500).json({ success: false, error: 'Unable to generate unique code' });
      }
    } while (await School.findOne({ 'classes.classCodes.code': code }));
    
    // Set validity (24 hours from now)
    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Generate unique lesson ID (date + class ID + random)
    const lessonId = `${now.toISOString().split('T')[0]}-${classId}-${Math.random().toString(36).substr(2, 5)}`;
    
    const classCode = {
      code,
      status: 'active',
      validFrom: now,
      validUntil,
      generatedBy: generatedBy || new mongoose.Types.ObjectId(),
      generatedAt: now,
      activatedAt: now,
      lessonDate: now,
      lessonId
    };
    
    // Add the new code to the classCodes array
    if (!classDoc.classCodes) {
      classDoc.classCodes = [];
    }
    classDoc.classCodes.push(classCode);
    
    await school.save();
    
    res.status(200).json({ 
      success: true, 
      data: classCode,
      message: 'Class code generated successfully' 
    });
  } catch (error) {
    console.error('Error generating class code:', error);
    res.status(500).json({ success: false, error: 'Server error while generating class code' });
  }
});

// Activate/Deactivate class code
app.put('/cobotKidsKenya/schools/:schoolId/classes/:classId/classCode/:codeId/status', async (req, res) => {
  try {
    const { schoolId, classId, codeId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ success: false, error: 'Invalid school or class ID' });
    }
    
    if (!['active', 'inactive', 'expired'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    
    const classDoc = school.classes.id(classId);
    if (!classDoc) return res.status(404).json({ success: false, error: 'Class not found' });
    
    if (!classDoc.classCodes || classDoc.classCodes.length === 0) {
      return res.status(404).json({ success: false, error: 'No class codes found for this class' });
    }
    
    // Find the specific class code by lessonId
    const classCode = classDoc.classCodes.find(code => code.lessonId === codeId);
    if (!classCode) {
      return res.status(404).json({ success: false, error: 'Class code not found' });
    }
    
    classCode.status = status;
    
    if (status === 'active') {
      classCode.activatedAt = new Date();
      classCode.deactivatedAt = null;
    } else if (status === 'inactive') {
      classCode.deactivatedAt = new Date();
    }
    
    await school.save();
    
    res.status(200).json({ 
      success: true, 
      data: classCode,
      message: `Class code ${status}` 
    });
  } catch (error) {
    console.error('Error updating class code status:', error);
    res.status(500).json({ success: false, error: 'Server error while updating class code status' });
  }
});

// Auto-expire class codes (this would typically be a cron job)
app.post('/cobotKidsKenya/expireClassCodes', async (req, res) => {
  try {
    const now = new Date();
    const schools = await School.find({});
    
    let expiredCount = 0;
    
    for (const school of schools) {
      for (const cls of school.classes) {
        if (cls.currentClassCode && 
            cls.currentClassCode.status === 'active' && 
            cls.currentClassCode.validUntil < now) {
          cls.currentClassCode.status = 'expired';
          expiredCount++;
        }
      }
      await school.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: `${expiredCount} class codes expired`,
      expiredCount 
    });
  } catch (error) {
    console.error('Error expiring class codes:', error);
    res.status(500).json({ success: false, error: 'Server error while expiring class codes' });
  }
});

// Verify class code for student access
app.post('/cobotKidsKenya/verifyClassCode', async (req, res) => {
  try {
    const { classCode, courseId, studentId } = req.body;
    
    if (!classCode || !courseId || !studentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Class code, course ID, and student ID are required' 
      });
    }

    // Find a school with an active class code matching the provided code
    const school = await School.findOne({
      'classes.classCodes': {
        $elemMatch: {
          code: classCode,
          status: 'active',
          validUntil: { $gt: new Date() }
        }
      }
    });

    if (!school) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid or expired class code' 
      });
    }

    // Find the specific class with this code
    const classWithCode = school.classes.find(cls => 
      cls.classCodes && cls.classCodes.some(code => 
        code.code === classCode && 
        code.status === 'active' && 
        new Date(code.validUntil) > new Date()
      )
    );

    if (!classWithCode) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid class code' 
      });
    }

    // Verify the student is in this class
    const studentInClass = classWithCode.students.find(student => 
      student._id.toString() === studentId
    );

    if (!studentInClass) {
      return res.status(403).json({ 
        success: false, 
        error: 'You are not enrolled in this class' 
      });
    }

    // Check if the course is assigned to this class
    const courseAssigned = classWithCode.courses.find(course => 
      course.course.toString() === courseId
    );

    if (!courseAssigned) {
      return res.status(403).json({ 
        success: false, 
        error: 'This course is not assigned to your class' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Class code verified successfully',
      data: {
        schoolId: school._id,
        classId: classWithCode._id,
        className: classWithCode.name,
        schoolName: school.name
      }
    });
  } catch (error) {
    console.error('Error verifying class code:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while verifying class code' 
    });
  }
});

// Server Start
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});