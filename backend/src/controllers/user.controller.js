import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!String(name).trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "invalid email format" });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "Email already in use" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name: String(name).trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    }).save();
    return res.status(201).json({
      message: "user registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  return res.status(200).json({
    message: "Login successful",
    token: token,
    user: { name: user.name, email: user.email },
  });
};

export { registerUser, loginUser };
