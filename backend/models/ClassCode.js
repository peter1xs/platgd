const mongoose = require('mongoose');

const classCodeSchema = new mongoose.Schema({
  // Required fields
  code: {
    type: String,
    required: [true, '3-digit code is required'],
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^\d{3}$/.test(v),
      message: 'Code must be a 3-digit number (100-999)'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'expired', 'revoked'],
    default: 'active'
  },
  lessonId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Timestamps
  generatedAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > this.validFrom;
      },
      message: 'Expiration must be after activation'
    }
  },
  activatedAt: Date,
  deactivatedAt: Date,

  // References
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Metadata
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster querying
classCodeSchema.index({ code: 1, status: 1 });
classCodeSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

// Virtual for checking if code is active
classCodeSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.validUntil > new Date();
});

// Pre-save hook to generate lessonId
classCodeSchema.pre('save', function(next) {
  if (!this.lessonId) {
    this.lessonId = `${this.class}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
  next();
});

const ClassCode = mongoose.model('ClassCode', classCodeSchema);
module.exports = ClassCode;