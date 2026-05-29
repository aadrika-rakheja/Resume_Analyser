import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'ai_resume_analyzer_super_secret_key',
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username, email and password' });
  }

  try {
    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      settings: { theme: 'dark', customApiKey: '' }
    });

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server registration failure' });
  }
};

/**
 * Authenticate user & get token
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Server login failure' });
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('❌ Profile Retrieval Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

/**
 * Update user settings
 */
export const updateSettings = async (req, res) => {
  const { theme, customApiKey } = req.body;

  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updateData = {
      settings: {
        theme: theme !== undefined ? theme : user.settings.theme,
        customApiKey: customApiKey !== undefined ? customApiKey : user.settings.customApiKey
      }
    };

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        settings: updatedUser.settings
      }
    });
  } catch (error) {
    console.error('❌ Settings Update Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};
