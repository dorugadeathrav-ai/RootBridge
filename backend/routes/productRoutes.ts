import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getVendorProducts } from '../controllers/productController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorizeRoles('vendor', 'admin'), createProduct);

router.route('/vendor').get(protect, authorizeRoles('vendor'), getVendorProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorizeRoles('vendor', 'admin'), updateProduct)
  .delete(protect, authorizeRoles('vendor', 'admin'), deleteProduct);

export default router;
