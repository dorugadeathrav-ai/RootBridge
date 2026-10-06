import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile endpoint (protected)
router.get('/profile', protect, getUserProfile);

// Example of role protected route
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin panel' });
});

router.get('/vendor-only', protect, authorizeRoles('vendor'), (req, res) => {
  res.json({ message: 'Welcome to the vendor panel' });
});

export default router;
