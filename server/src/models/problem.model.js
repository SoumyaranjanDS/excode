import mongoose from "mongoose";

const problemSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  description: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ['HTML', 'CSS', 'JS', 'MIX', 'REACT'],
    default: 'REACT'
  },
  starterCode: { 
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" },
    react: { type: String, default: "" }
  },
  hiddenCode: {
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" }
  },
  hints: { 
    type: [String], 
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3']
  },
  expectedOutput: { 
    type: String, 
    required: true 
  },
  instructionPrompt: {
    type: String,
    required: true,
    // This is the secret rubric containing context, test cases, and constraints for the AI Evaluator
  },
  xp: {
    type: Number,
    default: 50
  },
  timeEstimation: {
    type: String,
    default: "10m"
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 3;
}

export const Problem = mongoose.model("Problem", problemSchema);
