import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const email = "excode@admin.in";
    const password = "excode@admin";
    
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }
    
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      authProvider: "local",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Admin`
    });
    
    await admin.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
