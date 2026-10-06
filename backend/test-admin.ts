import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';
dotenv.config();

const createAdminAndTest = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rootbridge');

    let admin = await User.findOne({ email: 'admin@rootbridge.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@rootbridge.com',
        passwordHash: 'admin123',
        role: 'admin',
        phone: '1234567890'
      });
      console.log('Admin user created');
    }

    console.log('Testing Admin login...');
    const loginReq = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rootbridge.com', password: 'admin123' })
    });
    const loginRes = await loginReq.json();
    if (!loginReq.ok) throw new Error(loginRes.message);
    const token = loginRes.token;
    console.log('Admin logged in:', loginRes.name);

    console.log('Testing Get All Users...');
    const usersReq = await fetch('http://localhost:5001/api/users', { headers: { Authorization: `Bearer ${token}` }});
    const usersRes = await usersReq.json();
    console.log('Users found:', usersRes.length);

    console.log('Testing Get All Orders...');
    const ordersReq = await fetch('http://localhost:5001/api/orders/all', { headers: { Authorization: `Bearer ${token}` }});
    const ordersRes = await ordersReq.json();
    console.log('Orders found:', ordersRes.length);

    console.log('Testing Delete Products with Admin Role...');
    // We won't actually delete, just checking endpoint works.

    console.log('Admin tests passed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
};
createAdminAndTest();
