const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
    required: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'multiple_choice' || this.type === 'true_false';
    }
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be at least 1']
  },
  explanation: {
    type: String,
    trim: true
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true
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
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    required: true,
    min: [1, 'Total points must be at least 1']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: [1, 'Duration must be at least 1 minute']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    trim: true
  },
  status: {
   type: String,
  enum: ['draft', 'published', 'active', 'completed', 'archived', 'pending'],
  default: 'draft'
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date,
      default: null
    },
    answers: [{
      questionIndex: {
        type: Number,
        required: true
      },
      answer: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      pointsEarned: {
        type: Number,
        default: 0
      },
      feedback: String
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
      default: 'F'
    },
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'graded'],
      default: 'in_progress'
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor'
    },
    gradedAt: {
      type: Date,
      default: null
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    }
  }],
  settings: {
    allowRetake: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    requirePassword: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      select: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
examSchema.index({ tutor: 1, startDate: 1 });
examSchema.index({ class: 1, status: 1 });
examSchema.index({ school: 1, subject: 1 });

// Virtual for submission count
examSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for completed submissions
examSchema.virtual('completedCount').get(function() {
  return this.submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
});

// Virtual for average score
examSchema.virtual('averageScore').get(function() {
  const completedSubmissions = this.submissions.filter(s => s.status === 'graded');
  if (completedSubmissions.length === 0) return 0;
  
  const totalScore = completedSubmissions.reduce((sum, submission) => sum + submission.totalScore, 0);
  return Math.round(totalScore / completedSubmissions.length);
});

// Virtual for average percentage
examSchema.virtual('averagePercentage').get(function() {
  const completedSubmissions = this.submissions.filter(s => s.status === 'graded');
  if (completedSubmissions.length === 0) return 0;
  
  const totalPercentage = completedSubmissions.reduce((sum, submission) => sum + submission.percentage, 0);
  return Math.round(totalPercentage / completedSubmissions.length);
});

// Method to calculate grade based on percentage
examSchema.methods.calculateGrade = function(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Method to check if exam is active
examSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Exam', examSchema);

