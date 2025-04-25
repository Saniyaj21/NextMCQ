import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: {
    type: Number,
    min: 0
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  answers: [AnswerSchema],
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index for finding user attempts for a specific test
AttemptSchema.index({ userId: 1, testId: 1 });

export default mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema); 