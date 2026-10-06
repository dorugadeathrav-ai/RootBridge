import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, false, 'admin');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access denied');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-700 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500">RootBridge Marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input 
              required type="email" 
              value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              required type="password" 
              value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}

          <button 
            disabled={loading} 
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-70 mt-2"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-emerald-600 hover:underline">Return to Storefront</a>
        </div>
      </div>
    </div>
  );
}
