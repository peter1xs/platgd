const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  company: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { 
    type: String, 
    unique: true,
    default: function() {
      return `${this.fname.toLowerCase()}.${this.lname.toLowerCase()}@${this.company.toLowerCase()}`;
    }
  },
  password: { type: String, default: 'cobotkids2025', select: false },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'], 
    default: 'pending' 
  },
  // ===== TUTOR ASSIGNMENTS =====
  assignments: [{
    school: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'School', 
      required: true 
    },
    classes: [{
      class: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class',
        required: true 
      },
      courses: [{  // Specific courses they teach in this class
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }],
      startDate: { type: Date, default: Date.now },
      endDate: Date,
      isActive: { type: Boolean, default: true }
    }],
    assignedBy: {  // Admin who made the assignment
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedAt: { type: Date, default: Date.now }
  }],
  // ===== ACCESS CONTROL =====
  permissions: {
    canCreateExams: { type: Boolean, default: false },
    canGradeSubmissions: { type: Boolean, default: true },
    canGenerateReports: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-update timestamp
tutorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ===== VIRTUALS FOR QUERY CONVENIENCE =====
tutorSchema.virtual('activeAssignments').get(function() {
  return this.assignments.filter(a => 
    a.classes.some(c => c.isActive) && 
    this.status === 'active'
  );
});

tutorSchema.virtual('assignedSchools', {
  ref: 'School',
  localField: 'assignments.school',
  foreignField: '_id',
  justOne: false
});

// ===== METHODS =====
tutorSchema.methods.isAssignedTo = function(classId) {
  return this.assignments.some(a => 
    a.classes.some(c => c.class.equals(classId) && c.isActive)
  );
};

tutorSchema.methods.getAssignedCourses = function() {
  const courses = new Set();
  this.assignments.forEach(a => {
    a.classes.forEach(c => {
      c.courses.forEach(courseId => courses.add(courseId));
    });
  });
  return Array.from(courses);
};

module.exports = mongoose.model('Tutor', tutorSchema);