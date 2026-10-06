import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@rootbridge.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rootbridge.com',
      passwordHash: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

createAdmin();
