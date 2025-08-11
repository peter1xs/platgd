const mongoose = require('mongoose');

// ================== QUESTION SCHEMA ==================
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'file_upload'],
    default: 'multiple_choice'
  },
  options: [{
    text: { type: String, trim: true },
    isCorrect: { type: Boolean, default: false }
  }],
  correctAnswer: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be at least 1'],
    default: 1
  },
  explanation: {
    type: String,
    trim: true
  },
  required: {
    type: Boolean,
    default: true
  }
}, { _id: true, timestamps: true });

// ================== SUBMISSION SCHEMA ==================
const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: {
      type: String,
      trim: true
    },
    selectedOptions: [{
      type: Number
    }],
    fileUploads: [{
      fileName: String,
      fileUrl: String,
      fileType: String
    }],
    isCorrect: {
      type: Boolean,
      default: false
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    feedback: {
      type: String,
      trim: true
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['submitted', 'late', 'graded', 'overdue'],
    default: 'submitted'
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor'
  },
  gradedAt: {
    type: Date,
    default: null
  },
  feedback: {
    type: String,
    trim: true
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  }
}, { _id: true, timestamps: true });

// ================== MAIN ASSIGNMENT SCHEMA ==================
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schools',
    required: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  totalPoints: {
    type: Number,
    required: [true, 'Total points is required'],
    min: [1, 'Total points must be at least 1']
  },
  instructions: {
    type: String,
    trim: true
  },
  questions: [questionSchema],
  submissions: [submissionSchema],
  attachments: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'document', 'image', 'link'],
      default: 'document'
    },
    url: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: [1, 'Max attempts must be at least 1']
  },
  autoGrade: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
assignmentSchema.index({ tutor: 1, dueDate: 1 });
assignmentSchema.index({ class: 1, status: 1 });
assignmentSchema.index({ school: 1, subject: 1 });
assignmentSchema.index({ course: 1, topic: 1 });

// Virtual for submission count
assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for graded count
assignmentSchema.virtual('gradedCount').get(function() {
  return this.submissions.filter(s => s.status === 'graded').length;
});

// Virtual for average grade
assignmentSchema.virtual('averageGrade').get(function() {
  const gradedSubmissions = this.submissions.filter(s => s.status === 'graded');
  if (gradedSubmissions.length === 0) return 0;
  
  const totalGrade = gradedSubmissions.reduce((sum, submission) => sum + submission.percentage, 0);
  return Math.round(totalGrade / gradedSubmissions.length);
});

// Virtual for completion rate
assignmentSchema.virtual('completionRate').get(function() {
  if (this.submissions.length === 0) return 0;
  return Math.round((this.submissions.length / this.class?.students?.length || 1) * 100);
});

// Method to check if assignment is overdue
assignmentSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'archived';
};

// Method to calculate total points
assignmentSchema.methods.calculateTotalPoints = function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
};

// Method to auto-grade submission
assignmentSchema.methods.autoGradeSubmission = function(submission) {
  let totalScore = 0;
  let totalPoints = 0;

  submission.answers.forEach(answer => {
    const question = this.questions.id(answer.question);
    if (question) {
      totalPoints += question.points;
      
      if (question.questionType === 'multiple_choice') {
        const correctOptions = question.options
          .map((option, index) => ({ ...option, index }))
          .filter(option => option.isCorrect)
          .map(option => option.index);
        
        const selectedOptions = answer.selectedOptions || [];
        const isCorrect = correctOptions.length === selectedOptions.length &&
          correctOptions.every(option => selectedOptions.includes(option));
        
        answer.isCorrect = isCorrect;
        answer.pointsEarned = isCorrect ? question.points : 0;
        totalScore += answer.pointsEarned;
      } else if (question.questionType === 'true_false') {
        const isCorrect = answer.answer === question.correctAnswer;
        answer.isCorrect = isCorrect;
        answer.pointsEarned = isCorrect ? question.points : 0;
        totalScore += answer.pointsEarned;
      } else {
        // For essay, short_answer, file_upload - manual grading required
        answer.pointsEarned = 0;
      }
    }
  });

  submission.totalScore = totalScore;
  submission.percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
  
  return submission;
};

module.exports = mongoose.model('Assignment', assignmentSchema);

