import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { MapPin, Truck, Leaf, Package, Minus, Plus } from 'lucide-react';

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

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { location } = useLocationContext();
  
  const [product, setProduct] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setProduct(data);
        if (location && data.vendorId?.vendorInfo?.latitude && data.vendorId?.vendorInfo?.longitude) {
          setDistance(calculateDistance(location.lat, location.lng, data.vendorId.vendorInfo.latitude, data.vendorId.vendorInfo.longitude));
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [id, location]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading product details...</div>;
  if (!product) return <div className="min-h-[50vh] flex items-center justify-center flex-col gap-4">
    <h2>Product not found</h2>
    <button onClick={() => navigate('/products')} className="text-emerald-600 underline">Back to products</button>
  </div>;

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 min-h-[300px]">
          {product.image ? (
             <img src={product.image} alt={product.name} className="max-w-full max-h-[500px] object-contain rounded" />
          ) : (
             <div className="text-gray-300 font-bold text-4xl">No Image</div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">{product.category?.name}</span>
            <span className="text-gray-300">•</span>
            {product.productType === 'perishable' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                <Leaf className="h-3 w-3" /> Fresh Local
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                <Package className="h-3 w-3" /> Pantry Staple
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-emerald-600 mb-6">₹{product.price}</p>

          <p className="text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed">{product.description}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>
                Sold by <strong className="text-gray-900">{product.vendorId?.vendorInfo?.businessName || product.vendorId?.name}</strong>
                {product.vendorId?.vendorInfo?.location && ` • ${product.vendorId.vendorInfo.location}`}
                {distance !== null && <span className="ml-2 font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">📍 {distance} km away</span>}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Truck className="h-5 w-5 text-gray-400" />
              <span>Ships directly from producer to you.</span>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {product.quantity > 0 ? (
                <span className="text-emerald-600">{product.quantity} in stock</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border rounded-lg h-12 w-32 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  disabled={quantity <= 1 || product.quantity === 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="flex-1 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  disabled={quantity >= product.quantity || product.quantity === 0}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || adding}
                className="flex-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold h-12 rounded-lg transition-colors disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-bold h-12 rounded-lg transition-colors disabled:opacity-50 shadow-sm shadow-emerald-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
