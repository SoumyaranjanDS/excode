import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth
  avatar: { type: String, required: false },
  firebaseUid: { type: String, required: false, unique: true, sparse: true },
  authProvider: { type: String, required: false, default: "local" },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
