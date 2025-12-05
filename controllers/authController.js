import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * -------------------------------------------------------
 * Utility: Generate JWT Token for Authenticated Users
 * -------------------------------------------------------
 * @param {Object} user - User document from database
 * @returns {String} JWT Token valid for 7 days
 */
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

/**
 * =======================================================
 * REGISTER USER
 * =======================================================
 * Flow:
 * 1. Extract fields from request body
 * 2. Check if email already exists
 * 3. Hash password
 * 4. Create & save new user
 * 5. Generate JWT token
 * 6. Return newly created user info + token
 */
export const registerUser = async (req, res) => {
  try {
    const { userId, username, email, password, avatar } = req.body;

    // Check if email already exists in DB
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    // Securely hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      avatar,
      channels: [],
    });

    // Save user in database
    await newUser.save();

    // Generate authentication token
    const token = generateToken(newUser);

    // Response (safe user fields only)
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

/**
 * =======================================================
 * LOGIN USER
 * =======================================================
 * Flow:
 * 1. Find user by email
 * 2. Validate password using bcrypt
 * 3. Generate JWT token
 * 4. Return user data + token
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate authentication token
    const token = generateToken(existingUser);

    // Success response
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
