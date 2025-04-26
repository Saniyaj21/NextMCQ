import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
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
  // Currency System
  coins: {
    type: Number,
    default: 500 // Welcome bonus
  },
  xpPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Achievements & Stats
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },

  // Activity Tracking
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

// Update streak method
UserSchema.methods.updateStreak = async function() {
  const now = new Date();
  const lastActive = this.streak.lastActive;
  const daysSinceLastActive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

  if (daysSinceLastActive === 0) {
    // Already active today, no change needed
    return this;
  } else if (daysSinceLastActive === 1) {
    // Consecutive day, increase streak
    this.streak.current++;
    if (this.streak.current > this.streak.longest) {
      this.streak.longest = this.streak.current;
    }
  } else {
    // Streak broken
    this.streak.current = 1;
  }
  
  this.streak.lastActive = now;
  this.lastActive = now;
  return this.save();
};

// Calculate level method
UserSchema.methods.calculateLevel = async function() {
  const baseXP = 100; // XP needed for first level
  const multiplier = 1.5; // XP multiplier for each level
  
  let xpNeeded = baseXP;
  let newLevel = 1;
  let remainingXP = this.xpPoints;
  
  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    newLevel++;
    xpNeeded = Math.floor(baseXP * Math.pow(multiplier, newLevel - 1));
  }
  
  if (newLevel !== this.level) {
    this.level = newLevel;
    await this.save();
  }
  
  return this;
};



// Make sure we're not recreating the model if it already exists
export default mongoose.models.User || mongoose.model('User', UserSchema); 