import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    public_id: String,
    url: String
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true
  },
  image: {
    public_id: String,
    url: String
  },
  options: {
    type: [OptionSchema],
    validate: {
      validator: function(options) {
        // Must have at least 2 options and at least one must be correct
        return options.length >= 2 && options.some(option => option.isCorrect);
      },
      message: 'Questions must have at least 2 options and 1 correct answer'
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  marks: {
    type: Number,
    default: 1,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create index for finding questions by test
QuestionSchema.index({ testId: 1 });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema); 