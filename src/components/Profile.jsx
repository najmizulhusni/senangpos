import React, { useState } from 'react';
import { User, Store, Mail, Phone, MapPin, Save, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onClose }) {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    shop_name: profile?.shop_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile(form);
    if (!error) setSuccess('Profil berjaya dikemaskini!');
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Profil Saya</h2>
              <p className="text-emerald-100 text-sm mt-1">{user?.email}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{form.full_name || 'Nama Pengguna'}</p>
              <p className="text-emerald-100 text-sm">{form.shop_name || 'Nama Kedai'}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Nama Penuh"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Store className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Nama Kedai/Gerai"
              value={form.shop_name}
              onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="tel"
              placeholder="No. Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <textarea
              placeholder="Alamat Kedai"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              Log Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
