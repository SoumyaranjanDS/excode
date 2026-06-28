import { User } from "../models/user.model.js";

export const claimUsername = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.id;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Regex for valid username: 3-20 chars, alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ message: "Username must be 3-20 characters, containing only letters, numbers, and underscores." });
  }

  try {
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username.toLowerCase();
    await user.save();

    res.status(200).json({ message: "Username claimed successfully", username: user.username });
  } catch (error) {
    console.error("Claim username error:", error);
    res.status(500).json({ message: "Failed to claim username" });
  }
};
