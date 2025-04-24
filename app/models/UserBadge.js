import mongoose from 'mongoose';

const UserBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index for unique user-badge pairs
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default mongoose.models.UserBadge || mongoose.model('UserBadge', UserBadgeSchema); 