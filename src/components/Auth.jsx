import { useState } from 'react';
import { ShoppingCart, Mail, Lock, User, Store, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Auth({ onSkip }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', shopName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) setError(error.message);
      } else if (mode === 'register') {
        const { error } = await signUp(form.email, form.password, form.fullName, form.shopName);
        if (error) setError(error.message);
        else setSuccess(language === 'ms' ? 'Akaun berjaya didaftarkan! Sila semak email.' : 'Account registered! Please check your email.');
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(form.email);
        if (error) setError(error.message);
        else setSuccess(t('resetEmailSent'));
      }
    } catch (err) { setError('Error occurred. Please try again.'); }
    setLoading(false);
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full -mr-16 -mt-16 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full -ml-12 -mb-12 opacity-20"></div>
        
        {/* Language Toggle */}
        <button onClick={toggleLanguage} className="absolute top-4 right-4 text-xs text-gray-500 hover:text-gray-700 z-10">
          {language === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShoppingCart className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SenangPOS</h1>
          <p className="text-gray-500 text-sm mt-1">Pasar Tani POS System</p>
        </div>

        {mode !== 'login' && (
          <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4">
            <ArrowLeft size={16} /> {t('backToLogin')}
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {mode === 'login' && t('login')}
            {mode === 'register' && t('register')}
            {mode === 'forgot' && t('forgotPassword')}
          </h2>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-200">{success}</div>}

          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="text" placeholder={t('fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} required />
              </div>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="text" placeholder={t('shopName')} value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className={inputClass} required />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" placeholder={t('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required />
          </div>

          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} placeholder={t('password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? '...' : mode === 'login' ? t('login') : mode === 'register' ? t('register') : t('sendResetEmail')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm relative z-10">
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('forgot'); setError(''); }} className="text-emerald-600 hover:underline">{t('forgotPassword')}</button>
              <p className="mt-3 text-gray-500">{t('noAccount')} <button onClick={() => { setMode('register'); setError(''); }} className="text-emerald-600 font-semibold hover:underline">{t('registerNow')}</button></p>
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t relative z-10 space-y-2">
          <button onClick={onSkip} className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm">{t('tryWithoutAccount')}</button>
          <button 
            onClick={() => { setMode('login'); setForm({ ...form, email: 'admin@senangpos.com', password: '' }); }}
            className="w-full py-2.5 text-purple-600 hover:text-purple-700 text-sm flex items-center justify-center gap-2"
          >
            <Shield size={14} />
            {language === 'ms' ? 'Log Masuk Admin' : 'Admin Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
