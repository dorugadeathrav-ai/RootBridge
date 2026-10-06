import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext';
import { API_URL } from '../../utils/api';
import { MapPin } from 'lucide-react';

export default function HomePage() {
  const { location, locationError, requestLocation } = useLocationContext();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  useEffect(() => {
    fetch(`${API_URL}/categories`).then(res => res.json()).then(setCategories).catch(console.error);
    fetch(`${API_URL}/products`).then(res => res.json()).then(setProducts).catch(console.error);
  }, []);

  const perishable = products
    .filter(p => p.productType === 'perishable')
    .filter(p => {
      if (!location || !p.vendorId?.vendorInfo?.latitude) return true; // show if unknown
      const dist = calculateDistance(location.lat, location.lng, p.vendorId.vendorInfo.latitude, p.vendorId.vendorInfo.longitude);
      p.distance = dist; // attach for rendering
      return dist <= 30;
    })
    .slice(0, 4);

  const longShelf = products
    .filter(p => p.productType === 'long_shelf_life')
    .map(p => {
       if (location && p.vendorId?.vendorInfo?.latitude) {
         p.distance = calculateDistance(location.lat, location.lng, p.vendorId.vendorInfo.latitude, p.vendorId.vendorInfo.longitude);
       }
       return p;
    })
    .slice(0, 4);

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}

  return (
    <div>
      {/* Hero */}
      <div className="bg-emerald-800 text-emerald-50 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Fresh products, directly from local producers.</h1>
        <p className="text-lg md:text-xl text-emerald-200 max-w-2xl mx-auto mb-8">
          RootBridge connects you directly with farmers and small businesses in your community for the freshest natural goods.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/products" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 px-8 rounded-full transition-colors">
            Shop Products
          </Link>
          <Link to="/seller/register" className="bg-transparent border border-emerald-500 hover:bg-emerald-700 font-bold py-3 px-8 rounded-full transition-colors">
            Become a Vendor
          </Link>
        </div>
      </div>

      {/* Location Banner */}
      <div className="bg-emerald-100 py-3 px-4 text-center text-emerald-800 text-sm flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4" />
        {location ? (
          <span>Showing local products for your area</span>
        ) : locationError ? (
          <span>{locationError}. We will show default products. <button className="underline font-semibold text-emerald-900 ml-1">Enter manually</button></span>
        ) : (
          <span>
            See what's fresh near you! <button onClick={requestLocation} className="underline font-semibold text-emerald-900 ml-1">Enable Location</button>
          </span>
        )}
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.slice(0, 8).map(c => (
            <Link key={c._id} to={`/products?category=${c._id}`} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center border border-emerald-50 flex flex-col items-center justify-center h-32">
              <span className="font-semibold text-emerald-800">{c.name}</span>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">No categories loaded yet.</div>
          )}
        </div>
      </div>

      {/* Fresh Nearby */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Fresh products near you</h2>
              <p className="text-gray-500 text-sm mt-1">Perishable items sourced within a 30 km radius.</p>
            </div>
            <Link to="/products?type=perishable" className="text-emerald-600 hover:underline font-medium text-sm hidden sm:block">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perishable.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
            {perishable.length === 0 && <p className="text-gray-500">No fresh products found.</p>}
          </div>
        </div>
      </div>

      {/* Long Shelf Life */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pantry Staples</h2>
            <p className="text-gray-500 text-sm mt-1">Long shelf-life items from producers everywhere.</p>
          </div>
          <Link to="/products?type=long_shelf_life" className="text-emerald-600 hover:underline font-medium text-sm hidden sm:block">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {longShelf.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
          {longShelf.length === 0 && <p className="text-gray-500">No pantry staples found.</p>}
        </div>
      </div>

      {/* Why RootBridge */}
      <div className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-emerald-900 mb-10">Why RootBridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-emerald-800 mb-2">Direct from producers</h3>
              <p className="text-sm text-gray-600">No middlemen. You buy directly from the people who grow it.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-emerald-800 mb-2">Fresh local products</h3>
              <p className="text-sm text-gray-600">We prioritize fresh goods grown within 30km of your home.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-emerald-800 mb-2">Better access to farmers</h3>
              <p className="text-sm text-gray-600">Empower small businesses and build a resilient local food system.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-emerald-800 mb-2">Easy online shopping</h3>
              <p className="text-sm text-gray-600">Secure, simple, and clean checkout process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/products/${product._id}`} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="h-48 bg-emerald-100 relative">
        {product.image ? (
           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-emerald-300 font-bold text-2xl">No Image</div>
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
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{product.name}</h3>
          <span className="font-bold text-emerald-600 ml-2">₹{product.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{product.vendorId?.vendorInfo?.businessName || product.vendorId?.name || 'Local Vendor'}</p>
        
        <div className="mt-auto pt-3 border-t">
          <button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors py-2 rounded font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
