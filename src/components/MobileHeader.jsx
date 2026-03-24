import React from 'react';
import { Menu, ShoppingCart } from 'lucide-react';

export default function MobileHeader({ onMenuClick, shopName }) {
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg">
        <Menu size={24} className="text-gray-600" />
      </button>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
          <ShoppingCart className="text-white" size={16} />
        </div>
        <span className="font-bold text-gray-800">{shopName || 'SenangPOS'}</span>
      </div>
      
      <div className="w-10" aria-hidden="true" /> {/* Spacer for centering */}
    </header>
  );
}
