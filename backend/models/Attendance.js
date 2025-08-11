const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent'],
    default: 'Present',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  classCodeUsed: {
    type: String,
    required: false
  },
  lessonId: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
