import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (Customer)
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user?._id }).populate('items.product', 'name price image');
    
    if (!cart) {
      cart = await Cart.create({ customerId: req.user?._id, items: [] });
    }
    
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (Customer)
export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ customerId: req.user?._id });

    if (!cart) {
      cart = new Cart({ customerId: req.user?._id, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
       res.status(404).json({ message: 'Product not found' });
       return;
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    let newQty = quantity;

    if (itemIndex > -1) {
      newQty = cart.items[itemIndex].quantity + quantity;
      if (newQty > product.quantity) {
         res.status(400).json({ message: `Cannot exceed available stock of ${product.quantity}` });
         return;
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (newQty > product.quantity) {
         res.status(400).json({ message: `Cannot exceed available stock of ${product.quantity}` });
         return;
      }
      cart.items.push({ product: new mongoose.Types.ObjectId(productId), quantity: newQty });
    }

    await cart.save();
    
    // Populate before sending back
    await cart.populate('items.product', 'name price image');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private (Customer)
export const updateCartItem = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ customerId: req.user?._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const product = await Product.findById(productId);
        if (!product) {
          res.status(404).json({ message: 'Product not found' });
          return;
        }
        if (quantity > product.quantity) {
          res.status(400).json({ message: `Cannot exceed available stock of ${product.quantity}` });
          return;
        }
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      await cart.populate('items.product', 'name price image');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private (Customer)
export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ customerId: req.user?._id });

    if (!cart) {
       res.status(404).json({ message: 'Cart not found' });
       return;
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    
    await cart.populate('items.product', 'name price image');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
