import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-emerald-900 text-emerald-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} RootBridge. Connecting farmers with customers directly.</p>
        </div>
      </footer>
    </div>
  );
}
