import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const salt = 10;

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, salt);

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
  const user = new User({ name, email, password: hashedPassword, avatar: avatarUrl, authProvider: "local" });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(201).json({ message: "User created successfully", token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({ message: "Login successful", token, user });
};

export const firebaseAuth = async (req, res) => {
  const { name, email, firebaseUid, avatar, authProvider } = req.body;
  
  if (!email || !firebaseUid) {
    return res.status(400).json({ message: "Missing required Firebase fields" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        user.authProvider = authProvider || user.authProvider;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      const generatedAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`;
      user = new User({
        name: name || email.split("@")[0],
        email,
        firebaseUid,
        authProvider: authProvider || "firebase",
        avatar: generatedAvatar
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ message: "Firebase auth successful", token, user });
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(500).json({ message: "Internal server error during Firebase auth" });
  }
};
