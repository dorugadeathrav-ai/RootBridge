import React, { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../../utils/api';
import { Trash2 } from 'lucide-react';

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    fetch(`${API_URL}/users`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVendors(data.filter(u => u.role === 'vendor'));
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vendor and their profile?')) return;
    
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setVendors(vendors.filter(v => v._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading vendors...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Vendor Management</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 font-semibold">Business Name</th>
              <th className="p-3 font-semibold">Producer</th>
              <th className="p-3 font-semibold">Location</th>
              <th className="p-3 font-semibold">Contact</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-emerald-800">{vendor.vendorInfo?.businessName || 'N/A'}</td>
                <td className="p-3 text-gray-900">{vendor.name}</td>
                <td className="p-3 text-gray-600">{vendor.vendorInfo?.location || 'N/A'}</td>
                <td className="p-3 text-gray-600">
                  <div className="text-xs">{vendor.email}</div>
                  <div className="text-xs">{vendor.phone}</div>
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleDelete(vendor._id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No vendors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
