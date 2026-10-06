import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate('vendorId', 'name vendorInfo').populate('category', 'name');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'name vendorInfo')
      .populate('category', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get vendor's products
// @route   GET /api/products/vendor
// @access  Private (Vendor)
export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ vendorId: req.user?._id }).populate('category', 'name');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Vendor)
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity, category, image, productType } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      image,
      productType,
      vendorId: req.user?._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Vendor)
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity, category, image, productType } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.vendorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
         res.status(403).json({ message: 'Not authorized to update this product' });
         return;
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.category = category || product.category;
      product.image = image || product.image;
      product.productType = productType || product.productType;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Vendor)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.vendorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
         res.status(403).json({ message: 'Not authorized to delete this product' });
         return;
      }
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
