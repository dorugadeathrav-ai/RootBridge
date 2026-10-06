import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import { useLocationContext } from '../../context/LocationContext';

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';
  const categoryQ = searchParams.get('category') || 'all';
  const typeQ = searchParams.get('type') || 'all';
  
  const { location } = useLocationContext();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [filterType, setFilterType] = useState(typeQ);
  const [filterCategory, setFilterCategory] = useState(categoryQ);
  const [sortPrice, setSortPrice] = useState('none'); // 'asc' or 'desc'

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products`).then(r => r.json()),
      fetch(`${API_URL}/categories`).then(r => r.json())
    ]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const { filteredProducts, hasHiddenPerishables } = useMemo(() => {
    let result = products;
    let hiddenPerishables = false;

    // Search
    if (searchQ) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()));
    }

    // Category
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category?._id === filterCategory || p.category === filterCategory);
    }

    // Sort
    if (sortPrice === 'asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortPrice === 'desc') result = [...result].sort((a, b) => b.price - a.price);

    // Distance calc & Location filtering
    let processedResult = [];
    for (const p of result) {
      let distance = null;
      if (location && p.vendorId?.vendorInfo?.latitude && p.vendorId?.vendorInfo?.longitude) {
        distance = calculateDistance(location.lat, location.lng, p.vendorId.vendorInfo.latitude, p.vendorId.vendorInfo.longitude);
      }
      
      const pWithDist = { ...p, distance };

      // RootBridge Location Rule
      if (p.productType === 'perishable') {
        if (distance !== null && distance <= 30) {
          processedResult.push(pWithDist);
        } else if (distance !== null && distance > 30) {
          hiddenPerishables = true;
          // Skip showing this perishable product because it's too far
        } else {
          // If location is not available, we could either hide all perishables or show them.
          // Fallback: we include them if we don't know the distance, but prompt user to set location.
          processedResult.push(pWithDist);
        }
      } else {
        // long_shelf_life is always included
        processedResult.push(pWithDist);
      }
    }

    // Type filter
    if (filterType !== 'all') {
      processedResult = processedResult.filter(p => p.productType === filterType);
    }

    return { filteredProducts: processedResult, hasHiddenPerishables: hiddenPerishables };
  }, [products, searchQ, filterCategory, filterType, sortPrice, location]);

  const hasPerishables = filteredProducts.some(p => p.productType === 'perishable');
  const hasLongShelfLife = filteredProducts.some(p => p.productType === 'long_shelf_life');

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Product Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" checked={filterType === 'all'} onChange={() => setFilterType('all')} /> All
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" checked={filterType === 'perishable'} onChange={() => setFilterType('perishable')} /> Fresh Local (≤ 30 km)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" checked={filterType === 'long_shelf_life'} onChange={() => setFilterType('long_shelf_life')} /> Pantry Staples
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Categories</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" checked={filterCategory === 'all'} onChange={() => setFilterCategory('all')} /> All Categories
              </label>
              {categories.map(c => (
                <label key={c._id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" checked={filterCategory === c._id} onChange={() => setFilterCategory(c._id)} /> {c.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Price</h3>
            <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)} className="w-full border rounded p-2 text-sm outline-none">
              <option value="none">Default Sort</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQ ? `Search results for "${searchQ}"` : 'All Products'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Fresh products from producers within 30 km of you.</p>
          </div>

          {!hasPerishables && hasHiddenPerishables && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              No fresh products available within 30 km. Explore our long-shelf-life alternatives below!
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <button onClick={() => { setFilterType('all'); setFilterCategory('all'); setSortPrice('none'); }} className="mt-4 text-emerald-600 underline">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/products/${product._id}`} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="h-48 bg-gray-100 relative">
        {product.image ? (
           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">No Image</div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {product.productType === 'perishable' ? (
             <div className="bg-emerald-100 px-2 py-1 rounded shadow-sm text-xs font-bold text-emerald-800">
               Fresh Local
             </div>
          ) : (
             <div className="bg-amber-100 px-2 py-1 rounded shadow-sm text-xs font-bold text-amber-800">
               📦 Long shelf life
             </div>
          )}

          {product.distance !== null && product.distance !== undefined && (
            <div className="bg-white/90 px-2 py-1 rounded shadow-sm text-xs font-bold text-blue-800">
              📍 {product.distance} km away
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{product.name}</h3>
          <span className="font-bold text-emerald-600 ml-2">₹{product.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{product.vendorId?.vendorInfo?.businessName || product.vendorId?.name}</p>
        
        <div className="mt-auto pt-3 border-t">
          {product.quantity > 0 ? (
            <button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors py-2 rounded font-medium text-sm">
              View Product
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded font-medium text-sm">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
