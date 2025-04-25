import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true
  },
  chapter: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeLimit: {
    type: Number,
    default: 60, // 60 minutes default
    min: 5,
    max: 180
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true // Only enforce uniqueness if field exists
  },
  attemptsCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate invite code for private tests
TestSchema.pre('save', function(next) {
  if (!this.isPublic && !this.inviteCode) {
    // Generate a unique invite code
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Create index for finding tests by creator and public status
TestSchema.index({ creator: 1, isPublic: 1 });

export default mongoose.models.Test || mongoose.model('Test', TestSchema); 