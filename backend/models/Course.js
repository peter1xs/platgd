const mongoose = require('mongoose');

// ================== BASE SCHEMAS ==================
const noteImageSchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true, 
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  caption: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    trim: true, 
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: [10, 'Content must be at least 10 characters']
  },
  images: {
    type: [noteImageSchema],
    validate: {
      validator: function(v) {
        return v.length <= 10; // Max 10 images per note
      },
      message: 'Cannot have more than 10 images per note'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// ================== QUIZ/QUESTION SCHEMAS ==================
const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 4; // Strictly 4 options
      },
      message: 'Exactly 4 options required'
    }
  },
  correctAnswer: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return this.options.includes(v); // Must match one of the options
      },
      message: 'Correct answer must be one of the options'
    }
  },
  points: { type: Number, default: 1 }
});

// ================== ATTEMPT SCHEMAS ==================
const autoGradedAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answers: [{ 
    type: String,
    validate: {
      validator: function(v) {
        const question = this.parent().parent().questions[this.path.match(/\[(\d+)\]/)[1]];
        return question.options.includes(v); // Answer must be one of the options
      },
      message: 'Invalid answer: Not in question options'
    }
  }],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  // Auto-graded fields (no tutor needed)
  isAutoGraded: { type: Boolean, default: true },
  correctAnswers: { type: [String] } // For review
}, { 
  timestamps: true,
  methods: {
    calculateScore() {
      const assignment = this.parent();
      this.score = this.answers.reduce((total, answer, index) => {
        return total + (answer === assignment.questions[index].correctAnswer ? 
               assignment.questions[index].points : 0);
      }, 0);
      return this.score;
    }
  }
});

// ================== COURSEWORK SCHEMA ==================
const courseworkSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  submittedAt: { type: Date, default: Date.now }
});

// ================== TOPIC SCHEMA ==================
const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  notes: [noteSchema],
  coursework: [courseworkSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ================== ASSIGNMENT SCHEMA ==================
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, required: true },
  questions: {
    type: [quizQuestionSchema],
    validate: {
      validator: function(v) {
        return v.length > 0; // At least one question
      },
      message: 'At least one question is required'
    }
  },
  attempts: [autoGradedAttemptSchema],
  scheduledAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'draft', 'published', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  totalPoints: { type: Number, default: 0 },
  duration: { type: Number, default: 60 }, // in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ================== EXAM SCHEMA ==================
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, uppercase: true },
  questions: [quizQuestionSchema],
  scheduledAt: { type: Date },
  status: {
      type: String,
      enum: ['draft', 'published', 'active', 'completed', 'archived', 'pending'],
      default: 'draft'
  },
  totalPoints: { type: Number, default: 0 },
  duration: { type: Number, default: 60 }, // in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Attempts represent students joining/starting/submitting an exam
  attempts: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['registered', 'in_progress', 'submitted', 'graded'], default: 'registered' },
    registeredAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    submittedAt: { type: Date },
    timeSpent: { type: Number, default: 0 }, // in minutes
    answers: [{
      questionIndex: { type: Number, required: true },
      answer: { type: String, default: '' },
      isCorrect: { type: Boolean, default: false },
      pointsEarned: { type: Number, default: 0 },
      feedback: { type: String, default: '' }
    }],
    totalScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], default: 'F' }
  }]
});

// ================== MAIN COURSE SCHEMA ==================
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  code: { type: String, unique: true, uppercase: true },
  status: { 
    type: String, 
    enum: ['enrolled', 'locked', 'completed'], 
    default: 'locked' 
  },
  courseIcon: { type: String, required: true, trim: true },
  courseLink: { type: String, trim: true },
 topics: [{
    name: { type: String, required: true, trim: true },
    notes: [noteSchema],
 }],
  assignments: [assignmentSchema],
  exams: [examSchema],
  reports: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    assignmentScores: [{
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
      score: { type: Number }
    }],
    examScores: [{
      exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
      score: { type: Number }
    }],
    totalScore: { type: Number, default: 0 }
  }],
  certificates: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateUrl: { type: String, required: true }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total topics count
courseSchema.virtual('topicsCount').get(function() {
  return this.topics.length;
});

// Virtual for total notes count
courseSchema.virtual('notesCount').get(function() {
  return this.topics.reduce((total, topic) => total + (topic.notes?.length || 0), 0);
});

// Virtual for total assignments count
courseSchema.virtual('assignmentsCount').get(function() {
  return this.assignments.length;
});

// Virtual for total exams count
courseSchema.virtual('examsCount').get(function() {
  return this.exams.length;
});

// Pre-save middleware to update timestamps
courseSchema.pre('save', function(next) {
  const now = new Date();
  
  // Update course timestamps
  this.updatedAt = now;
  
  // Update topic timestamps
  if (this.topics) {
    this.topics.forEach(topic => {
      topic.updatedAt = now;
      
      // Update note timestamps
      if (topic.notes) {
        topic.notes.forEach(note => {
          note.updatedAt = now;
        });
      }
    });
  }
  
  next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;  