import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('customer'));

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

export default router;
