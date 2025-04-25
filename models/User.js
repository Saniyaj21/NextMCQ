import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  }, 
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  profileImage: {
    public_id: String,
    url: String
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  xpPoints: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate referral code before saving
UserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    // Generate a unique referral code (combination of user id and random string)
    this.referralCode = this._id.toString().substr(-6) + 
                        Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 