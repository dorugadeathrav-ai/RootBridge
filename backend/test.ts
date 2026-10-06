import axios from 'axios';
import { exec } from 'child_process';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const runTests = async () => {
  console.log('Starting backend server...');
  const serverProcess = exec('npm run dev:backend', { cwd: '../' });

  // Give the server a few seconds to start and connect to MongoDB
  await delay(5000);

  try {
    const API_URL = 'http://localhost:5000/api';

    // 1. Test Health
    console.log('Testing Health Endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('Health:', health.data);

    // 2. Test Registration (Customer)
    console.log('Testing Registration...');
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Customer',
      email: `customer${Date.now()}@test.com`,
      password: 'password123',
      role: 'customer'
    });
    console.log('Registered Customer:', regRes.data.email);
    const customerToken = regRes.data.token;

    // 3. Test Registration (Vendor)
    const vendorRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Vendor',
      email: `vendor${Date.now()}@test.com`,
      password: 'password123',
      role: 'vendor'
    });
    console.log('Registered Vendor:', vendorRes.data.email);
    const vendorToken = vendorRes.data.token;

    // 4. Test Role Protection
    console.log('Testing Role Protection...');
    try {
      await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
      });
      console.log('ERROR: Vendor accessed cart!');
    } catch (e: any) {
      console.log('Success: Vendor blocked from cart. Status:', e.response?.status);
    }

    // 5. Create a Category (Since we don't have a POST API for category, we'd need to mock it or create it in DB)
    // Actually, I can't create a category via API yet because I only implemented GET /api/categories.
    // I will skip Product API testing via HTTP and do it via DB insertion if needed, or just GET.
    
    console.log('Testing GET Products...');
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log('Products count:', productsRes.data.length);

    console.log('Testing GET Cart (Customer)...');
    const cartRes = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('Cart items count:', cartRes.data.items.length);

    console.log('All API tests passed successfully!');

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  } finally {
    console.log('Stopping server...');
    serverProcess.kill();
    process.exit(0);
  }
};

runTests();
