import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Package, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Vendors', to: '/admin/vendors', icon: Store },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebar = (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div>
          <span className="text-xl font-bold tracking-tight text-emerald-400">RootBridge</span>
          <span className="ml-2 text-xs font-mono bg-emerald-900 text-emerald-300 px-1 py-0.5 rounded">ADMIN</span>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {adminNav.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="bg-slate-700 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-sm overflow-hidden">
            <p className="truncate font-medium">{currentUser?.name}</p>
            <p className="truncate text-slate-400 text-xs">{currentUser?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      
      {sidebar}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b h-14 flex items-center px-4 lg:hidden sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-emerald-700">Admin Panel</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
