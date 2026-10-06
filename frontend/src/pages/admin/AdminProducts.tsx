import React, { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../../utils/api';
import { Trash2, Search } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(products.filter(p => p.name.toLowerCase().includes(q) || p.vendorId?.name?.toLowerCase().includes(q) || p.vendorId?.vendorInfo?.businessName?.toLowerCase().includes(q)));
    }
  }, [search, products]);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_URL}/products`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFiltered(data);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl font-bold text-gray-900">Product Catalog</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products or vendors..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 font-semibold">Product</th>
              <th className="p-3 font-semibold">Vendor</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium text-gray-900 line-clamp-1">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.category?.name}</div>
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  {product.vendorId?.vendorInfo?.businessName || product.vendorId?.name || 'Unknown'}
                </td>
                <td className="p-3 text-gray-900">₹{product.price}</td>
                <td className="p-3">
                  {product.quantity > 0 ? (
                    <span className="text-gray-900">{product.quantity}</span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of stock</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    product.productType === 'perishable' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {product.productType === 'perishable' ? 'Fresh' : 'Pantry'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
