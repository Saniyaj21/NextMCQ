import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  rewardGiven: {
    type: Boolean,
    default: false
  },
  rewardAmount: {
    type: Number,
    default: 50 // Default XP reward amount
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for finding referrals by users
ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ referredId: 1 });

export default mongoose.models.Referral || mongoose.model('Referral', ReferralSchema); 