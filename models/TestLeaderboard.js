import mongoose from 'mongoose';

const TestLeaderboardEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  xp: { type: Number, required: true },
  coins: { type: Number, required: true },
  position: { type: Number, required: true }
}, { _id: false });

const TestLeaderboardSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, unique: true },
  data: [TestLeaderboardEntrySchema],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.TestLeaderboard || mongoose.model('TestLeaderboard', TestLeaderboardSchema); 