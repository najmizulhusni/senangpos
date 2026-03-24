import { useState, useMemo, useEffect } from 'react';
import { Plus, AlertTriangle, RefreshCw, X, Trash2, DollarSign, ShoppingCart, BarChart3, Package, History, Calendar, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import { getFoodIcon } from './components/FoodIcons';

const DEFAULT_MENU = [
  { id: 1, name: 'Nasi Lemak Ayam', price: 7.00, category: 'main', icon: 'nasi-lemak', is_available: true, stock_qty: 50 },
  { id: 2, name: 'Nasi Lemak Telur', price: 5.00, category: 'main', icon: 'nasi-lemak', is_available: true, stock_qty: 50 },
  { id: 3, name: 'Nasi Ayam Goreng Berempah', price: 7.00, category: 'main', icon: 'chicken', is_available: true, stock_qty: 40 },
  { id: 4, name: 'Nasi Ayam', price: 7.00, category: 'main', icon: 'chicken', is_available: true, stock_qty: 40 },
  { id: 5, name: 'Laksa Penang', price: 6.00, category: 'main', icon: 'noodle', is_available: true, stock_qty: 30 },
  { id: 6, name: 'Laksa Johor', price: 6.00, category: 'main', icon: 'noodle', is_available: true, stock_qty: 30 },
  { id: 7, name: 'Ayam Laksa', price: 6.00, category: 'main', icon: 'noodle', is_available: true, stock_qty: 30 },
  { id: 8, name: 'Mee Kari', price: 5.00, category: 'main', icon: 'noodle', is_available: true, stock_qty: 35 },
  { id: 9, name: 'Lontong Kering', price: 6.00, category: 'main', icon: 'rice-box', is_available: true, stock_qty: 25 },
  { id: 10, name: 'Soto', price: 6.00, category: 'main', icon: 'soup', is_available: true, stock_qty: 30 },
  { id: 11, name: 'Telur Goreng', price: 1.00, category: 'addon', icon: 'egg', is_available: true, stock_qty: 100 },
  { id: 12, name: 'Telur Rebus', price: 1.00, category: 'addon', icon: 'boiled-egg', is_available: true, stock_qty: 100 },
  { id: 13, name: 'Extra Ayam', price: 4.00, category: 'addon', icon: 'chicken', is_available: true, stock_qty: 50 },
  { id: 14, name: 'Extra Daging', price: 4.00, category: 'addon', icon: 'meat', is_available: true, stock_qty: 30 },
  { id: 15, name: 'Sambal Extra', price: 0.50, category: 'addon', icon: 'chili', is_available: true, stock_qty: null },
  { id: 16, name: 'Keropok', price: 1.00, category: 'addon', icon: 'cracker', is_available: true, stock_qty: 100 },
];

const ICON_OPTIONS = [
  { value: 'nasi-lemak', label: 'Nasi Lemak' },
  { value: 'chicken', label: 'Ayam' },
  { value: 'noodle', label: 'Mee/Laksa' },
  { value: 'soup', label: 'Sup' },
  { value: 'rice-box', label: 'Nasi Kotak' },
  { value: 'egg', label: 'Telur Goreng' },
  { value: 'boiled-egg', label: 'Telur Rebus' },
  { value: 'meat', label: 'Daging' },
  { value: 'chili', label: 'Sambal' },
  { value: 'cracker', label: 'Keropok' },
];

function POSApp() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [isDemo, setIsDemo] = useState(false);
  
  // Get initial view from URL path
  const getInitialView = () => {
    const path = window.location.pathname;
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/stock')) return 'stock';
    if (path.includes('/history')) return 'history';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/support')) return 'support';
    return 'pos';
  };
  
  const [view, setView] = useState(getInitialView());
  
  // Auto-redirect admin users to admin view
  useEffect(() => {
    if (profile?.is_admin && view === 'pos') {
      setView('admin');
    }
  }, [profile]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU);
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalItem, setModalItem] = useState({ name: '', price: '', category: 'main', icon: 'nasi-lemak', is_available: true, stock_qty: '' });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }));
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [showQRConfirm, setShowQRConfirm] = useState(false);
  const [pendingTotal, setPendingTotal] = useState(0);

  const useSupabase = isSupabaseConfigured() && supabase && (user || isDemo);
  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })), 1000); return () => clearInterval(timer); }, []);
  
  // Update URL when view changes
  useEffect(() => {
    const pathMap = {
      'pos': '/',
      'admin': '/admin',
      'dashboard': '/dashboard',
      'stock': '/stock',
      'history': '/history',
      'profile': '/profile',
      'support': '/support'
    };
    const newPath = pathMap[view] || '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [view]);
  
  useEffect(() => { if (useSupabase) { fetchMenuItems(); fetchOrders(); } }, [user, isDemo]);
  useEffect(() => {
    if (!useSupabase) return;
    const menuSub = supabase.channel('menu').on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, fetchMenuItems).subscribe();
    const orderSub = supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders).subscribe();
    return () => { supabase.removeChannel(menuSub); supabase.removeChannel(orderSub); };
  }, [useSupabase]);

  const fetchMenuItems = async () => { if (!supabase) return; const { data } = await supabase.from('menu_items').select('*').order('category'); if (data) setMenuItems(data.map(item => ({ ...item, icon: item.icon || 'nasi-lemak' }))); };
  const fetchOrders = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (data) setOrders(data.map(o => ({ id: o.order_number || o.id, items: o.order_items.map(i => ({ name: i.item_name, qty: i.quantity, price: i.unit_price })), total: parseFloat(o.total), subtotal: parseFloat(o.subtotal), discount: parseFloat(o.discount), payment: o.payment_method, time: new Date(o.created_at).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }), date: o.created_at.split('T')[0] })));
  };

  const addToCart = (item) => {
    if (!item.is_available || (item.stock_qty !== null && item.stock_qty <= 0)) return;
    const existing = cart.find(i => i.id === item.id);
    if (existing) { if (item.stock_qty !== null && existing.qty >= item.stock_qty) { showToast(t('insufficientStock'), 'error'); return; } setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)); }
    else setCart([...cart, { ...item, qty: 1 }]);
  };

  const updateQty = (id, delta) => {
    const item = menuItems.find(m => m.id === id);
    setCart(cart.map(i => { if (i.id === id) { const newQty = i.qty + delta; if (item?.stock_qty !== null && newQty > item.stock_qty) return i; return { ...i, qty: Math.max(0, newQty) }; } return i; }).filter(i => i.qty > 0));
  };

  const initiateQRPayment = () => {
    if (cart.length === 0) return;
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalTotal = Math.max(0, cartTotal - discount);
    setPendingTotal(finalTotal);
    setShowQRConfirm(true);
  };

  const confirmQRPayment = async () => {
    setShowQRConfirm(false);
    await checkout('QR');
  };

  const checkout = async (method) => {
    if (cart.length === 0) return;
    setLoading(true);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalTotal = Math.max(0, cartTotal - discount);
    const now = new Date();
    if (useSupabase) {
      const { data: orderData, error } = await supabase.from('orders').insert({ subtotal: cartTotal, discount, total: finalTotal, payment_method: method, user_id: user?.id }).select().single();
      if (!error && orderData) {
        await supabase.from('order_items').insert(cart.map(i => ({ order_id: orderData.id, menu_item_id: i.id, item_name: i.name, quantity: i.qty, unit_price: i.price })));
        for (const item of cart) { if (item.stock_qty !== null) await supabase.from('menu_items').update({ stock_qty: item.stock_qty - item.qty }).eq('id', item.id); }
        fetchMenuItems(); fetchOrders();
      }
    } else {
      setMenuItems(menuItems.map(m => { const c = cart.find(c => c.id === m.id); return c && m.stock_qty !== null ? { ...m, stock_qty: m.stock_qty - c.qty } : m; }));
      setOrders([{ id: Math.max(...orders.map(o => o.id), 0) + 1, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total: finalTotal, subtotal: cartTotal, discount, payment: method, time: now.toTimeString().slice(0, 5), date: now.toISOString().split('T')[0] }, ...orders]);
    }
    showToast(`${t('orderSuccess')} RM ${finalTotal.toFixed(2)}`);
    setCart([]); setDiscount(0); setLoading(false);
  };

  const openAddModal = () => { setEditingItem(null); setModalItem({ name: '', price: '', category: 'main', icon: 'nasi-lemak', is_available: true, stock_qty: '' }); setShowModal(true); };
  const openEditModal = (item) => { setEditingItem(item); setModalItem({ name: item.name, price: item.price, category: item.category, icon: item.icon || 'nasi-lemak', is_available: item.is_available, stock_qty: item.stock_qty ?? '' }); setShowModal(true); };

  const saveMenuItem = async () => {
    if (!modalItem.name || !modalItem.price) return;
    setLoading(true);
    const itemData = { name: modalItem.name, price: parseFloat(modalItem.price), category: modalItem.category, icon: modalItem.icon, is_available: modalItem.is_available, stock_qty: modalItem.stock_qty === '' ? null : parseInt(modalItem.stock_qty) };
    if (useSupabase) { if (editingItem) await supabase.from('menu_items').update(itemData).eq('id', editingItem.id); else await supabase.from('menu_items').insert(itemData); fetchMenuItems(); }
    else { if (editingItem) setMenuItems(menuItems.map(i => i.id === editingItem.id ? { ...i, ...itemData } : i)); else setMenuItems([...menuItems, { id: Math.max(...menuItems.map(i => i.id), 0) + 1, ...itemData }]); }
    showToast(editingItem ? t('itemUpdated') : t('itemAdded'));
    setShowModal(false); setLoading(false);
  };

  const deleteMenuItem = async (id) => { if (!confirm(t('deleteConfirm'))) return; if (useSupabase) { await supabase.from('menu_items').delete().eq('id', id); fetchMenuItems(); } else setMenuItems(menuItems.filter(i => i.id !== id)); showToast(t('itemDeleted')); setShowModal(false); };
  const toggleAvailability = async (item) => { if (useSupabase) { await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id); fetchMenuItems(); } else setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, is_available: !i.is_available } : i)); };
  const updateStock = async (newStock) => { if (!stockItem) return; if (useSupabase) { await supabase.from('menu_items').update({ stock_qty: newStock }).eq('id', stockItem.id); fetchMenuItems(); } else setMenuItems(menuItems.map(i => i.id === stockItem.id ? { ...i, stock_qty: newStock } : i)); showToast(t('stockUpdated')); setShowStockModal(false); setStockItem(null); };

  const getFilteredOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Date range filter
    if (dateFrom && dateTo) {
      return orders.filter(o => o.date >= dateFrom && o.date <= dateTo);
    }
    if (dateFrom) return orders.filter(o => o.date >= dateFrom);
    if (dateTo) return orders.filter(o => o.date <= dateTo);
    if (dateFilter === 'today') return orders.filter(o => o.date === today);
    if (dateFilter === 'month') return orders.filter(o => o.date.startsWith(currentMonth));
    return orders;
  };

  const clearDateRange = () => { setDateFrom(''); setDateTo(''); setDateFilter('today'); };

  const lowStockItems = menuItems.filter(i => i.stock_qty !== null && i.stock_qty <= 10 && i.stock_qty > 0);
  const outOfStockItems = menuItems.filter(i => i.stock_qty !== null && i.stock_qty <= 0);

  const stats = useMemo(() => {
    const filtered = getFilteredOrders();
    const total = filtered.reduce((sum, o) => sum + o.total, 0);
    const itemSales = {}, paymentTotals = {}, dailySales = {};
    filtered.forEach(o => { o.items.forEach(item => { itemSales[item.name] = (itemSales[item.name] || 0) + item.qty; }); paymentTotals[o.payment] = (paymentTotals[o.payment] || 0) + o.total; dailySales[o.date] = (dailySales[o.date] || 0) + o.total; });
    return { revenue: total, orders: filtered.length, avgOrder: filtered.length > 0 ? total / filtered.length : 0, itemSales: Object.entries(itemSales).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5), paymentTotals, dailySales: Object.entries(dailySales).map(([date, total]) => ({ date: date.slice(5), total })).slice(-7) };
  }, [orders, dateFilter, dateFrom, dateTo]);

  const COLORS = ['#059669', '#0891b2', '#7c3aed', '#db2777', '#ea580c'];

  if (authLoading) return <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><div className="text-white text-center"><div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p>Loading...</p></div></div>;
  if (!user && !isDemo) return <Auth onSkip={() => setIsDemo(true)} />;
  
  // Admin users get full-screen admin panel
  if (profile?.is_admin) return <AdminPage />;

  const mainDishes = menuItems.filter(i => i.category === 'main');
  const addonItems = menuItems.filter(i => i.category === 'addon');
  const nextOrderId = Math.max(...orders.map(o => o.id), 0) + 1;

  const DateRangeFilter = () => (
    <div className="flex flex-wrap items-center gap-2">
      {[['today', t('today')], ['month', t('thisMonth')], ['all', t('all')]].map(([key, label]) => (
        <button key={key} onClick={() => { setDateFilter(key); setDateFrom(''); setDateTo(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === key && !dateFrom && !dateTo ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{label}</button>
      ))}
      <div className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setDateFilter(''); }} className="text-xs border-0 bg-transparent focus:outline-none w-28" placeholder={t('from')} />
        <span className="text-gray-400 text-xs">→</span>
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setDateFilter(''); }} className="text-xs border-0 bg-transparent focus:outline-none w-28" placeholder={t('to')} />
        {(dateFrom || dateTo) && <button onClick={clearDateRange} className="text-gray-400 hover:text-gray-600 ml-1"><X size={14} /></button>}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar view={view} setView={setView} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} shopName={profile?.shop_name} />
        {toast && <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white font-medium animate-slide-in ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>{toast.message}</div>}

        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && view === 'pos' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-sm">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <span className="text-amber-800">
              {outOfStockItems.length > 0 && <span className="font-semibold text-red-600">{outOfStockItems.length} {t('outOfStock')}</span>}
              {outOfStockItems.length > 0 && lowStockItems.length > 0 && ' • '}
              {lowStockItems.length > 0 && <span>{lowStockItems.length} {t('lowStock')}</span>}
            </span>
          </div>
        )}

        <main className="flex-1 overflow-hidden">
          {view === 'profile' && <ProfilePage />}
          {view === 'support' && <ProfilePage initialTab="support" />}
          {view === 'admin' && profile?.is_admin && <AdminPage />}

          {view === 'pos' && (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-1 overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{t('menu')}</h2>
                    <p className="text-sm text-gray-500">{currentTime}</p>
                  </div>
                  <button onClick={openAddModal} className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                    <Plus size={18} /> {t('addItem')}
                  </button>
                </div>
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t('mainDishes')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {mainDishes.map(item => <MenuCard key={item.id} item={item} onAdd={addToCart} onEdit={openEditModal} variant="main" />)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t('addons')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {addonItems.map(item => <MenuCard key={item.id} item={item} onAdd={addToCart} onEdit={openEditModal} variant="addon" />)}
                  </div>
                </div>
              </div>
              <Cart cart={cart} onUpdateQty={updateQty} discount={discount} onSetDiscount={setDiscount} onCheckout={checkout} onQRPay={initiateQRPayment} loading={loading} currentTime={currentTime} nextOrderId={nextOrderId} />
            </div>
          )}

          {view === 'dashboard' && (
            <div className="p-4 lg:p-6 space-y-6 overflow-auto h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">{t('dashboard')}</h2>
                <DateRangeFilter />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><DollarSign size={24} className="text-emerald-600 mb-2" /><p className="text-sm text-gray-500">{t('totalSales')}</p><p className="text-2xl font-bold text-gray-800">RM {stats.revenue.toFixed(2)}</p></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><ShoppingCart size={24} className="text-blue-600 mb-2" /><p className="text-sm text-gray-500">{t('orders')}</p><p className="text-2xl font-bold text-gray-800">{stats.orders}</p></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><BarChart3 size={24} className="text-purple-600 mb-2" /><p className="text-sm text-gray-500">{t('average')}</p><p className="text-2xl font-bold text-gray-800">RM {stats.avgOrder.toFixed(2)}</p></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><Package size={24} className="text-amber-600 mb-2" /><p className="text-sm text-gray-500">{t('lowStockItems')}</p><p className="text-2xl font-bold text-gray-800">{lowStockItems.length + outOfStockItems.length}</p></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><h3 className="font-bold text-gray-800 mb-4">{t('topSelling')}</h3><ResponsiveContainer width="100%" height={220}><BarChart data={stats.itemSales}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="qty" fill="#059669" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><h3 className="font-bold text-gray-800 mb-4">{t('salesTrend')}</h3><ResponsiveContainer width="100%" height={220}><LineChart data={stats.dailySales}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => [`RM ${v.toFixed(2)}`, t('totalSales')]} /><Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} /></LineChart></ResponsiveContainer></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><h3 className="font-bold text-gray-800 mb-4">{t('paymentMethods')}</h3><div className="flex items-center gap-6"><ResponsiveContainer width="45%" height={180}><PieChart><Pie data={Object.entries(stats.paymentTotals).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">{Object.keys(stats.paymentTotals).map((_, idx) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}</Pie><Tooltip formatter={(v) => `RM ${v.toFixed(2)}`} /></PieChart></ResponsiveContainer><div className="space-y-3">{Object.entries(stats.paymentTotals).map(([method, total], idx) => (<div key={method} className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div><div><p className="text-sm font-medium text-gray-800">{method}</p><p className="text-sm text-gray-500">RM {total.toFixed(2)}</p></div></div>))}</div></div></div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> {t('stockAlert')}</h3><div className="space-y-2 max-h-48 overflow-auto">{outOfStockItems.map(item => (<div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl"><span className="text-sm flex items-center gap-2">{getFoodIcon(item.icon, 24)} {item.name}</span><span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{t('soldOut').toUpperCase()}</span></div>))}{lowStockItems.map(item => (<div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl"><span className="text-sm flex items-center gap-2">{getFoodIcon(item.icon, 24)} {item.name}</span><span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{item.stock_qty} {t('remaining')}</span></div>))}{!outOfStockItems.length && !lowStockItems.length && <p className="text-sm text-gray-500 text-center py-8">{t('allStockOk')}</p>}</div></div>
              </div>
            </div>
          )}

          {view === 'stock' && (
            <div className="p-4 lg:p-6 overflow-auto h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t('stockManagement')}</h2>
                <button onClick={fetchMenuItems} className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg"><RefreshCw size={16} /> {t('refresh')}</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menuItems.map(item => (
                  <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all hover:shadow-md ${item.stock_qty === null ? 'border-gray-100' : item.stock_qty <= 0 ? 'border-red-200 bg-red-50/30' : item.stock_qty <= 10 ? 'border-amber-200 bg-amber-50/30' : 'border-emerald-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {getFoodIcon(item.icon, 40)}
                      <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p><p className="text-xs text-gray-500">RM {item.price.toFixed(2)}</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`text-2xl font-bold ${item.stock_qty === null ? 'text-gray-400' : item.stock_qty <= 0 ? 'text-red-600' : item.stock_qty <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.stock_qty === null ? '∞' : item.stock_qty}<span className="text-xs font-normal text-gray-400 ml-1">{t('units')}</span>
                      </div>
                      <button onClick={() => { setStockItem(item); setShowStockModal(true); }} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-all">{t('update')}</button>
                    </div>
                    <button onClick={() => toggleAvailability(item)} className={`w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all ${item.is_available ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                      {item.is_available ? t('available') : t('unavailable')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'history' && (
            <div className="p-4 lg:p-6 overflow-auto h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t('orderHistory')}</h2>
                <DateRangeFilter />
              </div>
              {getFilteredOrders().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <History size={56} className="mb-3 opacity-30" /><p className="text-lg font-medium">{t('noOrders')}</p><p className="text-sm">{t('ordersWillAppear')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(getFilteredOrders().reduce((acc, order) => { if (!acc[order.date]) acc[order.date] = []; acc[order.date].push(order); return acc; }, {})).map(([date, dayOrders]) => (
                    <div key={date}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{new Date(date).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="text-xs text-gray-400">({dayOrders.length} {t('orders').toLowerCase()})</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dayOrders.map(order => (
                          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div><p className="font-bold text-gray-800">#{order.id}</p><p className="text-xs text-gray-500">{order.time}</p></div>
                              <div className="text-right"><p className="font-bold text-emerald-600">RM {order.total.toFixed(2)}</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.payment === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.payment}</span></div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {order.items.slice(0, 3).map((item, idx) => (<div key={idx}>{item.qty}x {item.name}</div>))}
                              {order.items.length > 3 && <div className="text-gray-400">+{order.items.length - 3} more</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* QR Payment Confirmation Modal */}
      {showQRConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{t('confirmQRPayment')}</h3>
            <p className="text-gray-500 mb-4">{t('customerPaidQR')}</p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-600">{t('total')}</p>
              <p className="text-3xl font-bold text-blue-700">RM {pendingTotal.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowQRConfirm(false)} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">{t('cancel')}</button>
              <button onClick={confirmQRPayment} className="py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Check size={18} /> {t('confirmed')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl">{editingItem ? t('editItem') : t('addNewItem')}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder={t('itemName')} value={modalItem.name} onChange={(e) => setModalItem({...modalItem, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              <input type="number" step="0.01" placeholder={`${t('price')} (RM)`} value={modalItem.price} onChange={(e) => setModalItem({...modalItem, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              <div className="grid grid-cols-2 gap-3">
                <select value={modalItem.category} onChange={(e) => setModalItem({...modalItem, category: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none">
                  <option value="main">{t('mainDishes')}</option>
                  <option value="addon">{t('addons')}</option>
                </select>
                <select value={modalItem.icon} onChange={(e) => setModalItem({...modalItem, icon: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none">
                  {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"><span className="text-sm text-gray-600">{t('preview')}:</span>{getFoodIcon(modalItem.icon, 56)}</div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder={t('stockQty')} value={modalItem.stock_qty} onChange={(e) => setModalItem({...modalItem, stock_qty: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" />
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-xl px-4 py-3"><input type="checkbox" checked={modalItem.is_available} onChange={(e) => setModalItem({...modalItem, is_available: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" /><span className="text-sm font-medium">{t('available')}</span></label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveMenuItem} disabled={loading} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 transition-all">{t('save')}</button>
              {editingItem && <button onClick={() => deleteMenuItem(editingItem.id)} className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all"><Trash2 size={20} /></button>}
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {showStockModal && stockItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl">{t('updateStock')}</h3>
              <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={24} /></button>
            </div>
            <div className="text-center mb-5">{getFoodIcon(stockItem.icon, 72)}<p className="font-semibold text-lg mt-3">{stockItem.name}</p><p className="text-gray-500">{t('currentStock')}: <span className="font-bold">{stockItem.stock_qty ?? '∞'}</span></p></div>
            <div className="grid grid-cols-3 gap-2 mb-4">{[10, 20, 30, 50, 100].map(qty => (<button key={qty} onClick={() => updateStock(qty)} className="py-3 bg-emerald-100 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-200 transition-all">{qty}</button>))}<button onClick={() => updateStock(null)} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">∞</button></div>
            <div className="flex gap-2"><input type="number" placeholder={t('otherAmount')} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" onKeyDown={(e) => e.key === 'Enter' && updateStock(parseInt(e.target.value))} /><button onClick={() => setShowStockModal(false)} className="px-5 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all">{t('close')}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <POSApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
