import { useState, useRef, useEffect } from 'react';
import { User, Phone, Save, Mail, Calendar, Shield, Globe, HelpCircle, Send, MessageCircle, ChevronDown, Bug, Lightbulb, CreditCard, UserCog, MoreHorizontal, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const SUPPORT_SUBJECTS = [
  { value: 'Bug Report', icon: Bug, color: 'text-red-500', bg: 'bg-red-50' },
  { value: 'Feature Request', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
  { value: 'Payment Issue', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
  { value: 'Account Help', icon: UserCog, color: 'text-purple-500', bg: 'bg-purple-50' },
  { value: 'Other', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-50' },
];

export default function ProfilePage({ initialTab = 'profile' }) {
  const { user, profile, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    shop_name: profile?.shop_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user's tickets
  useEffect(() => {
    if (user && activeTab === 'support') fetchTickets();
  }, [user, activeTab]);

  // Real-time ticket updates
  useEffect(() => {
    if (!supabase || !user) return;
    const sub = supabase.channel('my-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` }, fetchTickets)
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [user]);

  const fetchTickets = async () => {
    if (!supabase || !user) return;
    setTicketsLoading(true);
    const { data } = await supabase.from('support_tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setTickets(data);
    setTicketsLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile(form);
    if (!error) setSuccess(t('profileUpdated'));
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmitTicket = async () => {
    if (!supportForm.subject || !supportForm.message || !user) return;
    setSubmitLoading(true);
    const { error } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject: supportForm.subject,
      message: supportForm.message,
    });
    if (!error) {
      setSuccess(t('ticketSubmitted'));
      setSupportForm({ subject: '', message: '' });
      fetchTickets();
      setTimeout(() => setSuccess(''), 3000);
    }
    setSubmitLoading(false);
  };

  const selectedSubject = SUPPORT_SUBJECTS.find(s => s.value === supportForm.subject);

  const getStatusBadge = (status) => {
    if (status === 'open') return { text: t('statusOpen'), cls: 'bg-amber-100 text-amber-700' };
    if (status === 'in_progress') return { text: t('statusInProgress'), cls: 'bg-blue-100 text-blue-700' };
    return { text: t('statusResolved'), cls: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('myProfile')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('manageAccount')}</p>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">{form.full_name || 'User'}</h2>
                <p className="text-emerald-100 text-sm">{form.shop_name || 'My Shop'}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Mail size={14} className="text-gray-500" /></div>
                  <span className="truncate">{user?.email}</span>
                </div>
                {form.phone && (
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Phone size={14} className="text-gray-500" /></div>
                    <span>{form.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Calendar size={14} className="text-gray-500" /></div>
                  <span>{t('memberSince')} {user?.created_at ? new Date(user.created_at).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', { month: 'short', year: 'numeric' }) : '-'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-emerald-600" /> {t('language')}
              </h3>
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button onClick={() => setLanguage('en')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🇬🇧 English</button>
                <button onClick={() => setLanguage('ms')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'ms' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🇲🇾 Melayu</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5">
              <div className="flex gap-1">
                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <User size={16} /> {t('profileInfo')}
                </button>
                <button onClick={() => setActiveTab('support')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'support' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <HelpCircle size={16} /> {t('support')}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">{t('profileInfo')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('fullName')}</label>
                    <input type="text" placeholder={t('fullName')} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('shopName')}</label>
                    <input type="text" placeholder={t('shopName')} value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                    <input type="tel" placeholder="012-3456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('address')}</label>
                    <textarea placeholder={t('address')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none transition-all" rows={2} />
                  </div>
                </div>
                <button onClick={handleSave} disabled={loading} className="mt-5 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {loading ? t('saving') : t('saveChanges')}
                </button>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <>
                {/* Submit Ticket Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Send size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{t('submitTicket')}</h3>
                      <p className="text-sm text-gray-500">{t('supportDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('subject')}</label>
                      <div className="relative" ref={dropdownRef}>
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-sm transition-all ${dropdownOpen ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-gray-300'}`}>
                          {selectedSubject ? (
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${selectedSubject.bg} rounded-lg flex items-center justify-center`}>
                                <selectedSubject.icon size={16} className={selectedSubject.color} />
                              </div>
                              <span className="text-gray-800">{t(supportForm.subject.toLowerCase().replace(/\s/g, ''))}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">{t('selectSubject')}</span>
                          )}
                          <ChevronDown size={18} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {SUPPORT_SUBJECTS.map((subject) => (
                              <button key={subject.value} type="button" onClick={() => { setSupportForm({ ...supportForm, subject: subject.value }); setDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${supportForm.subject === subject.value ? 'bg-emerald-50' : ''}`}>
                                <div className={`w-8 h-8 ${subject.bg} rounded-lg flex items-center justify-center`}>
                                  <subject.icon size={16} className={subject.color} />
                                </div>
                                <span className="text-sm text-gray-700">{t(subject.value.toLowerCase().replace(/\s/g, ''))}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('message')}</label>
                      <textarea placeholder={t('describeIssue')} value={supportForm.message} onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none transition-all" rows={4} />
                    </div>

                    <button onClick={handleSubmitTicket} disabled={!supportForm.subject || !supportForm.message || submitLoading} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitLoading ? <><Loader2 size={18} className="animate-spin" /> {t('sending')}</> : <><Send size={18} /> {t('submitTicket')}</>}
                    </button>
                  </div>

                  <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-700 flex items-center gap-2">
                      <HelpCircle size={16} /> {t('ticketNote')}
                    </p>
                  </div>
                </div>

                {/* My Tickets History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle size={20} className="text-emerald-600" /> {t('myTickets')}
                  </h3>

                  {ticketsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-emerald-500" />
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <CheckCircle size={40} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">{t('noTickets')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map(ticket => {
                        const badge = getStatusBadge(ticket.status);
                        return (
                          <div key={ticket.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.cls}`}>{badge.text}</span>
                                <span className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{t(ticket.subject.toLowerCase().replace(/\s/g, ''))}</h4>
                            <p className="text-sm text-gray-600">{ticket.message}</p>

                            {/* Admin Reply */}
                            {ticket.admin_reply && (
                              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <Shield size={14} className="text-emerald-600" />
                                  <span className="text-xs font-semibold text-emerald-700">{t('adminReply')}</span>
                                  {ticket.replied_at && <span className="text-xs text-emerald-500">{new Date(ticket.replied_at).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                                </div>
                                <p className="text-sm text-emerald-800">{ticket.admin_reply}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-emerald-600" /> {t('accountStatus')}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-100">
                  <p className="text-sm text-emerald-600 font-medium">{t('status')}</p>
                  <p className="text-xl font-bold text-emerald-700 mt-1">{t('active')}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">{t('plan')}</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">{t('free')}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">{t('orders')}</p>
                  <p className="text-xl font-bold text-purple-700 mt-1">∞</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
