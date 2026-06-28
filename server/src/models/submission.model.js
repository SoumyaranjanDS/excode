import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timeComplexity: {
    type: String,
    default: 'O(1)'
  },
  spaceComplexity: {
    type: String,
    default: 'O(1)'
  },
  status: {
    type: String,
    enum: ['PASS', 'FAIL'],
    default: 'PASS'
  },
  firstPassedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// A user should only have one latest submission per problem, or we can just track the latest
// For simplicity, we can use an index to find the latest
submissionSchema.index({ userId: 1, problemId: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
