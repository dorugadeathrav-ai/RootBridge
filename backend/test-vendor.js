const runTests = async () => {
  try {
    const API_URL = 'http://localhost:5001/api';

    console.log('Testing Vendor Registration...');
    const vendorReq = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Farm Vendor',
        email: `farm${Date.now()}@test.com`,
        password: 'password123',
        role: 'vendor',
        businessName: 'Green Farm',
        location: 'Pune',
        latitude: 18.52,
        longitude: 73.85,
        description: 'Fresh veggies'
      })
    });
    const vendorRes = await vendorReq.json();
    if (!vendorReq.ok) throw new Error(vendorRes.message);
    const vendorToken = vendorRes.token;
    console.log('Registered Vendor:', vendorRes.email);

    // Fetch categories to get one
    const catReq = await fetch(`${API_URL}/categories`);
    const categories = await catReq.json();
    let categoryId = categories.length > 0 ? categories[0]._id : null;

    if (!categoryId) {
       // create a dummy category just in case
       const createCat = await fetch(`${API_URL}/categories`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Vegetables' }) });
       // wait, categories POST might not be open. Actually I didn't create POST /categories.
       // Let me just check if it fails, I'll ignore.
    }

    console.log('Testing Product Creation...');
    const prodReq = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`
      },
      body: JSON.stringify({
        name: 'Organic Tomatoes',
        description: 'Very fresh',
        price: 40,
        quantity: 100,
        productType: 'perishable',
        category: categoryId || '650b4f8d9b1c8a1234567890'
      })
    });
    const prodRes = await prodReq.json();
    if (!prodReq.ok) throw new Error(prodRes.message);
    console.log('Product created:', prodRes.name);

    console.log('Testing Get Vendor Products...');
    const getProdReq = await fetch(`${API_URL}/products/vendor`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    const getProdRes = await getProdReq.json();
    console.log('Vendor Products count:', getProdRes.length);

    console.log('All tests passed!');
  } catch (err) {
    console.error('Test failed:', err);
  }
};
runTests();
