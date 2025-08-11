import mongoose from 'mongoose';

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
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Password must be at least 4 characters'],
    select: false // Never return password in queries
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schools',
    required: [true, 'School reference is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schools',
    required: [true, 'Class reference is required']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate username before saving
studentSchema.pre('save', function(next) {
  if (!this.username) {
    this.username = `${this.schoolCode.toLowerCase()}-${this.fname.toLowerCase()}.${this.lname.toLowerCase()}`;
  }
  next();
});

// Indexes for better query performance
studentSchema.index({ school: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ username: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;