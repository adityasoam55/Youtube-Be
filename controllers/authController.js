import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { userId, username, email, password, avatar } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      avatar,
      channels: [],
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        userId,
        username,
        email,
        avatar,
        channels: [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(existingUser);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: existingUser.userId,
        username: existingUser.username,
        email: existingUser.email,
        avatar: existingUser.avatar,
        channels: existingUser.channels,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
