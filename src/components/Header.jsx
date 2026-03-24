import React from 'react';
import { ShoppingCart, Home, BarChart3, Package, History, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ view, setView, onProfileClick }) {
  const { user, profile } = useAuth();

  const NavButton = ({ icon: Icon, label, viewName }) => (
    <button
      onClick={() => setView(viewName)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all text-sm ${
        view === viewName 
          ? 'bg-emerald-600 text-white shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
          <ShoppingCart className="text-white" size={20} />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-gray-800">SenangPOS</h1>
          <p className="text-xs text-gray-500">
            {profile?.shop_name || 'Pasar Tani'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-1">
        <NavButton icon={Home} label="POS" viewName="pos" />
        <NavButton icon={BarChart3} label="Dashboard" viewName="dashboard" />
        <NavButton icon={Package} label="Stok" viewName="stock" />
        <NavButton icon={History} label="Sejarah" viewName="history" />
      </nav>

      {/* Profile */}
      <button
        onClick={onProfileClick}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <User size={16} className="text-emerald-600" />
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
          {profile?.full_name || user?.email?.split('@')[0] || 'Profil'}
        </span>
      </button>
    </header>
  );
}
