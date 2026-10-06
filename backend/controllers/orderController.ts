import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req: Request, res: Response) => {
  const { deliveryAddress } = req.body;

  try {
    const cart = await Cart.findOne({ customerId: req.user?._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'No items in cart' });
      return;
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cart.items) {
      const product = item.product as any; // Cast populated product
      const price = product.price;
      const vendorId = product.vendorId; // Assuming vendorId is populated or just ObjectId, actually Cart only populates name price image right now. Wait, I should make sure Cart populates vendorId or just fetch product. Let's fetch product from DB.
      
      const dbProduct = await Product.findById(product._id);
      if (!dbProduct) continue;
      
      if (dbProduct.quantity < item.quantity) {
        res.status(400).json({ message: `Not enough stock for ${dbProduct.name}. Only ${dbProduct.quantity} left.` });
        return;
      }
      
      totalAmount += price * item.quantity;
      
      orderProducts.push({
        product: product._id,
        vendor: dbProduct.vendorId,
        quantity: item.quantity,
        price,
      });

      // Simple quantity deduction (would be more robust in prod)
      dbProduct.quantity -= item.quantity;
      await dbProduct.save();
    }

    const order = new Order({
      customerId: req.user?._id,
      products: orderProducts,
      totalAmount,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private (Customer)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ customerId: req.user?._id })
      .populate('products.product', 'name image price')
      .populate('products.vendor', 'name vendorInfo')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('products.product', 'name image price');

    if (order) {
      // Check if this order belongs to the user or if user is admin
      if (order.customerId._id.toString() === req.user?._id.toString() || req.user?.role === 'admin' || req.user?.role === 'vendor') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private (Admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate('customerId', 'name email phone')
      .populate('products.product', 'name image price')
      .populate('products.vendor', 'name vendorInfo')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor
// @access  Private (Vendor)
export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    // Find orders that contain at least one product sold by this vendor
    const orders = await Order.find({ 'products.vendor': req.user?._id })
      .populate('customerId', 'name email phone')
      .populate('products.product', 'name image price')
      .sort({ createdAt: -1 });
      
    // Filter out products in the order that don't belong to this vendor (optional, but good for privacy)
    const vendorOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.products = orderObj.products.filter((p: any) => p.vendor.toString() === req.user?._id.toString());
      return orderObj;
    });

    res.json(vendorOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor/Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Verify vendor owns a product in this order (or is admin)
    const isVendorForOrder = order.products.some(p => p.vendor.toString() === req.user?._id.toString());
    if (!isVendorForOrder && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this order' });
      return;
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
