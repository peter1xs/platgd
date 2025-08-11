const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    default: '1234',
    minlength: [4, 'Password must be at least 4 characters'],
    select: false
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schools',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes',
    required: true
  },
  grade: {
    type: String,
    enum: ['Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated'],
    default: 'active'
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  profileImage: {
    type: String,
    default: null
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  medicalInfo: {
    allergies: [String],
    conditions: [String],
    medications: [String],
    notes: String
  },
  academicInfo: {
    gpa: {
      type: Number,
      min: [0, 'GPA cannot be negative'],
      max: [4, 'GPA cannot exceed 4.0']
    },
    attendanceRate: {
      type: Number,
      min: [0, 'Attendance rate cannot be negative'],
      max: [100, 'Attendance rate cannot exceed 100']
    },
    lastGradeReport: {
      type: Date,
      default: null
    }
  },
  preferences: {
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual'
    },
    subjects: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate username if not provided
studentSchema.pre('save', function(next) {
  if (!this.username) {
    const schoolCode = this.school ? this.school.code : 'SCH';
    this.username = `${schoolCode}-${this.fname.toLowerCase()}.${this.lname.toLowerCase()}`;
  }
  next();
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.fname} ${this.lname}`;
});

// Virtual for age
studentSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for attendance rate
studentSchema.virtual('attendanceRate').get(function() {
  return this.academicInfo.attendanceRate || 0;
});

// Indexes for efficient queries
studentSchema.index({ school: 1, class: 1 });
studentSchema.index({ username: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model('Student', studentSchema);

