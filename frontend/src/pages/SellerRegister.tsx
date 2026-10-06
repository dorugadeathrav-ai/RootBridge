import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SellerRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    location: '',
    description: '',
    latitude: 0,
    longitude: 0,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requestLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocating(false);
          alert('Location captured successfully!');
        },
        (err) => {
          console.error(err);
          setLocating(false);
          alert('Could not get location. Please enter city manually.');
        }
      );
    } else {
      setLocating(false);
      alert('Geolocation not supported by this browser.');
    }
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    
    setError('');
    setIsLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'vendor',
        businessName: form.businessName,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
        description: form.description
      });
      navigate('/seller-dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <Link to="/" className="text-2xl font-semibold text-emerald-600">RootBridge</Link>
        <form onSubmit={submit} className="mt-8 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Register as Vendor</h1>
          <p className="text-gray-500 mt-1 mb-6">Join RootBridge and sell your products directly.</p>
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Account Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border p-2" />
              </div>
              <div>
                <label className="text-sm">Phone Number</label>
                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded border p-2" />
              </div>
            </div>

            <div>
              <label className="text-sm">Email Address</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded border p-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Password</label>
                <div className="mt-1 flex rounded border">
                  <input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-2 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-sm text-emerald-600">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div>
                <label className="text-sm">Confirm Password</label>
                <div className="mt-1 flex rounded border">
                  <input required type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="w-full p-2 outline-none" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="px-3 text-sm text-emerald-600">{showConfirmPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-700 border-b pb-2 pt-4">Farm / Business Details</h3>
            
            <div>
              <label className="text-sm">Business Name</label>
              <input required value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} className="mt-1 w-full rounded border p-2" />
            </div>

            <div>
              <label className="text-sm">Short Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded border p-2" rows={2}></textarea>
            </div>

            <div>
              <label className="text-sm block mb-1">Location</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input required placeholder="City / Address" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="flex-grow rounded border p-2" />
                <button type="button" onClick={requestLocation} disabled={locating} className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded text-sm font-semibold hover:bg-blue-100 whitespace-nowrap">
                  {locating ? 'Locating...' : '📍 Auto-Locate'}
                </button>
              </div>
              {form.latitude !== 0 && (
                <p className="text-xs text-emerald-600 mt-1">Coordinates saved: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <button disabled={isLoading} className="w-full mt-4 rounded bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-70">
              {isLoading ? 'Registering...' : 'Complete Vendor Registration'}
            </button>
            <p className="text-center text-sm text-slate-600">Already registered? <Link to="/login" className="text-emerald-600 font-semibold">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
