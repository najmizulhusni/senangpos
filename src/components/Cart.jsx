import { ShoppingCart, Minus, Plus, Trash2, Banknote, Smartphone } from 'lucide-react';
import { getFoodIcon } from './FoodIcons';
import { useLanguage } from '../context/LanguageContext';

export default function Cart({ cart, onUpdateQty, discount, onSetDiscount, onCheckout, onQRPay, loading, currentTime, nextOrderId }) {
  const { t } = useLanguage();
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const finalTotal = Math.max(0, cartTotal - discount);

  return (
    <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shadow-xl flex flex-col max-h-[50vh] lg:max-h-full">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{t('currentOrder')}</h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">#{nextOrderId}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{currentTime}</p>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <ShoppingCart size={40} className="mb-2 opacity-30" />
            <p className="text-sm">{t('noItems')}</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
              {getFoodIcon(item.icon || 'nasi-lemak', 32)}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-emerald-600 font-medium">RM {(item.price * item.qty).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                  {item.qty === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                </button>
                <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t-2 border-gray-100 space-y-3 bg-gray-50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('subtotal')}</span>
          <span className="font-semibold text-gray-800">RM {cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">{t('discount')}</span>
          <div className="flex-1 flex gap-1">
            {[5, 10].map(d => (
              <button key={d} onClick={() => onSetDiscount(discount === d ? 0 : d)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${discount === d ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                -RM{d}
              </button>
            ))}
          </div>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-orange-600 font-medium">
            <span>{t('discount')}</span>
            <span>-RM {discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
          <span>{t('total')}</span>
          <span className="text-emerald-600">RM {finalTotal.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onCheckout('Cash')} disabled={cart.length === 0 || loading}
            className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2">
            <Banknote size={18} /> {t('cash')}
          </button>
          <button onClick={onQRPay} disabled={cart.length === 0 || loading}
            className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2">
            <Smartphone size={18} /> {t('qrPay')}
          </button>
        </div>
      </div>
    </div>
  );
}
