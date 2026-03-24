import { ShoppingCart, LayoutDashboard, Package, History, User, X, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ view, setView, isOpen, onToggle }) {
  const { user, profile, signOut } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const navItems = [
    { id: 'pos', icon: ShoppingCart, label: t('sales'), desc: t('takeOrders') },
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), desc: t('viewStats') },
    { id: 'stock', icon: Package, label: t('stock'), desc: t('manageInventory') },
    { id: 'history', icon: History, label: t('history'), desc: t('orderRecords') },
  ];

  const handleLogout = async () => {
    if (confirm(language === 'ms' ? 'Log keluar?' : 'Logout?')) await signOut();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">SenangPOS</h1>
                <p className="text-xs text-gray-500">Pasar Tani</p>
              </div>
            </div>
            <button onClick={onToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); onToggle(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                view === item.id 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className={view === item.id ? 'text-emerald-600' : 'text-gray-400'} />
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => { if (language !== 'en') toggleLanguage(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                language === 'en' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => { if (language !== 'ms') toggleLanguage(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                language === 'ms' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              🇲🇾 BM
            </button>
          </div>

          {/* Support */}
          <button
            onClick={() => { setView('support'); onToggle(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              view === 'support' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
            }`}
          >
            <HelpCircle size={18} className={view === 'support' ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-sm font-medium">{t('support')}</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => { setView('profile'); onToggle(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === 'profile' ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm text-gray-800 truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.shop_name || 'My Shop'}
              </p>
            </div>
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">{t('logout')}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
