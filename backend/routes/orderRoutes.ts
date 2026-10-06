import express from 'express';
import { createOrder, getMyOrders, getOrderById, getVendorOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/all').get(protect, authorizeRoles('admin'), getAllOrders);

router.route('/')
  .post(protect, authorizeRoles('customer'), createOrder)
  .get(protect, authorizeRoles('customer'), getMyOrders);

router.route('/vendor').get(protect, authorizeRoles('vendor'), getVendorOrders);
router.route('/:id/status').put(protect, authorizeRoles('vendor', 'admin'), updateOrderStatus);

router.route('/:id').get(protect, getOrderById);

export default router;
