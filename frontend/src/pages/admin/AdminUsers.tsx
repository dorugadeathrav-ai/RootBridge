import React, { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/users`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data.filter(u => u.role === 'customer' || u.role === 'admin'));
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?._id) return alert('Cannot delete your own account.');
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Joined</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900">{user.name}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleDelete(user._id)}
                    disabled={user._id === currentUser?._id}
                    className="text-red-400 hover:text-red-600 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
