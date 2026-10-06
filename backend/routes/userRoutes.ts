import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, authorizeRoles('admin'), getUsers);

router.route('/:id')
  .delete(protect, authorizeRoles('admin'), deleteUser);

export default router;
