import mongoose from 'mongoose';

const LeaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  position: {
    type: Number,
    required: true
  }
}, { _id: false });

const LeaderboardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['global', 'subject', 'test'],
    required: true
  },
  subject: {
    type: String,
    required: function() {
      return this.type === 'subject';
    }
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: function() {
      return this.type === 'test';
    }
  },
  data: {
    type: [LeaderboardEntrySchema],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound indexes for different leaderboard types
LeaderboardSchema.index({ type: 1, subject: 1 });
LeaderboardSchema.index({ type: 1, testId: 1 });

export default mongoose.models.Leaderboard || mongoose.model('Leaderboard', LeaderboardSchema); 