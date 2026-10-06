import mongoose from 'mongoose';
import User from './models/User';
import Product from './models/Product';
import Category from './models/Category';
import dotenv from 'dotenv';
dotenv.config();

const E2ETest = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rootbridge');

    // Clean up
    await User.deleteMany({ email: { $in: ['e2e_vendor@test.com', 'e2e_customer@test.com'] } });
    
    // Get a category
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'Vegetables' });
    }

    console.log('--- Registering Vendor ---');
    const vendorRegReq = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Vendor',
        email: 'e2e_vendor@test.com',
        password: 'password123',
        role: 'vendor',
        phone: '1234567890',
        businessName: 'E2E Farms',
        location: 'Cityville',
        latitude: 12.34,
        longitude: 56.78
      })
    });
    const vendorRegRes = await vendorRegReq.json();
    if (!vendorRegReq.ok) throw new Error(vendorRegRes.message);
    const vendorToken = vendorRegRes.token;

    console.log('--- Vendor Adding Product ---');
    const addProdReq = await fetch('http://localhost:5001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
      body: JSON.stringify({
        name: 'E2E Fresh Tomatoes',
        description: 'Test tomatoes',
        price: 40,
        quantity: 10,
        category: category._id,
        productType: 'perishable'
      })
    });
    const addProdRes = await addProdReq.json();
    if (!addProdReq.ok) throw new Error(addProdRes.message);
    const productId = addProdRes._id;
    console.log('Product added with ID:', productId);

    console.log('--- Registering Customer ---');
    const custRegReq = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Customer',
        email: 'e2e_customer@test.com',
        password: 'password123',
        role: 'customer',
        phone: '0987654321'
      })
    });
    const custRegRes = await custRegReq.json();
    if (!custRegReq.ok) throw new Error(custRegRes.message);
    const custToken = custRegRes.token;

    console.log('--- Customer Adding to Cart ---');
    const addToCartReq = await fetch('http://localhost:5001/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({ productId, quantity: 2 })
    });
    if (!addToCartReq.ok) throw new Error(await addToCartReq.text());
    
    console.log('--- Customer Placing Order ---');
    const orderReq = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({
        deliveryAddress: { address: '123 Test St', city: 'Test City', postalCode: '12345', country: 'India' }
      })
    });
    const orderRes = await orderReq.json();
    if (!orderReq.ok) throw new Error(orderRes.message);
    const orderId = orderRes._id;
    console.log('Order placed with ID:', orderId);

    console.log('--- Verify Product Stock Deducted ---');
    const pAfter = await Product.findById(productId);
    if (pAfter?.quantity !== 8) throw new Error('Stock not deducted properly');
    console.log('Stock successfully deducted! Remaining:', pAfter.quantity);

    console.log('--- Vendor Updates Order Status ---');
    const updateOrderReq = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
      body: JSON.stringify({ status: 'Shipped' })
    });
    if (!updateOrderReq.ok) throw new Error(await updateOrderReq.text());
    console.log('Order status updated successfully');

    console.log('E2E TEST PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
};
E2ETest();
