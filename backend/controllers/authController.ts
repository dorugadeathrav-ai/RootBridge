import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Register a new user (Customer or Vendor)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, businessName, location, latitude, longitude, description } = req.body;

  try {
    // Only allow customer and vendor registration via this endpoint
    if (role === 'admin') {
      res.status(400).json({ message: 'Invalid role for public registration' });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const vendorInfo = role === 'vendor' ? {
      businessName,
      location,
      latitude,
      longitude,
      description
    } : undefined;

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: role || 'customer',
      phone,
      vendorInfo,
    });

    if (user) {
      const token = generateToken(res, user._id.toString(), user.role);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Optional: Check if user is trying to login with correct portal/role
      // e.g. Customer can't login from vendor portal
      if (role && user.role !== role) {
         res.status(401).json({ message: 'Invalid role for this user' });
         return;
      }

      const token = generateToken(res, user._id.toString(), user.role);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-passwordHash');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vendorInfo: user.vendorInfo,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
