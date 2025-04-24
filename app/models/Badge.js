import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a badge name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a badge description'],
    trim: true
  },
  image: {
    public_id: String,
    url: String
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.Badge || mongoose.model('Badge', BadgeSchema); 