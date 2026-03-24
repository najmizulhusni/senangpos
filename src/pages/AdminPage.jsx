import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Store, Search, Eye, CheckCircle, Clock, RefreshCw, LogOut, LayoutDashboard, MessageSquare, Shield, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminPage() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!supabase) return;

    const profilesSub = supabase.channel('admin-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchAllData();
        setLastUpdate(new Date());
      }).subscribe();

    const ordersSub = supabase.channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAllData();
        setLastUpdate(new Date());
      }).subscribe();

    const ticketsSub = supabase.channel('admin-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
        fetchAllData();
        setLastUpdate(new Date());
      }).subscribe();

    return () => {
      supabase.removeChannel(profilesSub);
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(ticketsSub);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (profilesData) setUsers(profilesData);

      const { data: ordersData } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      if (ordersData && profilesData) {
        const ordersWithProfiles = ordersData.map(order => ({
          ...order,
          profiles: profilesData.find(p => p.id === order.user_id) || null
        }));
        setAllOrders(ordersWithProfiles);
      }

      const { data: ticketsData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (ticketsData && profilesData) {
        const ticketsWithProfiles = ticketsData.map(ticket => ({
          ...ticket,
          profiles: profilesData.find(p => p.id === ticket.user_id) || null
        }));
        setTickets(ticketsWithProfiles);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
    setLoading(false);
  };

  // Stats calculations
  const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const totalOrders = allOrders.length;
  const activeUsers = users.filter(u => !u.is_admin).length;
  const openTickets = tickets.filter(t => t.status === 'open').length;

  const getFilteredOrders = () => {
    const now = new Date();
    const ranges = { today: 1, week: 7, month: 30, all: 9999 };
    const days = ranges[dateRange] || 7;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return allOrders.filter(o => new Date(o.created_at) >= cutoff);
  };

  const getDailySales = () => {
    const filtered = getFilteredOrders();
    const salesByDate = {};
    filtered.forEach(o => {
      const date = o.created_at.split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + parseFloat(o.total || 0);
    });
    return Object.entries(salesByDate).map(([date, total]) => ({ date: date.slice(5), total })).slice(-14);
  };

  const getTopSellers = () => {
    const sellerSales = {};
    allOrders.forEach(o => {
      const name = o.profiles?.shop_name || 'Unknown';
      if (name !== 'Unknown') sellerSales[name] = (sellerSales[name] || 0) + parseFloat(o.total || 0);
    });
    return Object.entries(sellerSales).map(([name, total]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  };

  const filteredUsers = users.filter(u => 
    !u.is_admin && (
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Sellers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'tickets', label: 'Support', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    if (confirm('Log out from admin?')) await signOut();
  };

  if (loading && users.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Admin Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">SenangPOS</h1>
                <p className="text-xs text-emerald-600 font-medium">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-emerald-600' : 'text-gray-400'} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'tickets' && openTickets > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{openTickets}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Admin Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-emerald-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Administrator</p>
              <p className="text-xs text-gray-500">Full Access</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {navItems.find(n => n.id === activeTab)?.label || 'Overview'}
                </h1>
                <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString('en-MY')}</p>
              </div>
            </div>
            <button onClick={fetchAllData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <DollarSign size={24} className="text-emerald-600" />
                    </div>
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">RM {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={24} className="text-blue-600" />
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">{dateRange === 'week' ? '7 Days' : dateRange === 'month' ? '30 Days' : 'All Time'}</span>
                  </div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-purple-600" />
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">Total</span>
                  </div>
                  <p className="text-sm text-gray-500">Active Sellers</p>
                  <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <MessageSquare size={24} className="text-amber-600" />
                    </div>
                    {openTickets > 0 && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">{openTickets} new</span>}
                  </div>
                  <p className="text-sm text-gray-500">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Sales Trend</h3>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      {['week', 'month', 'all'].map(range => (
                        <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${dateRange === range ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                          {range === 'week' ? '7D' : range === 'month' ? '30D' : 'All'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={getDailySales()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} formatter={(v) => [`RM ${v.toFixed(2)}`, 'Sales']} />
                      <Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Top Sellers</h3>
                  {getTopSellers().length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={getTopSellers()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6b7280' }} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} formatter={(v) => [`RM ${v.toFixed(2)}`, 'Sales']} />
                        <Bar dataKey="total" fill="#059669" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-400">No sales data yet</div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {allOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Store size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{order.profiles?.shop_name || 'Unknown Shop'}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('en-MY')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">RM {parseFloat(order.total).toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.payment_method === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.payment_method}
                        </span>
                      </div>
                    </div>
                  ))}
                  {allOrders.length === 0 && <p className="text-center text-gray-400 py-8">No orders yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* Users/Sellers Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input type="text" placeholder="Search sellers by name or shop..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Seller</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Shop</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(user => {
                        const userOrders = allOrders.filter(o => o.user_id === user.id);
                        const userRevenue = userOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">{(user.full_name || 'U')[0].toUpperCase()}</span>
                                </div>
                                <p className="font-medium text-gray-800">{user.full_name || '-'}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600">{user.shop_name || '-'}</td>
                            <td className="px-4 py-4 text-gray-500">{user.phone || '-'}</td>
                            <td className="px-4 py-4 text-gray-500 text-sm">{new Date(user.created_at).toLocaleDateString('en-MY')}</td>
                            <td className="px-4 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">{userOrders.length}</span></td>
                            <td className="px-4 py-4 font-bold text-emerald-600">RM {userRevenue.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No sellers found</p>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Shop</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allOrders.slice(0, 50).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-emerald-600">#{order.order_number || order.id.slice(0, 8)}</span>
                          </td>
                          <td className="px-4 py-4 text-gray-600">{order.profiles?.shop_name || '-'}</td>
                          <td className="px-4 py-4 text-gray-500">{order.order_items?.length || 0} items</td>
                          <td className="px-4 py-4 font-bold text-emerald-600">RM {parseFloat(order.total).toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.payment_method === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.payment_method}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('en-MY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {allOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {/* Ticket Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock size={20} className="text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{tickets.filter(t => t.status === 'open').length}</p>
                  <p className="text-xs text-gray-500">Open</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Eye size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'in_progress').length}</p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                    <CheckCircle size={48} className="mx-auto mb-3 text-green-200" />
                    <p className="font-medium text-gray-500">No support tickets</p>
                    <p className="text-sm text-gray-400">All clear!</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.status === 'open' ? 'Open' : ticket.status === 'in_progress' ? 'In Progress' : 'Resolved'}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleString('en-MY')}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">{ticket.subject}</h4>
                          <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                          <p className="text-xs text-gray-400">From: {ticket.profiles?.full_name || 'Unknown'} ({ticket.profiles?.shop_name || '-'})</p>
                        </div>
                        <div className="flex gap-2">
                          {ticket.status === 'open' && (
                            <button 
                              onClick={async () => {
                                await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('id', ticket.id);
                                fetchAllData();
                              }}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-all"
                            >
                              Start
                            </button>
                          )}
                          {ticket.status !== 'resolved' && (
                            <button 
                              onClick={async () => {
                                await supabase.from('support_tickets').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', ticket.id);
                                fetchAllData();
                              }}
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-all"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
